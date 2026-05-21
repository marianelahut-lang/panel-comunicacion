# Panel Comunicación V2

## Objetivo

Construir una versión estable del panel, separada del panel actual, reutilizando los datos existentes y evitando nuevos parches.

La V2 no debe perder información cargada en tareas, agentes, funcionarios, medios, reclamos, agenda, calendarios, guardias, entrevistas ni recursos.

## Hoy

Debe mostrar:

- día actual
- guardia titular y soporte del día
- eventos del calendario del día
- botón Cubrir / Se cubre para cada evento
- entrevistas pactadas con funcionarios
- las 10 actividades pendientes con mayor demora, ordenadas de más días vencidos a menos

Reglas:

- solo mostrar actividades pendientes
- excluir completas, realizadas y ya pasadas a publicar
- cada actividad debe abrirse para editar
- evento cubierto después de las 15:00 pasa a Guardias

## Tablero

Columnas permitidas:

- Pendiente
- En proceso
- Lista
- Lista para publicar

No debe existir columna Realizada.

Debe permitir:

- crear nueva tarea
- editar actividad
- cambiar estado / etiqueta
- buscar por etiqueta, responsable, prioridad o texto
- enviar Lista para publicar a Material disponible

## Material y Agenda de publicaciones

Deben funcionar como un mismo circuito.

Material disponible:

- muestra contenidos listos para publicar
- permite editar, eliminar y programar

Agenda de publicaciones:

- muestra contenidos programados
- permite editar, eliminar y modificar fecha / hora

Reglas:

- publicación después de las 15:00 pasa a Guardias
- no debe duplicar contenidos
- si se desprograma, vuelve a Material disponible

## Calendario

Debe mostrar eventos sincronizados de todos los calendarios.

Debe tener:

- vista día
- vista mes
- eventos legibles
- botón Cubrir / Se cubre
- guardia visible debajo de cada día

Regla:

- evento cubierto después de las 15:00 pasa a Guardias

## Guardias

Debe mostrar la semana completa.

Debe incluir:

- titular y soporte por día
- actividades elegidas para cubrir
- publicaciones posteriores a las 15:00
- eventos cubiertos posteriores a las 15:00
- botón WhatsApp para enviar tareas de guardia
- edición de guardias

## Equipo

Debe mantener la lógica actual, pero estable.

Debe mostrar por agente:

- tareas asignadas
- pendientes
- en proceso
- listas
- listas para publicar
- porcentaje de completadas
- análisis de carga
- datos de contacto
- botón WhatsApp para enviar pendientes y en proceso

Debe permitir editar datos del agente.

## Métricas

No debe estar visible en la navegación principal.

## Medios

Debe permitir:

- cargar contactos
- editar contactos
- eliminar contactos
- filtrar contactos
- seleccionar destinatarios
- enviar gacetilla masiva

## Entrevistas

Debe mantenerse como está si funciona correctamente.

Debe avisar al funcionario y mostrar entrevistas del día en Hoy.

## Recursos

Debe ser un espacio editable para links de uso del equipo.

Debe permitir cargar, editar, eliminar y categorizar recursos.

## Generador de flyers

Debe conservarse como está.

## Navegación V2

Debe incluir:

- Hoy
- Tablero
- Material / Agenda
- Calendario
- Guardias
- Equipo
- Medios
- Reclamos
- Entrevistas
- Contactos medios
- Recursos
- Generador de flyers

No incluir Métricas.

## Reglas técnicas

Evitar:

- scripts duplicados
- observers infinitos
- renderizados duplicados
- botones sin acción
- overlays bloqueando clicks
- columnas que reaparecen
- textos con encoding roto
- calendario ilegible
- scroll bloqueado

## Arquitectura sugerida

Archivos base:

- index-v2.html
- src-v2/config.js
- src-v2/state.js
- src-v2/api.js
- src-v2/router.js
- src-v2/styles.css
- src-v2/modules/hoy.js
- src-v2/modules/tablero.js
- src-v2/modules/materialAgenda.js
- src-v2/modules/calendario.js
- src-v2/modules/guardias.js
- src-v2/modules/equipo.js
- src-v2/modules/medios.js
- src-v2/modules/entrevistas.js
- src-v2/modules/recursos.js

## Primera etapa

Construir primero:

1. Hoy
2. Tablero
3. Material / Agenda
4. Calendario
5. Guardias
6. Equipo

Luego sumar Medios, Entrevistas, Recursos y Reclamos.
