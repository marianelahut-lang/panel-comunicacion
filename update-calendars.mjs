import ICAL from 'ical.js';

// Google publica series recurrentes en iCal como una regla RRULE.
// El panel anterior sólo interpretaba DTSTART y perdía las ocurrencias.
function expandRecurringICS(raw){
  const root=new ICAL.Component(ICAL.parse(raw));
  const components=root.getAllSubcomponents('vevent');
  const exceptions=new Set(components.filter(c=>c.hasProperty('recurrence-id')).map(c=>c.getFirstPropertyValue('uid')));
  const start=new Date();start.setUTCDate(start.getUTCDate()-45);
  const end=new Date();end.setUTCDate(end.getUTCDate()+400);
  const localFormat=d=>{
    const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'America/Argentina/Buenos_Aires',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(d).map(x=>[x.type,x.value]));
    return p.year+p.month+p.day+'T'+p.hour+p.minute+'00';
  };
  const escape=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  let extra='',count=0;
  for(const comp of components){
    if(!comp.hasProperty('rrule')||comp.hasProperty('recurrence-id'))continue;
    const ev=new ICAL.Event(comp);
    const iter=ev.iterator();
    const uid=String(comp.getFirstPropertyValue('uid')||'recurrente');
    const title=String(comp.getFirstPropertyValue('summary')||'');
    const loc=String(comp.getFirstPropertyValue('location')||'');
    const desc=String(comp.getFirstPropertyValue('description')||'');
    let occurrence,limit=0;
    while((occurrence=iter.next())&&limit++<20000){
      const date=occurrence.toJSDate();
      if(date>end)break;
      if(date<start)continue;
      // UID único por fecha para que el panel conserve todas las sesiones.
      extra+='BEGIN:VEVENT\r\nUID:'+escape(uid+'-instance-'+localFormat(date))+'\r\nDTSTART:'+localFormat(date)+'\r\nSUMMARY:'+escape(title)+'\r\nLOCATION:'+escape(loc)+'\r\nDESCRIPTION:'+escape(desc)+'\r\nEND:VEVENT\r\n';
      count++;
    }
  }
  // Se conservan los VEVENT originales y los eventos excepcionales.
  // Las ocurrencias sintéticas cubren el período de trabajo del panel.
  return {text:raw.replace('END:VCALENDAR',extra+'END:VCALENDAR'),expanded:count};
}
const calendars = [
  ['intendente', '642f04e4333c91e3c67f35a779bd775a7c4cc6d05700da68376b0ff313ea9f0b@group.calendar.google.com'],
  ['prensa', '5544ba9213caabc95391100bdbbf45c01574bd0112e1ad7198123c4a36a8de61@group.calendar.google.com'],
  ['municipal', 'tresarroyosprensa@gmail.com'],
];
const snapshots = await Promise.all(calendars.map(async ([name, id]) => {
  const url = 'https://calendar.google.com/calendar/ical/'+encodeURIComponent(id)+'/public/basic.ics';
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) { console.warn(name+': HTTP '+response.status); return {name, error:'HTTP '+response.status}; }
  const text = await response.text();
  if (!text.includes('BEGIN:VCALENDAR') || !text.includes('END:VCALENDAR')) {
    console.warn(name+': respuesta no válida'); return {name,error:'respuesta no válida'};
  }
  const expanded=expandRecurringICS(text);
  return { name, text:expanded.text, expanded:expanded.expanded, events: (expanded.text.match(/BEGIN:VEVENT/g) || []).length };
}));
// Usa la misma conexión pública que ya utiliza el panel. Los eventos se guardan
// en su base existente; no se escriben archivos ni se publican eventos en GitHub.
const configResponse=await fetch('https://raw.githubusercontent.com/marianelahut-lang/panel-comunicacion/bc2b796cb330c12c0fe06eda2c3a82e4995bcd17/index.html',{signal:AbortSignal.timeout(15000)});
if(!configResponse.ok)throw new Error('No se pudo leer la configuración del panel');
const configText=await configResponse.text();
const supabaseUrl=configText.match(/supabaseUrl:'([^']+)'/)?.[1];
const supabaseKey=configText.match(/supabaseKey:'([^']+)'/)?.[1];
if(!supabaseUrl||!supabaseKey)throw new Error('Configuración incompleta');
const valid = snapshots.filter(x => typeof x.text === 'string');
if (!valid.length) throw new Error('Ningún calendario respondió correctamente; se conserva la copia anterior');
const previousResponse = await fetch(supabaseUrl+'/rest/v1/panel_data?key=eq.panel_calendar_feeds&select=value&limit=1', {
  headers:{apikey:supabaseKey,Authorization:'Bearer '+supabaseKey}
});
const previousRows = previousResponse.ok ? await previousResponse.json() : [];
const previous = previousRows[0]?.value || {};
const value={
  updatedAt: new Date().toISOString(),
  calendars: calendars.map(([name]) => {
    const fresh = valid.find(x => x.name === name);
    if(fresh) return {name,events:fresh.events,text:fresh.text,file:'calendar-'+name+'.ics',updatedAt:new Date().toISOString()};
    const old = (previous.calendars||[]).find(x=>x.name===name);
    return old ? {...old,stale:true} : {name,error:'No disponible',file:'calendar-'+name+'.ics'};
  }),
};
const response=await fetch(supabaseUrl+'/rest/v1/panel_data',{
  method:'POST',signal:AbortSignal.timeout(30000),
  headers:{apikey:supabaseKey,Authorization:'Bearer '+supabaseKey,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},
  body:JSON.stringify({key:'panel_calendar_feeds',value,updated_at:value.updatedAt,updated_by:'calendar-sync'})
});
if(!response.ok)throw new Error('No se pudo actualizar la fuente del panel: HTTP '+response.status);
console.log(snapshots.map(({name, events,expanded,error}) => name+': '+(events||0)+' eventos ('+(expanded||0)+' ocurrencias recurrentes) '+(error||'')).join('\n'));
