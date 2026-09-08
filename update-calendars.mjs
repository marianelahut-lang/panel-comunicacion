const calendars = [
  ['intendente', '642f04e4333c91e3c67f35a779bd775a7c4cc6d05700da68376b0ff313ea9f0b@group.calendar.google.com'],
  ['prensa', '5544ba9213caabc95391100bdbbf45c01574bd0112e1ad7198123c4a36a8de61@group.calendar.google.com'],
  ['municipal', 'tresarroyosprensa@gmail.com'],
];
const snapshots = await Promise.all(calendars.map(async ([name, id]) => {
  const url = 'https://calendar.google.com/calendar/ical/'+encodeURIComponent(id)+'/public/basic.ics';
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(name+': HTTP '+response.status);
  const text = await response.text();
  if (!text.includes('BEGIN:VCALENDAR') || !text.includes('END:VCALENDAR')) {
    throw new Error(name+': respuesta no válida; se conserva la copia anterior');
  }
  return { name, text, events: (text.match(/BEGIN:VEVENT/g) || []).length };
}));
// Usa la misma conexión pública que ya utiliza el panel. Los eventos se guardan
// en su base existente; no se escriben archivos ni se publican eventos en GitHub.
const configResponse=await fetch('https://raw.githubusercontent.com/marianelahut-lang/panel-comunicacion/bc2b796cb330c12c0fe06eda2c3a82e4995bcd17/index.html',{signal:AbortSignal.timeout(15000)});
if(!configResponse.ok)throw new Error('No se pudo leer la configuración del panel');
const configText=await configResponse.text();
const supabaseUrl=configText.match(/supabaseUrl:'([^']+)'/)?.[1];
const supabaseKey=configText.match(/supabaseKey:'([^']+)'/)?.[1];
if(!supabaseUrl||!supabaseKey)throw new Error('Configuración incompleta');
const value={
  updatedAt: new Date().toISOString(),
  calendars: snapshots.map(({ name, events, text }) => ({ name, events, text, file:'calendar-'+name+'.ics' })),
};
const response=await fetch(supabaseUrl+'/rest/v1/panel_data',{
  method:'POST',signal:AbortSignal.timeout(30000),
  headers:{apikey:supabaseKey,Authorization:'Bearer '+supabaseKey,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},
  body:JSON.stringify({key:'panel_calendar_feeds',value,updated_at:value.updatedAt,updated_by:'calendar-sync'})
});
if(!response.ok)throw new Error('No se pudo actualizar la fuente del panel: HTTP '+response.status);
console.log(snapshots.map(({name, events}) => name+': '+events+' eventos').join('\n'));
