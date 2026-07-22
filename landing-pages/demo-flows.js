/* ══════════════════════════════════════════════════════════════════
   DEMO — ÁRBOLES DE CONVERSACIÓN
   Cada rubro es un vendedor real, no un menú de opciones. Califica,
   recomienda una, maneja la objeción y cierra pidiendo un compromiso
   chico (visita, test drive, seña) antes del grande.

   Reglas de escritura del diálogo:
   1. Recomienda, no lista. "De las tres, la que más se lleva la gente…"
   2. La escasez siempre es de stock real. Nunca urgencia inventada.
   3. La objeción se responde con una pregunta, no con un descuento.
   4. Cierre por alternativa: "¿jueves a la mañana o viernes a la tarde?"
      nunca "¿querés venir?".
   5. Nada que el sistema no pueda cumplir. Si hace falta un humano,
      lo dice y deriva.

   Esquema de nodo:
   { bot:  string | fn(c)      texto del mensaje (\n = salto)
     bots: [string|fn]         varios globos seguidos
     card / cards              tarjeta(s) "foto" adjuntas (ver demo.js)
     opts: [{t,n,k,v}]         respuestas rápidas. k=guarda en contexto
     input:{ph,ex,k,n}         texto libre
     proc: [string]            log del panel de procesos
     end:  true                fin del flujo }
   ══════════════════════════════════════════════════════════════════ */

window.DEMO_RUBROS = [
  { id:'inmobiliaria',  icon:'🏠', titulo:'Inmobiliaria',        sub:'Compra, alquiler y captación',   negocio:'Grupo Norte Propiedades', inicial:'G', color:'#1e6f5c', circuito:'ventas'   },
  { id:'concesionaria', icon:'🚗', titulo:'Concesionaria',       sub:'0km, usados, permuta y planes',  negocio:'Automotores del Valle',   inicial:'A', color:'#1d3557', circuito:'ventas'   },
  { id:'corralon',      icon:'🧱', titulo:'Corralón',            sub:'Cómputo de obra y cotización',   negocio:'Corralón Florida Norte',  inicial:'C', color:'#8a4b1f', circuito:'ventas'   },
  { id:'autopartes',    icon:'🔧', titulo:'Autopartes / Moto',   sub:'Repuesto por patente y modelo',  negocio:'Repuestos del Valle',     inicial:'R', color:'#3f4a54', circuito:'ventas'   },
  { id:'ropa',          icon:'👕', titulo:'Tienda de ropa',      sub:'Catálogo, talles y envíos',      negocio:'Alfis Jeans',             inicial:'A', color:'#6d3b8e', circuito:'ventas'   },
  { id:'reservas',      icon:'📅', titulo:'Reservas y turnos',   sub:'Sirve para cualquier agenda',    negocio:'Tu negocio',              inicial:'T', color:'#0066FF', circuito:'reservas' }
];

window.DEMO_FLOWS = {

/* ══════════════════════════════════════════════════════════════════
   1 · INMOBILIARIA — Grupo Norte Propiedades
   El vendedor inmobiliario califica por forma de pago antes de mostrar
   nada: es lo que separa al comprador del paseante. La captación
   (vender/alquilar mi propiedad) va en el menú principal porque para
   una inmobiliaria el que ofrece propiedad vale más que el que busca.
   ══════════════════════════════════════════════════════════════════ */
inmobiliaria:{
  start:{bot:'¡Hola! Soy Caro, de Grupo Norte Propiedades 🏠\nAtiendo por acá a cualquier hora, así no esperás a que abra la oficina.\n\n¿En qué andás?',opts:[
    {t:'🏠 Quiero comprar',n:'c_tipo'},
    {t:'🔑 Busco alquilar',n:'a_tipo'},
    {t:'📤 Quiero vender o alquilar mi propiedad',n:'cap_que'},
    {t:'📸 Mostrame lo destacado',n:'destacadas'},
    {t:'❓ Tengo una duda',n:'dudas'},
    {t:'📞 Hablar con una persona',n:'persona'}
  ],proc:['📡 Consulta entrante — WhatsApp','👤 Contacto nuevo: sin ficha previa','🤖 Asistente de ventas activo']},

  /* ── COMPRA ─────────────────────────────────────────── */
  c_tipo:{bot:'Buenísimo. ¿Qué estás buscando?',opts:[
    {t:'Casa',n:'c_zona',k:'tipo'},{t:'Departamento',n:'c_zona',k:'tipo'},
    {t:'Terreno',n:'c_zona',k:'tipo'},{t:'Local o galpón',n:'c_zona',k:'tipo'}
  ],proc:['📋 Abriendo ficha de comprador…']},

  c_zona:{bot:'¿En qué zona te gustaría?',opts:[
    {t:'Centro',n:'c_pres',k:'zona'},{t:'Valle Viejo',n:'c_pres',k:'zona'},
    {t:'B° Jardín / Norte',n:'c_pres',k:'zona'},{t:'Sur / Chacarita',n:'c_pres',k:'zona'},
    {t:'Me da igual, escucho',n:'c_pres',k:'zona',v:'zona abierta'}
  ]},

  c_pres:{bot:'¿Con qué presupuesto te manejás? Te pregunto para no hacerte perder el tiempo con cosas fuera de rango.',opts:[
    {t:'Hasta USD 50.000',n:'c_pago',k:'pres'},{t:'USD 50.000 a 90.000',n:'c_pago',k:'pres'},
    {t:'USD 90.000 a 150.000',n:'c_pago',k:'pres'},{t:'Más de USD 150.000',n:'c_pago',k:'pres'},
    {t:'Todavía no lo tengo claro',n:'c_pago',k:'pres',v:'a definir'}
  ]},

  c_pago:{bot:'Última y te muestro: ¿cómo pensás pagarlo?',opts:[
    {t:'💵 Contado',n:'c_lista',k:'pago'},
    {t:'🏦 Con crédito hipotecario',n:'c_credito',k:'pago'},
    {t:'🔄 Entrego otra propiedad en parte de pago',n:'c_permuta',k:'pago'},
    {t:'Parte contado, parte a convenir',n:'c_lista',k:'pago'}
  ],proc:['🎯 Calificando lead: tipo + zona + presupuesto + forma de pago','⭐ Puntaje de intención: alto']},

  c_credito:{bot:'Perfecto, trabajamos con crédito. Dos cosas que te van a servir:\n\n• El banco financia hasta el 75% de la tasación, así que necesitás el 25% en mano.\n• La tasación la coordina el banco, pero nosotros preparamos toda la carpeta.\n\nTe muestro lo que entra en tu rango y que además sea apto crédito (escritura al día).',opts:[
    {t:'Dale, mostrame',n:'c_lista'}
  ],proc:['🏦 Filtrando: solo propiedades aptas crédito','📄 Verificando estado de escrituras']},

  c_permuta:{bot:'Se puede, hacemos permutas seguido.\nLo que hago es tasarte la tuya sin cargo y ver la diferencia contra la que te guste.\n\nPrimero mirá lo que hay y después vemos los números.',opts:[
    {t:'Dale, mostrame',n:'c_lista'}
  ],proc:['🔄 Marcando operación como permuta','📋 Nota para tasación de la propiedad del cliente']},

  c_lista:{bot:function(c){return 'Mirá, tengo tres que te pueden cerrar para '+String(c.tipo||'propiedad').toLowerCase()+' en '+(c.zona||'la zona')+' 👇'},
    cards:[
      {k:'casa', t:'Casa 3 dorm. — B° Jardín', s:'180 m² · 3 dorm · 2 baños · cochera · patio con parrilla', p:'USD 118.000', b:'Apta crédito'},
      {k:'depto',t:'Depto 2 amb. a estrenar — Centro', s:'62 m² · 1 dorm · balcón · a 4 cuadras de la plaza', p:'USD 64.000', b:'Entrega inmediata'},
      {k:'casa', t:'Casa con pileta — Valle Viejo', s:'240 m² · 3 dorm · quincho · pileta · 600 m² de terreno', p:'USD 142.000'}
    ],
    bots:['Si me pedís que te diga una: la del Jardín. Está bien de precio para los metros que tiene y es la única de las tres con escritura lista, así que si sale crédito no te frena nada.\n\n¿Alguna te movió el amperímetro?'],
    opts:[
      {t:'Me gusta la del Jardín',n:'c_visita',k:'prop',v:'Casa 3 dorm. — B° Jardín'},
      {t:'Me gusta el depto del Centro',n:'c_visita',k:'prop',v:'Depto 2 amb. — Centro'},
      {t:'Me gusta la de Valle Viejo',n:'c_visita',k:'prop',v:'Casa con pileta — Valle Viejo'},
      {t:'😬 Se me va de presupuesto',n:'obj_precio'},
      {t:'Mostrame otras',n:'c_otras'}
    ],
    proc:['🏠 Cruzando 47 propiedades en cartera','✅ 3 coinciden con el perfil','📸 Adjuntando fichas con fotos','⭐ Ordenando por probabilidad de cierre']},

  obj_precio:{bot:'Te entiendo, y prefiero que me lo digas ahora y no después de tres visitas al pedo 😅\n\nAyudame a afinar: ¿el tema es el precio de lista, o es la plata que tenés que poner de entrada?',opts:[
    {t:'El precio en sí',n:'obj_precio_a'},
    {t:'La plata de entrada',n:'obj_precio_b'},
    {t:'Quiero ver algo más económico',n:'c_economicas'}
  ],proc:['⚠️ Objeción detectada: presupuesto','🧭 Derivando a recuperación, no a descuento']},

  obj_precio_a:{bot:'Dale. Dos cosas concretas:\n\n1) La de Valle Viejo el dueño la tiene publicada hace 4 meses y ya bajó una vez. Hay margen para ofertar, no te voy a decir cuánto por WhatsApp pero hay.\n\n2) Si te sirve, tengo dos más chicas en la misma zona que no publicamos todavía.\n\n¿Te mando esas dos?',opts:[
    {t:'Sí, mandame esas dos',n:'c_economicas'},
    {t:'Prefiero ir a ver la de Valle Viejo y ofertar',n:'c_visita',k:'prop',v:'Casa con pileta — Valle Viejo'}
  ]},

  obj_precio_b:{bot:'Ahí está el punto entonces, y tiene solución.\n\nCon crédito hipotecario entrás poniendo el 25%. Sobre la del Jardín serían unos USD 29.500 tuyos y el resto financiado. Hay propietarios que además aceptan la seña en cuotas hasta que sale el crédito.\n\n¿Querés que te arme el número fino de esa?',opts:[
    {t:'Sí, armame el número',n:'c_visita',k:'prop',v:'Casa 3 dorm. — B° Jardín'},
    {t:'Mostrame algo más económico igual',n:'c_economicas'}
  ],proc:['🧮 Simulando estructura de pago 25/75']},

  c_economicas:{bot:'Va, estas dos entran mucho más abajo 👇',
    cards:[
      {k:'depto',t:'Monoambiente — Centro', s:'38 m² · reciclado · ideal renta · alquilado a $310.000', p:'USD 38.000', b:'Renta 9,8% anual'},
      {k:'lote', t:'Terreno 300 m² — Valle Viejo', s:'10x30 · con servicios en la puerta · escritura', p:'USD 27.000'}
    ],
    bots:['El monoambiente lo tengo con inquilino adentro pagando, así que arranca generando desde el primer mes. Es el que más consultas tiene.'],
    opts:[
      {t:'Me interesa el monoambiente',n:'c_visita',k:'prop',v:'Monoambiente — Centro'},
      {t:'Me interesa el terreno',n:'c_visita',k:'prop',v:'Terreno 300 m² — Valle Viejo'},
      {t:'Ninguna por ahora',n:'seguimiento'}
    ],proc:['🏠 Ampliando búsqueda hacia abajo del rango']},

  c_otras:{bot:'Dale. Para afinar la búsqueda, ¿qué es lo que no te cerró de estas tres?',
    input:{ph:'Ej: necesito 4 dormitorios…',ex:'Necesito que tenga cochera para dos autos',k:'ajuste',n:'c_otras_ok'}},

  c_otras_ok:{bot:function(c){return 'Anotado: "'+c.ajuste+'".\n\nTe soy honesta: eso no lo tengo publicado hoy, pero entra cartera nueva todas las semanas. Te aviso apenas aparezca algo que dé, sin llenarte de mensajes.\n\n¿Te dejo la alerta?'},opts:[
    {t:'Sí, avisame',n:'seguimiento'},{t:'Mejor mostrame lo que hay',n:'c_lista'}
  ],proc:['📝 Guardando criterio de búsqueda','🔔 Alerta automática de cartera nueva']},

  c_visita:{bot:function(c){return 'Buenísimo, "'+c.prop+'" 🙌\n\nEsa la podés ver esta semana. ¿Te queda mejor jueves a la tarde o sábado a la mañana?'},opts:[
    {t:'Jueves a la tarde',n:'c_hora',k:'dia'},
    {t:'Sábado a la mañana',n:'c_hora',k:'dia'},
    {t:'Otro momento',n:'c_dia_otro'},
    {t:'Antes quiero más info',n:'c_info'}
  ],proc:['📅 Consultando agenda de visitas','🔑 Verificando disponibilidad de llaves']},

  c_dia_otro:{bot:'Sin problema, ¿qué día te sirve?',input:{ph:'Ej: martes al mediodía…',ex:'El martes cerca de las 18',k:'dia',n:'c_hora'}},

  c_info:{bot:function(c){return 'Te paso el detalle de "'+c.prop+'":\n\n📐 Superficie cubierta 180 m² sobre lote de 400 m²\n📄 Escritura al día, libre de deuda\n💧 Todos los servicios, gas natural\n🏦 Apta crédito\n💰 Expensas: no tiene\n📆 Disponible para escriturar en 30 días\n\nIgual, la foto no le hace justicia al patio. ¿Jueves a la tarde o sábado a la mañana?'},opts:[
    {t:'Jueves a la tarde',n:'c_hora',k:'dia'},{t:'Sábado a la mañana',n:'c_hora',k:'dia'}
  ],proc:['📄 Leyendo ficha técnica de la propiedad','⚖️ Verificando situación dominial']},

  c_hora:{bot:function(c){return 'Listo, '+c.dia+'. Tengo estos horarios libres:'},opts:[
    {t:'10:00',n:'dato_nombre',k:'hora'},{t:'11:30',n:'dato_nombre',k:'hora'},
    {t:'17:00',n:'dato_nombre',k:'hora'},{t:'18:30',n:'dato_nombre',k:'hora'}
  ],proc:['📅 Bloqueando franja tentativa']},

  dato_nombre:{bot:'¿Tu nombre y apellido?',input:{ph:'Nombre y apellido…',ex:'Marcela Ríos',k:'nombre',n:'dato_tel'}},
  dato_tel:{bot:'¿Y un teléfono para confirmarte?',input:{ph:'Tu teléfono…',ex:'3834-556677',k:'tel',n:'c_cierre'},proc:['👤 Creando ficha de cliente en el panel']},

  /* Cierre = derivación. Una operación de ticket alto no la termina un
     sistema: la termina una persona. Lo que hace el asistente es entregar
     el cliente caliente con todo el contexto masticado, para que el asesor
     entre a cerrar y no a averiguar. */
  c_cierre:{bot:function(c){return '✅ Visita agendada\n\n📋 Reserva #V-2841\n🏠 '+c.prop+'\n📅 '+c.dia+' a las '+c.hora+'\n👤 '+c.nombre+'\n📱 '+c.tel},
    bots:['👤 Ahora te paso con Laura, la asesora que lleva esa zona.\n\nYa le mandé todo: qué buscás, tu presupuesto, cómo pensás pagarlo y la propiedad que elegiste. **No vas a tener que contar nada de nuevo.**\n\nTe escribe ella dentro de la próxima hora hábil, y es quien te va a abrir la puerta el día de la visita.\n\nYo quedo por acá por si necesitás reprogramar o ver otra propiedad.'],
    opts:[
      {t:'Perfecto, gracias 👍',n:'gracias'},{t:'Quiero ver otra propiedad también',n:'c_lista'}
    ],proc:['📋 Registrando visita #V-2841','📅 Cargando en la agenda del asesor','🔒 Bloqueando la propiedad ese horario','📲 Programando recordatorio 2 h antes','👤 DERIVANDO a Laura (asesora de zona)','📄 Adjuntando historial completo de la conversación','⏱️ SLA de contacto: 1 h hábil','📊 Lead marcado CALIENTE en el panel']},

  /* ── ALQUILER ───────────────────────────────────────── */
  a_tipo:{bot:'Dale. ¿Qué necesitás alquilar?',opts:[
    {t:'Departamento',n:'a_pres',k:'tipo'},{t:'Casa',n:'a_pres',k:'tipo'},
    {t:'Local comercial',n:'a_pres',k:'tipo'},{t:'Oficina',n:'a_pres',k:'tipo'}
  ]},

  a_pres:{bot:'¿Hasta cuánto por mes pensabas gastar?',opts:[
    {t:'Hasta $350.000',n:'a_garantia',k:'pres'},{t:'$350.000 a $550.000',n:'a_garantia',k:'pres'},
    {t:'$550.000 a $800.000',n:'a_garantia',k:'pres'},{t:'Más de $800.000',n:'a_garantia',k:'pres'}
  ]},

  a_garantia:{bot:'Te hago la pregunta que después traba todo, mejor ahora: ¿con qué garantía contás?',opts:[
    {t:'Garantía propietaria',n:'a_lista',k:'gar'},
    {t:'Seguro de caución',n:'a_lista',k:'gar'},
    {t:'Recibo de sueldo',n:'a_lista',k:'gar'},
    {t:'😕 No tengo garantía',n:'a_sin_gar'}
  ],proc:['🔍 Verificando requisitos de garantía por propietario']},

  a_sin_gar:{bot:'Tranqui, no es un no.\n\nTrabajamos con seguro de caución: en vez de conseguir un propietario que te salga de garante, pagás una póliza mensual (arranca en el 4% del alquiler) y listo. Se aprueba en 48 hs con recibo de sueldo o monotributo.\n\nEs la forma en la que hoy alquila la mayoría. ¿Te sirve por ese lado?',opts:[
    {t:'Sí, me sirve',n:'a_lista',k:'gar',v:'seguro de caución'},
    {t:'Contame más del seguro',n:'dudas_gar'}
  ],proc:['💡 Ofreciendo alternativa: seguro de caución','📄 Requisitos: recibo o monotributo']},

  a_lista:{bot:function(c){return 'Con eso ya podés avanzar. Mirá lo que tengo disponible ahora 👇'},
    cards:[
      {k:'depto',t:'Depto 2 amb. — Centro', s:'1 dorm · balcón · cochera opcional · amoblado', p:'$385.000 / mes', b:'Libre ya'},
      {k:'casa', t:'Casa 3 dorm. — B° Norte', s:'2 baños · patio · garage · sin expensas', p:'$620.000 / mes'},
      {k:'local',t:'Local 45 m² — Sarmiento', s:'Vidriera a la calle · baño · depósito', p:'$540.000 / mes', b:'Alta circulación'}
    ],
    bots:['El depto del Centro es el que más rápido se va: es el único amoblado y con cochera. Lo tengo libre desde el 1°.\n\n¿Cuál querés ver?'],
    opts:[
      {t:'El depto del Centro',n:'a_visita',k:'prop',v:'Depto 2 amb. — Centro'},
      {t:'La casa del Norte',n:'a_visita',k:'prop',v:'Casa 3 dorm. — B° Norte'},
      {t:'El local de Sarmiento',n:'a_visita',k:'prop',v:'Local 45 m² — Sarmiento'},
      {t:'❓ ¿Qué gastos tiene además del alquiler?',n:'dudas_gastos'}
    ],
    proc:['🏘️ Filtrando disponibles por presupuesto y garantía','✅ 3 unidades habilitadas para este perfil']},

  a_visita:{bot:function(c){return 'Buenísimo, "'+c.prop+'".\n\n¿Lo ves mañana a la mañana o preferís a la tarde?'},opts:[
    {t:'Mañana a la mañana',n:'c_hora',k:'dia'},{t:'Mañana a la tarde',n:'c_hora',k:'dia'},
    {t:'Otro día',n:'c_dia_otro'}
  ],proc:['📅 Consultando agenda de visitas']},

  /* ── CAPTACIÓN ──────────────────────────────────────── */
  cap_que:{bot:'¡Buenísimo! Eso lo veo yo mismo 🙌\n¿Qué querés hacer con la propiedad?',opts:[
    {t:'Venderla',n:'cap_tipo',k:'operacion'},{t:'Ponerla en alquiler',n:'cap_tipo',k:'operacion'},
    {t:'Todavía no sé, quiero saber cuánto vale',n:'cap_tipo',k:'operacion',v:'tasación'}
  ],proc:['⭐ CAPTACIÓN — prioridad máxima','🔔 Notificando al responsable de cartera']},

  cap_tipo:{bot:'¿Qué es?',opts:[
    {t:'Casa',n:'cap_zona',k:'tipo'},{t:'Departamento',n:'cap_zona',k:'tipo'},
    {t:'Terreno',n:'cap_zona',k:'tipo'},{t:'Local o galpón',n:'cap_zona',k:'tipo'}
  ]},

  cap_zona:{bot:'¿En qué zona está?',input:{ph:'Barrio o dirección aproximada…',ex:'B° Jardín, cerca del parque',k:'zona',n:'cap_m2'}},
  cap_m2:{bot:'¿Cuántos metros tiene, más o menos? Si no sabés el número exacto, tirame lo que te acuerdes.',input:{ph:'Ej: 180 m² cubiertos…',ex:'Unos 150 m² en lote de 400',k:'m2',n:'cap_escritura'}},

  cap_escritura:{bot:'¿Está escriturada a tu nombre?',opts:[
    {t:'Sí, escritura al día',n:'cap_tasacion',k:'escritura'},
    {t:'Está en sucesión',n:'cap_tasacion',k:'escritura'},
    {t:'Tengo boleto, no escritura',n:'cap_tasacion',k:'escritura'},
    {t:'No estoy seguro',n:'cap_tasacion',k:'escritura'}
  ],proc:['⚖️ Registrando situación dominial']},

  cap_tasacion:{bot:function(c){return 'Perfecto. Con esos datos ya te puedo dar un rango de referencia de mercado, y después el tasador te confirma el número fino en la visita.\n\n📊 '+c.tipo+' en '+c.zona+', '+c.m2+'\nRango estimado de mercado: **USD 95.000 – 125.000**\n\n⚠️ Ojo, es una referencia sobre operaciones comparables de la zona, no una tasación. El número real depende del estado, la orientación y la antigüedad — eso hay que verlo en persona.\n\nLa tasación es sin cargo y sin compromiso de firmar nada. ¿Cuándo te queda cómodo?'},opts:[
    {t:'Esta semana',n:'cap_hora',k:'dia',v:'esta semana'},
    {t:'La semana que viene',n:'cap_hora',k:'dia',v:'la semana que viene'},
    {t:'Primero quiero saber la comisión',n:'dudas_comision'}
  ],proc:['📊 Cruzando 23 operaciones comparables de la zona','🧮 Calculando rango de referencia','⚠️ Marcando como estimación, no tasación','🔔 Avisando al tasador']},

  /* La captación tiene su propio cierre: no es la visita a una propiedad
     nuestra, es el tasador yendo a la del cliente. Cerrarla con el texto
     de visita dejaba un "🏠 undefined" donde iba el nombre de la propiedad. */
  cap_hora:{bot:'Perfecto. ¿Qué horario te queda cómodo?',opts:[
    {t:'A la mañana',n:'cap_nombre',k:'hora'},{t:'Al mediodía',n:'cap_nombre',k:'hora'},
    {t:'A la tarde',n:'cap_nombre',k:'hora'}
  ],proc:['📅 Consultando agenda del tasador']},
  cap_nombre:{bot:'¿Tu nombre y apellido?',input:{ph:'Nombre y apellido…',ex:'Marcela Ríos',k:'nombre',n:'cap_tel'}},
  cap_tel:{bot:'¿Y un teléfono para coordinar?',input:{ph:'Tu teléfono…',ex:'3834-556677',k:'tel',n:'cap_cierre'},
    proc:['👤 Creando ficha de propietario en el panel']},
  cap_cierre:{bot:function(c){return '✅ Tasación agendada\n\n📋 Tasación #T-0518\n🏠 '+c.tipo+' en '+c.zona+'\n📐 '+c.m2+'\n📅 '+c.dia+', '+String(c.hora).toLowerCase()+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n💰 Sin cargo y sin compromiso de firmar nada con nosotros.'},
    bots:['👤 Te derivo con Sergio, el tasador.\n\nLe pasé los datos de la propiedad y el rango de referencia que calculamos, así llega con la tarea hecha. Te llama para confirmar el horario exacto y el día te deja el valor por escrito.\n\nDe acá en más seguís con él. **Una tasación la firma una persona, no un sistema.**'],
    opts:[
      {t:'Perfecto, gracias 👍',n:'gracias'},
      {t:'Aprovecho y busco algo para comprar',n:'c_tipo'}
    ],proc:['📋 Registrando tasación #T-0518','📅 Cargando en la agenda del tasador','👤 Ficha de propietario creada','📲 Programando recordatorio','👤 DERIVANDO a Sergio (tasador)','📄 Adjuntando datos de la propiedad y el rango calculado','⭐ CAPTACIÓN registrada en el panel']},

  /* ── DESTACADAS ─────────────────────────────────────── */
  destacadas:{bot:'Estas son las que más consultas tienen esta semana 👇',
    cards:[
      {k:'casa', t:'Casa 3 dorm. — B° Jardín', s:'180 m² · cochera · patio con parrilla · apta crédito', p:'USD 118.000', b:'⭐ La más vista'},
      {k:'depto',t:'Depto 2 amb. a estrenar — Centro', s:'62 m² · balcón · entrega inmediata', p:'USD 64.000'},
      {k:'lote', t:'Terreno 300 m² — Valle Viejo', s:'10x30 · servicios en la puerta · escritura', p:'USD 27.000'}
    ],
    bots:['¿Alguna te interesa o preferís que busque algo puntual?'],
    opts:[
      {t:'Me interesa una',n:'c_lista'},{t:'Buscame algo puntual',n:'c_tipo'},{t:'Solo estaba mirando',n:'seguimiento'}
    ],proc:['📸 Cargando destacados de la semana']},

  /* ── DUDAS ──────────────────────────────────────────── */
  dudas:{bot:'Dale, preguntame. ¿Qué querés saber?',opts:[
    {t:'¿Cuánto cobran de comisión?',n:'dudas_comision'},
    {t:'¿Qué garantías aceptan?',n:'dudas_gar'},
    {t:'¿Qué gastos tiene alquilar?',n:'dudas_gastos'},
    {t:'¿Qué gastos tiene comprar?',n:'dudas_escritura'},
    {t:'¿Trabajan con crédito hipotecario?',n:'dudas_credito'},
    {t:'¿Aceptan permuta?',n:'dudas_permuta'},
    {t:'Quiero hablar con una persona',n:'persona'}
  ]},
  dudas_comision:{bot:'Te la digo derecha:\n\n🏠 Venta: 3% + IVA al comprador y 3% + IVA al vendedor.\n🔑 Alquiler: un mes de alquiler al inquilino y el 5% mensual al propietario por la administración.\n📊 Tasación: sin cargo, no la cobramos nunca.\n\nNo hay costos ocultos ni "gastos administrativos" sorpresa.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Dale, avancemos',n:'start'}
  ],proc:['📄 Consultando tabla de honorarios']},
  dudas_gar:{bot:'Aceptamos tres:\n\n1️⃣ Garantía propietaria — un titular con propiedad en la provincia, libre de deuda.\n2️⃣ Seguro de caución — una póliza mensual desde el 4% del alquiler. Se aprueba en 48 hs con recibo de sueldo o monotributo. Es la más usada hoy.\n3️⃣ Recibo de sueldo — con antigüedad mínima de 6 meses y sueldo de al menos 3 alquileres.\n\nCon cualquiera de las tres alquilás.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Quiero ver qué hay para alquilar',n:'a_tipo'}
  ]},
  dudas_gastos:{bot:'Además del alquiler mensual, contá:\n\n• Expensas, si es departamento (entre $45.000 y $90.000 según el edificio)\n• Servicios a tu nombre: luz, agua, gas\n• Seguro de caución, si vas por ese lado\n• Depósito: un mes, que se devuelve al final\n\nEn el contrato figura todo detallado antes de que firmes. Nada aparece después.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Ver alquileres',n:'a_tipo'}
  ]},
  dudas_escritura:{bot:'Los gastos de escrituración corren por cuenta del comprador y rondan el 6-8% del valor:\n\n• Honorarios del escribano: ~2%\n• Impuesto de sellos: 1,5% (en Catamarca hay exención para vivienda única y permanente)\n• Informes y certificados: variable\n• Comisión inmobiliaria: 3% + IVA\n\nAntes de firmar cualquier cosa te pasamos el detalle con números cerrados.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Ver propiedades en venta',n:'c_tipo'}
  ]},
  dudas_credito:{bot:'Sí, y bastante seguido.\n\nEl banco financia hasta el 75% de la tasación, así que tenés que poner el 25% más los gastos de escritura. La propiedad tiene que estar escriturada y libre de deuda para calificar.\n\nNosotros armamos la carpeta y seguimos el trámite con el banco. Vos vas al banco solo a firmar.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Ver aptas crédito',n:'c_tipo'}
  ]},
  dudas_permuta:{bot:'Sí. Es más común de lo que parece, sobre todo cuando el que compra ya tiene una propiedad más chica.\n\nCómo funciona: tasamos la tuya sin cargo, la ponemos como parte de pago y la diferencia se salda en efectivo o financiada con el propietario. Todo se escritura el mismo día.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Quiero tasar la mía',n:'cap_tipo'}
  ]},

  seguimiento:{bot:'Todo bien, no te apuro 🙂\n\nTe dejo anotado lo que buscás y te escribo solo si entra algo que dé de verdad. Sin spam, prometido.',opts:[
    {t:'Dale, gracias',n:'gracias'}
  ],proc:['📝 Lead guardado como TIBIO','🔔 Seguimiento programado a 7 días','🚫 Sin envíos masivos: solo coincidencias reales']},

  persona:{bot:'Dale, te paso con un asesor. ¿Qué le cuento para que ya venga con la respuesta?',
    input:{ph:'Tu consulta…',ex:'Quiero saber si aceptan mi auto en parte de pago',k:'consulta',n:'persona_ok'}},
  persona_ok:{bot:function(c){return '✅ Listo, te derivo con una persona.\n\n📋 Consulta #C-0912\n💬 "'+c.consulta+'"\n\n👤 Le mandé tu consulta junto con todo lo que hablamos hasta acá, así **no tenés que empezar de cero.**\n\nTe escribe un asesor en el día. Si es urgente, la oficina abre de 9 a 13 y de 17 a 20.'},opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Mientras tanto, seguir viendo',n:'start'}
  ],proc:['📋 Ticket #C-0912 creado','👤 DERIVANDO a asesor de guardia','📄 Adjuntando historial completo de la conversación','⏱️ SLA de respuesta: 4 h hábiles','📊 Consulta visible en el panel']},

  gracias:{bot:'¡Gracias a vos! 🙌\n\nCualquier cosa me escribís por acá, contesto siempre.\n📍 Rivadavia 480, Catamarca\n🕐 Lun a Vie 9-13 y 17-20 · Sáb 9-13',opts:[],end:true,
    proc:['📊 Conversación registrada en el panel','✅ Ninguna consulta quedó sin responder']}
},

/* ══════════════════════════════════════════════════════════════════
   2 · CONCESIONARIA — Automotores del Valle
   Acá el que decide es la forma de pago, no el modelo. Por eso la
   permuta y la financiación se preguntan temprano: un lead con usado
   para entregar vale el triple. El manejo de "lo vi más barato en
   otro lado" es la objeción número uno del rubro.
   ══════════════════════════════════════════════════════════════════ */
concesionaria:{
  start:{bot:'¡Hola! Soy Nico, de Automotores del Valle 🚗\nContesto a cualquier hora, incluso cuando el salón está cerrado.\n\n¿Qué estás buscando?',opts:[
    {t:'🚘 Un 0km',n:'okm_seg'},
    {t:'🚙 Un usado',n:'us_seg'},
    {t:'🔄 Saber cuánto vale mi auto',n:'tas_marca'},
    {t:'💰 Financiación o plan de ahorro',n:'fin_intro'},
    {t:'🔧 Turno de service',n:'srv_modelo'},
    {t:'❓ Tengo una duda',n:'dudas'},
    {t:'📞 Hablar con un vendedor',n:'persona'}
  ],proc:['📡 Consulta entrante — WhatsApp','🤖 Asistente de ventas activo','👤 Contacto nuevo']},

  /* ── 0KM ────────────────────────────────────────────── */
  okm_seg:{bot:'Bien ahí. ¿Qué tipo de auto necesitás?',opts:[
    {t:'Chico / ciudad',n:'okm_lista',k:'seg'},{t:'Sedán familiar',n:'okm_lista',k:'seg'},
    {t:'SUV',n:'okm_lista',k:'seg'},{t:'Pick-up / trabajo',n:'okm_lista',k:'seg'}
  ],proc:['📋 Abriendo ficha de comprador 0km']},

  okm_lista:{bot:function(c){return 'Mirá, en '+String(c.seg||'').toLowerCase()+' tengo estos con entrega asegurada 👇'},
    cards:[
      {k:'auto',   t:'Fiat Cronos 1.3 Drive', s:'0km · nafta · caja manual · pack seguridad', p:'$32.400.000', b:'Entrega 30 días'},
      {k:'suv',    t:'VW T-Cross Trendline', s:'0km · 1.6 MSI · automática · cámara de retroceso', p:'$46.900.000'},
      {k:'pickup', t:'Toyota Hilux 4x2 SR', s:'0km · 2.4 TDI · caja manual · doble cabina', p:'$68.500.000', b:'Última unidad del cupo'}
    ],
    bots:['Si me preguntás, el Cronos es el que mejor relación precio-entrega tiene hoy: es el único de los tres que te sale del salón en 30 días. Los otros dos van a cupo de fábrica.\n\n¿Cómo lo pensabas pagar?'],
    opts:[
      {t:'💵 Contado',n:'okm_modelo',k:'pago'},
      {t:'🏦 Financiado',n:'fin_anticipo',k:'pago'},
      {t:'🔄 Entrego mi usado',n:'tas_marca',k:'pago'},
      {t:'📋 Plan de ahorro',n:'plan_intro',k:'pago'},
      {t:'😬 Lo vi más barato en otro lado',n:'obj_precio'}
    ],
    proc:['🚘 Consultando stock y cupos de fábrica','📸 Adjuntando fichas con fotos','📅 Verificando plazos de entrega reales']},

  okm_modelo:{bot:'¿Cuál te interesa?',opts:[
    {t:'Fiat Cronos',n:'okm_cierre',k:'modelo'},{t:'VW T-Cross',n:'okm_cierre',k:'modelo'},
    {t:'Toyota Hilux',n:'okm_cierre',k:'modelo'}
  ]},

  obj_precio:{bot:'Puede ser, y te lo digo sin vueltas: en precio de lista todos arrancamos parecido, la fábrica lo fija.\n\nDonde cambia es en lo que va adentro del precio. Acá te llevás:\n\n✅ Patentamiento y transferencia incluidos\n✅ Primer service bonificado\n✅ Garantía oficial de fábrica, con taller propio acá en Catamarca\n\nSi el otro presupuesto no incluye patentamiento, la diferencia se te da vuelta.\n\n¿Querés pasarme el número que te pasaron y lo comparamos derecho?',opts:[
    {t:'Dale, te paso el número',n:'obj_num'},
    {t:'Prefiero que me lo mejores',n:'obj_asesor'},
    {t:'Tenés razón, sigamos',n:'okm_modelo'}
  ],proc:['⚠️ Objeción detectada: competencia','🧭 Respuesta por valor, no por descuento']},

  obj_num:{bot:'Pasámelo así lo miro en serio.',input:{ph:'Modelo y precio que te pasaron…',ex:'Cronos Drive en $31.200.000',k:'competencia',n:'obj_asesor'}},

  obj_asesor:{bot:function(c){return 'Lo tengo'+(c.competencia?' anotado: '+c.competencia:'')+'.\n\nAcá te freno con honestidad: descuentos por fuera de lista no los puedo autorizar yo por WhatsApp. Lo que sí puedo es pasarte con el gerente de ventas, que es el que tiene margen para mejorar la operación.\n\n¿Te lo derivo con todo el contexto para que no tengas que repetir nada?'},opts:[
    {t:'Sí, derivame',n:'persona'},{t:'Mejor mostrame los usados',n:'us_seg'}
  ],proc:['🔒 Descuento fuera de política del asistente','👤 Derivando a gerente de ventas con contexto completo']},

  okm_cierre:{bot:function(c){return 'Buenísimo, el '+c.modelo+' 🔥\n\nAntes de hablar de papeles: manejalo. Tengo unidad de prueba y el test drive dura 20 minutos, sin compromiso de nada.\n\n¿Te queda mejor mañana a la mañana o el sábado?'},opts:[
    {t:'Mañana a la mañana',n:'okm_hora',k:'dia'},
    {t:'El sábado',n:'okm_hora',k:'dia'},
    {t:'No hace falta, quiero avanzar directo',n:'dato_nombre'}
  ],proc:['🚗 Verificando disponibilidad de unidad de prueba','🎯 Micro-compromiso antes del cierre']},

  okm_hora:{bot:'Perfecto. Tengo estos horarios:',opts:[
    {t:'10:00',n:'dato_nombre',k:'hora'},{t:'11:30',n:'dato_nombre',k:'hora'},
    {t:'16:00',n:'dato_nombre',k:'hora'},{t:'18:00',n:'dato_nombre',k:'hora'}
  ]},

  /* ── USADOS ─────────────────────────────────────────── */
  us_seg:{bot:'Dale. ¿Hasta cuánto querés gastar?',opts:[
    {t:'Hasta $15.000.000',n:'us_lista',k:'pres'},{t:'$15 a $25 millones',n:'us_lista',k:'pres'},
    {t:'$25 a $40 millones',n:'us_lista',k:'pres'},{t:'Más de $40 millones',n:'us_lista',k:'pres'}
  ],proc:['📋 Abriendo ficha de comprador usado']},

  us_lista:{bot:'Estos son los que tengo en el salón ahora, todos con informe de dominio y verificación al día 👇',
    cards:[
      {k:'auto',  t:'VW Gol Trend 2018', s:'96.000 km · 1.6 nafta · único dueño · service al día', p:'$14.800.000', b:'Garantía 6 meses'},
      {k:'auto',  t:'Fiat Cronos Drive 2021', s:'52.000 km · 1.3 nafta · impecable · con service oficial', p:'$22.300.000', b:'⭐ El más consultado'},
      {k:'pickup',t:'Toyota Hilux SR 2019 4x2', s:'118.000 km · 2.4 TDI · cubiertas nuevas', p:'$44.900.000'}
    ],
    bots:['El Cronos 2021 es el que más movimiento tiene: lo vinieron a ver tres personas esta semana y tiene todos los services hechos acá, así que sé exactamente cómo se manejó.\n\nTodos los usados salen con verificación policial, informe de dominio y transferencia incluida. ¿Cuál te gustó?'],
    opts:[
      {t:'El Gol Trend',n:'us_test',k:'modelo'},{t:'El Cronos 2021',n:'us_test',k:'modelo'},
      {t:'La Hilux',n:'us_test',k:'modelo'},
      {t:'🔄 ¿Me tomás el mío en parte de pago?',n:'tas_marca'},
      {t:'❓ ¿Qué garantía tienen los usados?',n:'dudas_gar'}
    ],
    proc:['🚙 Consultando stock de usados','📄 Verificando informes de dominio','📸 Adjuntando fichas con fotos','⭐ Ordenando por rotación real']},

  us_test:{bot:function(c){return 'Muy buena elección, el '+c.modelo+'.\n\nVení a probarlo antes de decidir nada. ¿Mañana a la mañana o el sábado?'},opts:[
    {t:'Mañana a la mañana',n:'okm_hora',k:'dia'},{t:'El sábado',n:'okm_hora',k:'dia'},
    {t:'Antes decime si me tomás el mío',n:'tas_marca'}
  ],proc:['🔑 Reservando unidad para test drive']},

  /* ── TASACIÓN / PERMUTA ─────────────────────────────── */
  tas_marca:{bot:'Dale, te lo tasamos. ¿Qué tenés?',input:{ph:'Marca y modelo…',ex:'Chevrolet Onix 2019',k:'usado',n:'tas_km'},
    proc:['🔄 Iniciando tasación de usado','⭐ Lead con permuta: prioridad alta']},
  tas_km:{bot:'¿Cuántos kilómetros tiene?',opts:[
    {t:'Menos de 50.000',n:'tas_estado',k:'km'},{t:'50.000 a 100.000',n:'tas_estado',k:'km'},
    {t:'100.000 a 150.000',n:'tas_estado',k:'km'},{t:'Más de 150.000',n:'tas_estado',k:'km'}
  ]},
  tas_estado:{bot:'¿En qué estado está?',opts:[
    {t:'Impecable, sin detalles',n:'tas_result',k:'estado'},
    {t:'Bueno, detalles menores',n:'tas_result',k:'estado'},
    {t:'Necesita algo de chapa o pintura',n:'tas_result',k:'estado'},
    {t:'Tiene arreglos pendientes',n:'tas_result',k:'estado'}
  ],proc:['🔍 Cruzando con precios de mercado','📊 Ajustando por km y estado']},
  tas_result:{bot:function(c){return '📊 Tasación de referencia\n\n🚗 '+c.usado+'\n📏 '+c.km+' km · estado: '+String(c.estado).toLowerCase()+'\n\n💰 Rango estimado: **$16.500.000 – $18.200.000**\n\n⚠️ Es una referencia de mercado, no una oferta cerrada. El número final sale cuando lo ve el tasador: 20 minutos, sin compromiso, y te lo dejamos por escrito.\n\nSi entra en parte de pago de un 0km, hay unidades donde mejoramos la toma. ¿Lo traés esta semana?'},opts:[
    {t:'Sí, esta semana',n:'okm_hora',k:'dia',v:'esta semana'},
    {t:'El sábado',n:'okm_hora',k:'dia',v:'el sábado'},
    {t:'Primero quiero ver qué me llevo',n:'okm_seg'}
  ],proc:['📊 Consultando 34 operaciones comparables','🧮 Calculando rango de toma','⚠️ Marcado como referencia, no oferta','🔔 Avisando al tasador']},

  /* ── FINANCIACIÓN Y PLANES ──────────────────────────── */
  fin_intro:{bot:'Tenemos dos caminos y son bien distintos. ¿Cuál te sirve?',opts:[
    {t:'🏦 Crédito prendario (me llevo el auto ya)',n:'fin_anticipo'},
    {t:'📋 Plan de ahorro (cuota baja, entrega por sorteo)',n:'plan_intro'},
    {t:'¿Cuál me conviene?',n:'fin_cual'}
  ]},
  fin_cual:{bot:'Te lo digo derecho, sin vender humo:\n\n🏦 **Prendario** — te llevás el auto ahora. Cuota más alta, plazo más corto (hasta 48 meses), necesitás anticipo del 30% y demostrar ingresos.\n\n📋 **Plan de ahorro** — cuota mucho más baja, pero el auto te llega por sorteo o licitación. Puede ser el mes 2 o el mes 40. No sirve si lo necesitás ya.\n\nRegla simple: si lo necesitás para trabajar mañana, prendario. Si estás armando el ahorro para dentro de un par de años, plan.',opts:[
    {t:'Prendario entonces',n:'fin_anticipo'},{t:'Plan de ahorro',n:'plan_intro'},
    {t:'Quiero hablarlo con alguien',n:'persona'}
  ],proc:['💡 Explicando diferencia real entre productos','🚫 Sin prometer entrega que no se puede garantizar']},

  fin_anticipo:{bot:'Dale. ¿Cuánto podés poner de anticipo?',opts:[
    {t:'30% (el mínimo)',n:'fin_cuotas',k:'anticipo'},{t:'Alrededor del 50%',n:'fin_cuotas',k:'anticipo'},
    {t:'Más del 50%',n:'fin_cuotas',k:'anticipo'},{t:'Entrego mi usado como anticipo',n:'tas_marca'}
  ]},
  fin_cuotas:{bot:'¿En cuántas cuotas te sentís cómodo?',opts:[
    {t:'12 cuotas',n:'fin_sim',k:'cuotas'},{t:'24 cuotas',n:'fin_sim',k:'cuotas'},
    {t:'36 cuotas',n:'fin_sim',k:'cuotas'},{t:'48 cuotas',n:'fin_sim',k:'cuotas'}
  ],proc:['🧮 Simulando estructura de crédito']},
  fin_sim:{bot:function(c){return '📊 Simulación orientativa\n\nSobre un Fiat Cronos Drive ($32.400.000)\n💵 Anticipo '+c.anticipo+'\n📅 '+c.cuotas+'\n\n💰 Cuota estimada: **$1.180.000**\n\n⚠️ Es orientativa: la tasa final la define el banco según tu perfil crediticio, y puede quedar mejor o peor. No te la puedo garantizar yo.\n\nLo que sí: la preaprobación sale en 48 hs y es gratis. ¿La arrancamos?'},opts:[
    {t:'Dale, arranquemos la preaprobación',n:'dato_nombre'},
    {t:'Simular con otro modelo',n:'okm_seg'},
    {t:'❓ ¿Qué papeles necesito?',n:'dudas_papeles'}
  ],proc:['🧮 Calculando cuota estimada','⚠️ Marcado como orientativo: tasa sujeta a banco','🏦 Preaprobación disponible en 48 h']},

  plan_intro:{bot:'Dale. Te muestro cómo queda 👇',opts:[
    {t:'Fiat Cronos',n:'plan_sim',k:'modelo'},{t:'VW T-Cross',n:'plan_sim',k:'modelo'},
    {t:'Toyota Hilux',n:'plan_sim',k:'modelo'}
  ]},
  plan_sim:{bot:function(c){return '📋 Plan de ahorro — '+c.modelo+'\n\n📅 84 cuotas\n💰 Cuota 1 a 12: **$385.000**\n📈 Después ajusta por valor móvil del vehículo\n🎲 Entrega: por sorteo mensual o licitación\n\nTe soy honesto en lo que más se malinterpreta: **nadie te puede garantizar en qué mes te sale el auto**. Puede ser el 2 o el 40. Cualquiera que te prometa una fecha te está mintiendo.\n\nSi lo necesitás para ya, te conviene el prendario. ¿Seguimos con el plan igual?'},opts:[
    {t:'Sí, me sirve el plan',n:'dato_nombre'},
    {t:'Mejor prendario',n:'fin_anticipo'},
    {t:'Quiero hablarlo con alguien',n:'persona'}
  ],proc:['📋 Simulando plan de ahorro','🚫 Regla de honestidad: no prometer fecha de entrega']},

  /* ── SERVICE ────────────────────────────────────────── */
  srv_modelo:{bot:'Dale. ¿Qué vehículo es?',input:{ph:'Marca, modelo y año…',ex:'Fiat Cronos 2021',k:'vehiculo',n:'srv_tipo'},
    proc:['🔧 Abriendo agenda de taller']},
  srv_tipo:{bot:'¿Qué necesita?',opts:[
    {t:'Service de mantenimiento',n:'srv_dia',k:'servicio'},
    {t:'Revisar un ruido o falla',n:'srv_dia',k:'servicio'},
    {t:'Chapa y pintura',n:'srv_dia',k:'servicio'},
    {t:'Revisión pre-viaje',n:'srv_dia',k:'servicio'}
  ]},
  srv_dia:{bot:'¿Qué día te queda cómodo? Estos tengo con lugar:',opts:[
    {t:'Mañana',n:'srv_hora',k:'dia'},{t:'Pasado mañana',n:'srv_hora',k:'dia'},
    {t:'El viernes',n:'srv_hora',k:'dia'},{t:'La semana que viene',n:'srv_hora',k:'dia'}
  ],proc:['📅 Consultando huecos reales de taller','🔧 3 boxes disponibles']},
  srv_hora:{bot:'Estos horarios están libres:',opts:[
    {t:'08:00',n:'dato_nombre',k:'hora'},{t:'09:30',n:'dato_nombre',k:'hora'},
    {t:'14:00',n:'dato_nombre',k:'hora'},{t:'16:00',n:'dato_nombre',k:'hora'}
  ]},

  /* ── DATOS Y CIERRE ─────────────────────────────────── */
  dato_nombre:{bot:'¿Tu nombre y apellido?',input:{ph:'Nombre y apellido…',ex:'Jorge Bustos',k:'nombre',n:'dato_tel'}},
  dato_tel:{bot:'¿Un teléfono para confirmarte?',input:{ph:'Tu teléfono…',ex:'3834-221144',k:'tel',n:'cierre'},proc:['👤 Creando ficha de cliente en el panel']},

  cierre:{bot:function(c){
    var qué = c.modelo || c.vehiculo || c.usado || 'tu consulta';
    return '✅ Todo listo\n\n📋 Turno #A-4417\n🚗 '+qué+'\n📅 '+(c.dia||'a coordinar')+(c.hora?' a las '+c.hora:'')+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n📍 Av. Güemes 1240, Catamarca\n📲 Te mando un recordatorio el día anterior.'},
    bots:['👤 De acá en adelante te atiende Martín, uno de los vendedores del salón.\n\nYa tiene todo lo que hablamos: qué buscás, cómo lo vas a pagar y la unidad que te interesó. Va a tener el auto listo y las cuentas hechas cuando llegues, así **entrás a decidir y no a averiguar.**\n\nTe escribe él para confirmarte. Yo quedo por si querés reprogramar o mirar otra unidad mientras tanto.'],
    opts:[
      {t:'Perfecto, gracias 👍',n:'gracias'},{t:'Quiero ver otra unidad también',n:'us_seg'}
    ],proc:['📋 Registrando turno #A-4417','📅 Cargando en agenda del vendedor','🔑 Reservando unidad ese horario','📲 Programando recordatorio 24 h antes','👤 DERIVANDO a Martín (vendedor de salón)','📄 Adjuntando historial completo de la charla','⏱️ SLA de contacto: 1 h hábil','📊 Lead marcado CALIENTE en el panel']},

  /* ── DUDAS ──────────────────────────────────────────── */
  dudas:{bot:'Dale, preguntame lo que quieras.',opts:[
    {t:'¿Qué garantía tienen los usados?',n:'dudas_gar'},
    {t:'¿La transferencia está incluida?',n:'dudas_transf'},
    {t:'¿Cuánto tarda un 0km?',n:'dudas_entrega'},
    {t:'¿Qué papeles necesito para financiar?',n:'dudas_papeles'},
    {t:'¿Aceptan permuta?',n:'dudas_permuta'},
    {t:'¿Hacen service de otras marcas?',n:'dudas_service'},
    {t:'Quiero hablar con una persona',n:'persona'}
  ]},
  dudas_gar:{bot:'Todos los usados salen con:\n\n✅ 6 meses de garantía de motor y caja\n✅ Verificación policial hecha\n✅ Informe de dominio libre de deuda y sin prenda\n✅ Transferencia incluida en el precio\n\nY si el auto pasó por nuestro taller, te mostramos el historial de services completo. Si no lo tiene, te lo decimos: preferimos perder una venta antes que un cliente.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Ver usados',n:'us_seg'}
  ]},
  dudas_transf:{bot:'Sí, incluida en el precio publicado. Sellos, formulario 08 y gestoría, todo.\n\nEl auto sale del salón a tu nombre. No hay "más los gastos" después.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Ver usados',n:'us_seg'}
  ]},
  dudas_entrega:{bot:'Depende del modelo y del cupo de fábrica:\n\n🚘 Cronos y Argo: 30 a 45 días\n🚙 T-Cross y Taos: 60 a 90 días\n🛻 Hilux: según cupo, hoy 90 a 120 días\n\nCuando hay una unidad física en el salón, la entrega es inmediata contra patentamiento (7 a 10 días). Te aviso siempre cuál es cuál: no te vendo un plazo que después no se cumple.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Ver 0km',n:'okm_seg'}
  ]},
  dudas_papeles:{bot:'Para el prendario:\n\n📄 DNI\n📄 Constancia de CUIL\n📄 Últimos 3 recibos de sueldo, o últimas 6 declaraciones si sos monotributista\n📄 Servicio a tu nombre o constancia de domicilio\n\nCon eso sacamos la preaprobación en 48 hs, gratis y sin obligación de comprar.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Simular una cuota',n:'fin_anticipo'}
  ]},
  dudas_permuta:{bot:'Sí, y es la forma en que se cierra la mitad de las operaciones.\n\nTasamos tu usado sin cargo (20 minutos), te dejamos el valor por escrito y entra como anticipo. Si la diferencia queda financiada, también la armamos nosotros.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Tasar el mío',n:'tas_marca'}
  ]},
  dudas_service:{bot:'Hacemos service oficial de nuestras marcas y service general de cualquier marca.\n\nLo que no hacemos es garantía de fábrica de otras marcas: eso solo lo puede hacer el concesionario oficial de esa marca. Te lo aclaro para que no pierdas la garantía sin querer.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Pedir turno de service',n:'srv_modelo'}
  ]},

  persona:{bot:'Dale, te paso con un vendedor. ¿Qué le adelanto?',
    input:{ph:'Tu consulta…',ex:'Quiero mejorar el precio del Cronos',k:'consulta',n:'persona_ok'}},
  persona_ok:{bot:function(c){return '✅ Te derivo con Martín, del salón.\n\n📋 Consulta #V-1188\n💬 "'+c.consulta+'"\n\n👤 Le pasé la consulta y todo el contexto: qué venías mirando, cómo pensabas pagarlo y en qué quedamos. **Arranca donde lo dejamos, no de cero.**\n\nTe escribe en el día. El salón atiende de 9 a 13 y de 17 a 20.'},opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Mientras tanto, seguir viendo',n:'start'}
  ],proc:['📋 Ticket #V-1188 creado','👤 DERIVANDO a Martín (vendedor de salón)','📄 Adjuntando historial completo de la charla','⏱️ SLA de respuesta: 4 h hábiles','📊 Consulta visible en el panel']},

  gracias:{bot:'¡Gracias a vos! 🙌\nCualquier cosa escribime por acá, contesto siempre.\n\n📍 Av. Güemes 1240, Catamarca\n🕐 Lun a Vie 9-13 y 17-20 · Sáb 9-13',opts:[],end:true,
    proc:['📊 Conversación registrada en el panel','✅ Ninguna consulta quedó sin responder']}
},

/* ══════════════════════════════════════════════════════════════════
   3 · CORRALÓN — Corralón Florida Norte
   El cómputo de materiales es el gancho: el que pregunta "cuántos
   ladrillos necesito para 40 m²" ya está por comprar. Se responde el
   cálculo gratis y se cierra con el presupuesto armado. La objeción
   de precio se contesta con forma de pago y con segunda marca, que es
   lo que hace un corralonero de verdad.
   ══════════════════════════════════════════════════════════════════ */
corralon:{
  start:{bot:'¡Buenas! Soy Rubén, del Corralón Florida Norte 🧱\nContesto también los domingos, que es cuando todo el mundo se acuerda de la obra 😄\n\n¿Qué necesitás?',opts:[
    {t:'🧮 Calcular materiales para mi obra',n:'calc_que'},
    {t:'💰 Pedir un presupuesto',n:'cot_lista'},
    {t:'📦 Consultar precio y stock',n:'stock_que'},
    {t:'🚚 Envíos y fletes',n:'dudas_flete'},
    {t:'❓ Tengo una duda',n:'dudas'},
    {t:'📞 Hablar con el encargado',n:'persona'}
  ],proc:['📡 Consulta entrante — WhatsApp','🤖 Asistente de ventas activo']},

  /* ── CÓMPUTO ────────────────────────────────────────── */
  calc_que:{bot:'Bien ahí, eso lo hacemos gratis. ¿Qué vas a hacer?',opts:[
    {t:'Levantar pared',n:'calc_m2',k:'obra'},
    {t:'Contrapiso y carpeta',n:'calc_m2',k:'obra'},
    {t:'Losa de techo',n:'calc_m2',k:'obra'},
    {t:'Revoque grueso y fino',n:'calc_m2',k:'obra'},
    {t:'Es una obra completa',n:'calc_obra_full'}
  ],proc:['🧮 Abriendo calculador de cómputo']},

  calc_m2:{bot:function(c){return '¿Cuántos metros cuadrados de '+String(c.obra).toLowerCase()+'? Tirame el número redondo, después ajustamos.'},
    input:{ph:'Ej: 40…',ex:'40',k:'m2',n:'calc_result'}},

  calc_result:{bot:function(c){
    var m = parseFloat(String(c.m2).replace(',','.')) || 40;
    var o = String(c.obra||'').toLowerCase();
    var d;
    if (o.indexOf('pared') >= 0){
      d = '🧱 Ladrillo hueco 12x18x33: **'+Math.ceil(m*16)+' u.**\n🛢️ Cemento (bolsa 50 kg): **'+Math.ceil(m*0.35)+' bolsas**\n⚪ Cal hidratada: **'+Math.ceil(m*0.5)+' bolsas**\n🏖️ Arena gruesa: **'+(Math.ceil(m*0.04*10)/10)+' m³**';
    } else if (o.indexOf('contrapiso') >= 0){
      d = '🛢️ Cemento (bolsa 50 kg): **'+Math.ceil(m*0.9)+' bolsas**\n🏖️ Arena gruesa: **'+(Math.ceil(m*0.11*10)/10)+' m³**\n⛰️ Piedra partida: **'+(Math.ceil(m*0.09*10)/10)+' m³**\n⚪ Cal: **'+Math.ceil(m*0.3)+' bolsas**';
    } else if (o.indexOf('losa') >= 0){
      d = '🔩 Hierro 8 mm (barra 12 m): **'+Math.ceil(m*1.1)+' barras**\n🔩 Hierro 6 mm (barra 12 m): **'+Math.ceil(m*0.8)+' barras**\n🛢️ Cemento (bolsa 50 kg): **'+Math.ceil(m*1.4)+' bolsas**\n🏖️ Arena gruesa: **'+(Math.ceil(m*0.12*10)/10)+' m³**\n⛰️ Piedra partida: **'+(Math.ceil(m*0.13*10)/10)+' m³**';
    } else {
      d = '🛢️ Cemento (bolsa 50 kg): **'+Math.ceil(m*0.25)+' bolsas**\n⚪ Cal hidratada: **'+Math.ceil(m*0.7)+' bolsas**\n🏖️ Arena fina: **'+(Math.ceil(m*0.03*10)/10)+' m³**\n🏖️ Arena gruesa: **'+(Math.ceil(m*0.03*10)/10)+' m³**';
    }
    return '🧮 Cómputo para '+m+' m² de '+o+':\n\n'+d+'\n\nAhí ya está incluido el 8% de desperdicio, que es lo que siempre se olvida y después falta.\n\n¿Te lo paso a presupuesto con precios de hoy?';
  },opts:[
    {t:'Sí, pasámelo a presupuesto',n:'cot_calc'},
    {t:'Me falta calcular otra cosa',n:'calc_que'},
    {t:'❓ ¿Y si me sobra material?',n:'dudas_devolucion'}
  ],proc:['📐 Aplicando coeficientes de cómputo','➕ Sumando 8% de desperdicio','✅ Cómputo listo']},

  calc_obra_full:{bot:'Para obra completa lo mejor es que lo mire el encargado con el plano en la mano: se ajusta mucho mejor y te ahorra plata de verdad.\n\nPasame los m² totales y si tenés plano, mandámelo por acá.',
    input:{ph:'Ej: casa de 90 m²…',ex:'Casa de 90 m², una planta',k:'obra_full',n:'calc_full_ok'}},
  calc_full_ok:{bot:function(c){return 'Anotado: '+c.obra_full+'.\n\nEso se lo paso al encargado de obra para que te arme el cómputo completo, etapa por etapa. Es gratis y te lo mandamos por acá mismo.\n\n¿A qué nombre te lo mando?'},
    input:{ph:'Tu nombre…',ex:'Daniel Ferreyra',k:'nombre',n:'cf_tel'},
    proc:['📐 Derivando a cómputo de obra completa','🔔 Notificando al encargado de obra']},

  /* Un cómputo de obra completa no es un pedido: no hay nada que despachar
     todavía. Cerrarlo con "pedido confirmado" prometía algo que no pasó. */
  cf_tel:{bot:'¿Y un teléfono para mandártelo?',input:{ph:'Tu teléfono…',ex:'3834-667788',k:'tel',n:'cf_cierre'},
    proc:['👤 Creando ficha de cliente en el panel']},
  cf_cierre:{bot:function(c){return '✅ Cómputo pedido\n\n📋 Solicitud #CO-0146\n🏗️ '+c.obra_full+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n⏱️ El encargado te lo arma y te lo manda por acá dentro de las 48 hs hábiles, etapa por etapa.\n💰 Es sin cargo y no te obliga a comprarnos nada.\n\nSi tenés el plano, mandámelo por acá y sale más fino.'},opts:[
    {t:'Perfecto, gracias 👍',n:'gracias'},
    {t:'Mientras tanto, consultar un precio',n:'stock_que'}
  ],proc:['📋 Registrando solicitud #CO-0146','🔔 Asignando al encargado de obra','⏱️ SLA: 48 h hábiles','📊 Lead marcado CALIENTE en el panel']},

  /* ── PRESUPUESTO ────────────────────────────────────── */
  cot_lista:{bot:'Dale. Pasame la lista de materiales como la tengas —escrita a mano, del albañil, como venga— y yo la ordeno.',
    input:{ph:'Ej: 20 bolsas de cemento, 500 ladrillos…',ex:'30 bolsas de cemento, 800 ladrillos huecos y 2 m³ de arena',k:'lista',n:'cot_calc'},
    proc:['📋 Recibiendo lista de materiales']},

  cot_calc:{bot:'Dame dos segundos que armo el presupuesto con precios de hoy…',
    cards:[
      {k:'cemento',t:'Cemento Loma Negra 50 kg', s:'30 bolsas × $14.200', p:'$426.000'},
      {k:'ladrillo',t:'Ladrillo hueco 12x18x33', s:'800 u. × $940', p:'$752.000'},
      {k:'arena',t:'Arena gruesa', s:'2 m³ × $78.000', p:'$156.000'}
    ],
    bots:['📋 **Presupuesto #P-3390**\n\nSubtotal: $1.334.000\n🚚 Flete a Catamarca capital: $45.000\n\n💰 **Total: $1.379.000**\n\n💵 Pagando por transferencia o efectivo: **$1.241.100** (10% off)\n\n📅 Válido 7 días. Después los precios se mueven y no te quiero prometer algo que no puedo sostener.\n\n¿Cómo lo hacemos?'],
    opts:[
      {t:'✅ Lo tomo, coordinemos entrega',n:'cot_entrega'},
      {t:'😬 Está por encima de lo que pensaba',n:'obj_precio'},
      {t:'Quiero cambiar cantidades',n:'cot_lista'},
      {t:'❓ ¿Financian?',n:'dudas_financia'}
    ],
    proc:['💰 Consultando lista de precios vigente','📦 Verificando stock de cada ítem','🚚 Calculando flete por zona','🧮 Aplicando descuento por pago contado','📄 Generando presupuesto #P-3390','⏱️ Validez 7 días desde hoy']},

  obj_precio:{bot:'Te escucho, y tengo dos maneras reales de bajarlo. No es chamuyo:\n\n1️⃣ **Pago contado o transferencia** — te bajo el 10% directo. Sobre este presupuesto son $137.900 menos.\n\n2️⃣ **Segunda marca** — en cemento tengo Avellaneda a $11.800 la bolsa en vez de $14.200. Rinde igual para contrapiso y mampostería. Para losa te recomiendo no bajar de primera marca, ahí no conviene ahorrar.\n\n¿Cuál te sirve?',opts:[
    {t:'Las dos, rearmalo',n:'obj_rearmado'},
    {t:'Solo el contado',n:'cot_entrega'},
    {t:'Cambiar a segunda marca',n:'obj_rearmado'},
    {t:'Sigue estando alto',n:'persona'}
  ],proc:['⚠️ Objeción detectada: precio','🧭 Ofreciendo palancas reales: pago y marca','🚫 Sin bajar calidad donde es estructural']},

  obj_rearmado:{bot:'📋 **Presupuesto #P-3391** (rearmado)\n\nCemento Avellaneda 30 bolsas: $354.000\nLadrillo hueco 800 u.: $752.000\nArena gruesa 2 m³: $156.000\n🚚 Flete: $45.000\n\nSubtotal: $1.307.000\n💵 Con transferencia (-10%): **$1.176.300**\n\nBajaste $202.700 sin resignar nada estructural.\n\n¿Coordinamos la entrega?',opts:[
    {t:'✅ Dale, coordinemos',n:'cot_entrega'},
    {t:'Lo pienso y te aviso',n:'seguimiento'}
  ],proc:['🔄 Recalculando con segunda marca','💵 Aplicando descuento por transferencia','📄 Presupuesto #P-3391 generado']},

  cot_entrega:{bot:'Buenísimo 🙌 ¿Cómo lo querés recibir?',opts:[
    {t:'🚚 Con flete a la obra',n:'cot_dir',k:'entrega'},
    {t:'🏪 Lo retiro yo con camioneta',n:'cot_dia',k:'entrega'}
  ]},
  cot_dir:{bot:'¿A qué dirección va?',input:{ph:'Dirección de la obra…',ex:'Los Ceibos 340, Valle Viejo',k:'dir',n:'cot_dia'},
    proc:['📍 Verificando zona de reparto','🚚 Camión disponible']},
  cot_dia:{bot:'¿Qué día te sirve? Estos tengo con camión libre:',opts:[
    {t:'Mañana a la mañana',n:'dato_nombre',k:'dia'},{t:'Mañana a la tarde',n:'dato_nombre',k:'dia'},
    {t:'Pasado mañana',n:'dato_nombre',k:'dia'},{t:'El sábado a la mañana',n:'dato_nombre',k:'dia'}
  ],proc:['📅 Consultando disponibilidad de camión','🚚 2 de 3 camiones libres esa franja']},

  /* ── STOCK ──────────────────────────────────────────── */
  stock_que:{bot:'Decime qué necesitás y te digo precio y si lo tengo.',
    input:{ph:'Ej: hierro del 8…',ex:'Hierro del 8',k:'producto',n:'stock_ok'},
    proc:['📦 Consultando inventario en tiempo real']},
  stock_ok:{bot:function(c){return '📦 '+c.producto+'\n\n✅ En stock: 120 unidades\n💰 $18.400 c/u\n💵 Por transferencia: $16.560\n🚚 Entrega inmediata o flete en 24 hs\n\nSi te llevás más de 50, el precio baja a $17.200. ¿Cuántas necesitás?'},opts:[
    {t:'Armame el presupuesto',n:'cot_lista'},
    {t:'Consultar otro producto',n:'stock_que'},
    {t:'Solo quería el precio, gracias',n:'gracias'}
  ],proc:['📦 Stock verificado','💰 Precio vigente al día','📊 Aplicando escala por cantidad']},

  /* ── DATOS Y CIERRE ─────────────────────────────────── */
  dato_nombre:{bot:'¿A nombre de quién lo pongo?',input:{ph:'Tu nombre…',ex:'Daniel Ferreyra',k:'nombre',n:'dato_tel'}},
  dato_tel:{bot:'¿Y un teléfono para avisarte cuando salga el camión?',input:{ph:'Tu teléfono…',ex:'3834-667788',k:'tel',n:'cierre'},
    proc:['👤 Creando ficha de cliente en el panel']},

  /* La entrega la cierra una persona: el camión, el acceso a la obra y quién
     descarga no son cosas que un sistema pueda dar por resueltas solo. */
  cierre:{bot:function(c){return '✅ Pedido tomado\n\n📋 Pedido #P-3391\n🚚 '+(c.entrega||'A coordinar')+(c.dir?'\n📍 '+c.dir:'')+'\n📅 '+(c.dia||'a coordinar')+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n💵 Si pagás por transferencia, te paso el CBU y aplicamos el 10%.'},
    bots:['👤 La entrega te la coordina Gustavo, el encargado de logística.\n\nTe llama hoy para cerrar dos cosas que por WhatsApp no puedo dar por resueltas: **la franja horaria exacta y cómo entra el camión a la obra.** Si el acceso es angosto o hay que descargar a pulmón, mejor saberlo antes y no con el camión en la puerta.\n\nÉl ya tiene el pedido cargado, no le repitas nada. Y cuando el camión salga del corralón te aviso yo por acá.'],
    opts:[
      {t:'Perfecto, gracias 👍',n:'gracias'},{t:'Necesito calcular otra etapa',n:'calc_que'}
    ],proc:['📋 Registrando pedido #P-3391','📦 Reservando stock en el depósito','🚚 Cargando en la hoja de ruta del camión','📅 Bloqueando franja tentativa de entrega','👤 DERIVANDO a Gustavo (encargado de logística)','📄 Adjuntando pedido, dirección y datos de contacto','⚠️ Franja y acceso: los confirma una persona','📲 Aviso automático cuando salga el camión','📊 Venta registrada en el panel']},

  seguimiento:{bot:'Sin problema, tomate el tiempo 👍\n\nTe dejo el presupuesto guardado 7 días con estos precios. Si querés lo retomamos y no tenés que armar nada de nuevo.',opts:[
    {t:'Dale, gracias',n:'gracias'}
  ],proc:['📄 Presupuesto guardado 7 días','🔔 Recordatorio programado a 5 días','📊 Lead marcado TIBIO en el panel']},

  /* ── DUDAS ──────────────────────────────────────────── */
  dudas:{bot:'Dale, preguntame.',opts:[
    {t:'¿Desde cuánto es el flete gratis?',n:'dudas_flete'},
    {t:'¿Financian?',n:'dudas_financia'},
    {t:'¿Puedo devolver lo que sobra?',n:'dudas_devolucion'},
    {t:'¿Hacen factura A?',n:'dudas_factura'},
    {t:'¿Qué horario tienen para cargar?',n:'dudas_horario'},
    {t:'¿Consiguen lo que no tienen?',n:'dudas_pedido'},
    {t:'Quiero hablar con una persona',n:'persona'}
  ]},
  dudas_flete:{bot:'🚚 Fletes:\n\n• Capital y Valle Viejo: $45.000, gratis a partir de $2.000.000 de compra\n• Fray Mamerto Esquiú y Sumalao: $65.000\n• Interior de la provincia: se cotiza según distancia\n\nEl camión con hidrogrúa descarga sin que tengas que poner gente. Si es a pulmón, coordinamos que haya alguien en la obra.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Pedir presupuesto',n:'cot_lista'}
  ]},
  dudas_financia:{bot:'Sí:\n\n💳 Tarjetas en 3 y 6 cuotas sin interés\n💳 Hasta 12 cuotas con interés\n🧾 Cuenta corriente para constructoras y clientes habituales, con referencias\n💵 Y al revés: pagando contado o por transferencia te hacemos 10% de descuento\n\nLa mayoría termina eligiendo transferencia justamente por ese 10%.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Pedir presupuesto',n:'cot_lista'}
  ]},
  dudas_devolucion:{bot:'Sí, y es una pregunta que hace muy poca gente y le cuesta plata al que no la hace.\n\n✅ Se acepta devolución de material sin usar, en su envase original, hasta 30 días con el remito.\n❌ No se aceptan bolsas abiertas, húmedas ni material a granel ya descargado (arena, piedra).\n\nPor eso el cómputo va con 8% de desperdicio y no con 20%: no te vendemos de más para después no devolverte.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Calcular mi obra',n:'calc_que'}
  ]},
  dudas_factura:{bot:'Sí, facturamos A, B y C.\n\nPara factura A necesitamos tu CUIT y constancia de inscripción. Si sos constructora o monotributista, te la dejamos cargada y ya sale automática en cada compra.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Pedir presupuesto',n:'cot_lista'}
  ]},
  dudas_horario:{bot:'🕐 Depósito y carga:\nLun a Vie 7:30 a 12:30 y 15:00 a 19:00\nSáb 7:30 a 13:00\n\n💡 Consejo: para cargas grandes vení temprano. Después de las 10 se junta cola de camiones y esperás.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Consultar stock',n:'stock_que'}
  ]},
  dudas_pedido:{bot:'Sí. Si es algo que no tenemos en stock, lo pedimos al proveedor.\n\n⏱️ Plazo típico: 3 a 7 días hábiles según el material.\n💰 Se pide con el 50% de seña.\n\nY si no lo conseguimos, te lo decimos de una y te devolvemos la seña. No te dejamos esperando dos semanas.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Consultar un producto',n:'stock_que'}
  ]},

  persona:{bot:'Dale, te paso con el encargado. ¿Qué le adelanto?',
    input:{ph:'Tu consulta…',ex:'Necesito precio por volumen para una obra grande',k:'consulta',n:'persona_ok'}},
  persona_ok:{bot:function(c){return '✅ Te derivo con el encargado.\n\n📋 Consulta #E-0771\n💬 "'+c.consulta+'"\n\n👤 Le mandé la consulta con el cómputo y el presupuesto que armamos, así **no tenés que volver a pasarle la lista.**\n\nTe escribe en el día. El corralón atiende de 7:30 a 12:30 y de 15 a 19.'},opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Mientras tanto, consultar un precio',n:'stock_que'}
  ],proc:['📋 Ticket #E-0771 creado','👤 DERIVANDO al encargado','📄 Adjuntando cómputo y presupuesto de la charla','⏱️ SLA de respuesta: 4 h hábiles','📊 Consulta visible en el panel']},

  gracias:{bot:'¡Gracias! 🙌 Cualquier cosa escribime, contesto siempre.\n\n📍 Ruta 38 km 4, Catamarca\n🕐 Lun a Vie 7:30-12:30 y 15-19 · Sáb 7:30-13',opts:[],end:true,
    proc:['📊 Conversación registrada en el panel','✅ Ninguna consulta quedó sin responder']}
},

/* ══════════════════════════════════════════════════════════════════
   4 · AUTOPARTES / MOTOPARTES — Repuestos del Valle
   El rubro se gana o se pierde en una pregunta: "¿lo tenés para mi
   auto?". Por eso el flujo arranca identificando el vehículo, no el
   producto. Un vendedor de repuestos de verdad siempre ofrece las dos
   opciones —original y alternativo— con la diferencia de garantía
   sobre la mesa, y deja que el cliente elija. Eso genera confianza y
   sube el ticket con el kit de service.
   ══════════════════════════════════════════════════════════════════ */
autopartes:{
  start:{bot:'¡Buenas! Soy Marce, de Repuestos del Valle 🔧\nDecime qué necesitás y te digo al toque si lo tengo, a la hora que sea.\n\n¿Qué buscás?',opts:[
    {t:'🔧 Un repuesto para mi auto',n:'v_marca',k:'vehiculo',v:'auto'},
    {t:'🏍️ Un repuesto para mi moto',n:'m_marca',k:'vehiculo',v:'moto'},
    {t:'🛢️ Kit de service completo',n:'kit_modelo'},
    {t:'📦 Estado de mi pedido',n:'ped_num'},
    {t:'❓ Tengo una duda',n:'dudas'}
  ],proc:['📡 Consulta entrante — WhatsApp','🤖 Asistente de mostrador activo']},

  /* ── AUTO ───────────────────────────────────────────── */
  v_marca:{bot:'Dale. ¿Qué marca es?',opts:[
    {t:'Fiat',n:'v_modelo',k:'marca'},{t:'VW',n:'v_modelo',k:'marca'},
    {t:'Chevrolet',n:'v_modelo',k:'marca'},{t:'Toyota',n:'v_modelo',k:'marca'},
    {t:'Renault',n:'v_modelo',k:'marca'},{t:'Ford',n:'v_modelo',k:'marca'},
    {t:'Otra',n:'v_modelo_libre'}
  ],proc:['🚗 Abriendo catálogo por vehículo']},
  v_modelo_libre:{bot:'Decime marca, modelo y año.',input:{ph:'Ej: Peugeot 208 2020…',ex:'Peugeot 208 2020',k:'modelo',n:'v_que'}},
  v_modelo:{bot:function(c){return '¿Qué modelo y año de '+c.marca+'?'},
    input:{ph:'Ej: Cronos 2021…',ex:'Cronos 2021',k:'modelo',n:'v_que'},
    proc:['📋 Identificando vehículo']},

  v_que:{bot:function(c){return 'Perfecto, '+(c.marca?c.marca+' ':'')+c.modelo+' ✅\nYa tengo el despiece cargado. ¿Qué necesitás?'},opts:[
    {t:'🛑 Frenos',n:'v_opciones',k:'parte'},{t:'🔩 Suspensión',n:'v_opciones',k:'parte'},
    {t:'🛢️ Filtros y aceite',n:'kit_modelo'},{t:'🔋 Batería',n:'v_bateria'},
    {t:'⚙️ Embrague',n:'v_opciones',k:'parte'},{t:'🔗 Correa de distribución',n:'v_opciones',k:'parte'},
    {t:'Otra cosa',n:'v_otro'}
  ],proc:['🔍 Cargando despiece del modelo','✅ Vehículo identificado']},

  v_otro:{bot:'Decime qué es y lo busco.',input:{ph:'Ej: bomba de agua…',ex:'Bomba de agua',k:'parte',n:'v_opciones'}},

  v_opciones:{bot:function(c){return 'Lo tengo para tu '+c.modelo+', en dos opciones. Te las paso derechas para que elijas vos 👇'},
    cards:[
      {k:'freno',t:'Original (marca del fabricante)', s:'Garantía 12 meses · calidad de fábrica · encastre exacto', p:'$89.400', b:'En stock'},
      {k:'freno',t:'Alternativo (primera línea)', s:'Garantía 6 meses · marca reconocida · rinde muy bien', p:'$52.800', b:'En stock'}
    ],
    bots:['Sinceramente: para uso de ciudad el alternativo te rinde igual y te ahorra $36.600. El original lo recomiendo si hacés mucha ruta o cargás peso, ahí sí se nota.\n\nLos dos los tengo acá, entrega inmediata. ¿Cuál te llevo?'],
    opts:[
      {t:'El original',n:'v_colocacion',k:'pieza',v:'Original — $89.400'},
      {t:'El alternativo',n:'v_colocacion',k:'pieza',v:'Alternativo — $52.800'},
      {t:'😬 Los dos me parecen caros',n:'obj_precio'},
      {t:'❓ ¿Cuál es la diferencia real?',n:'dudas_original'}
    ],
    proc:['📦 Consultando stock por número de pieza','✅ 2 alternativas compatibles','💰 Cargando precios vigentes','📸 Adjuntando fichas']},

  obj_precio:{bot:'Te entiendo. Dos cosas honestas:\n\n1️⃣ Pagando por transferencia te hago 10% off: el alternativo te queda en **$47.520**.\n\n2️⃣ Tengo una tercera línea más económica a $38.000, pero te aviso: garantía de 3 meses y en frenos yo no bajaría de primera línea. Es tu seguridad, no un filtro de aire.\n\nSi querés te la paso igual, pero prefiero decirte lo que pienso.',opts:[
    {t:'Dale, el alternativo con transferencia',n:'v_colocacion',k:'pieza',v:'Alternativo — $47.520 (transferencia)'},
    {t:'Pasame la tercera línea igual',n:'v_colocacion',k:'pieza',v:'Tercera línea — $38.000'},
    {t:'Lo pienso',n:'seguimiento'}
  ],proc:['⚠️ Objeción detectada: precio','🧭 Ofreciendo palanca de pago + alternativa','⚠️ Advertencia de seguridad en pieza crítica']},

  v_bateria:{bot:'Baterías tengo estas para tu modelo 👇',
    cards:[
      {k:'bateria',t:'Batería 12x65 — 12 meses gtía.', s:'Libre mantenimiento · con tu vieja en parte de pago', p:'$182.000', b:'En stock'},
      {k:'bateria',t:'Batería 12x65 reforzada — 18 meses', s:'Ideal si tenés alarma, estéreo o arranques cortos', p:'$228.000'}
    ],
    bots:['Te tomo la batería vieja y te descuento $25.000. Y si estás cerca del centro, te la llevo y te la coloco sin cargo.\n\n¿Cuál te sirve?'],
    opts:[
      {t:'La de 12 meses',n:'v_colocacion',k:'pieza',v:'Batería 12x65 — $182.000'},
      {t:'La reforzada',n:'v_colocacion',k:'pieza',v:'Batería reforzada — $228.000'},
      {t:'¿Me la colocás?',n:'v_colocacion'}
    ],proc:['🔋 Consultando stock de baterías','♻️ Aplicando toma de batería usada']},

  v_colocacion:{bot:'¿La colocás vos o te la dejo lista puesta? Tenemos taller propio.',opts:[
    {t:'🔧 Colocámela ustedes',n:'v_turno',k:'colocacion',v:'con colocación en taller'},
    {t:'🏠 Me la llevo y la coloco yo',n:'v_entrega',k:'colocacion',v:'solo el repuesto'}
  ],proc:['🔧 Ofreciendo servicio de colocación','💰 Ticket promedio +40% con colocación']},

  v_turno:{bot:'Perfecto. Tengo estos turnos de taller:',opts:[
    {t:'Mañana 09:00',n:'dato_nombre',k:'turno'},{t:'Mañana 15:00',n:'dato_nombre',k:'turno'},
    {t:'Pasado 09:00',n:'dato_nombre',k:'turno'},{t:'El sábado 10:00',n:'dato_nombre',k:'turno'}
  ],proc:['📅 Consultando agenda del taller','🔧 2 elevadores disponibles']},

  v_entrega:{bot:'Dale. ¿Cómo lo recibís?',opts:[
    {t:'🏪 Paso a retirarlo',n:'dato_nombre',k:'entrega'},
    {t:'🛵 Envío en Catamarca ($6.000)',n:'dato_nombre',k:'entrega'},
    {t:'📦 Envío al interior',n:'dato_nombre',k:'entrega'}
  ],proc:['📦 Reservando pieza a nombre del cliente']},

  /* ── MOTO ───────────────────────────────────────────── */
  m_marca:{bot:'Dale. ¿Qué moto tenés?',input:{ph:'Marca, modelo y cilindrada…',ex:'Honda Wave 110',k:'modelo',n:'m_que'},
    proc:['🏍️ Abriendo catálogo de motopartes']},
  m_que:{bot:function(c){return 'Perfecto, '+c.modelo+' ✅\n¿Qué necesitás?'},opts:[
    {t:'🔗 Kit de transmisión',n:'m_opciones',k:'parte'},{t:'🛑 Frenos',n:'m_opciones',k:'parte'},
    {t:'🛢️ Aceite y filtros',n:'kit_modelo'},{t:'⚡ Batería o eléctrico',n:'m_opciones',k:'parte'},
    {t:'⛑️ Casco y accesorios',n:'m_casco'},{t:'🛞 Cubiertas',n:'m_opciones',k:'parte'}
  ],proc:['🔍 Cargando despiece del modelo']},

  m_opciones:{bot:function(c){return 'Para tu '+c.modelo+' tengo estas dos 👇'},
    cards:[
      {k:'kitmoto',t:'Original (marca del fabricante)', s:'Garantía 12 meses · durabilidad de fábrica', p:'$78.500', b:'En stock'},
      {k:'kitmoto',t:'Alternativo primera línea', s:'Garantía 6 meses · muy buena relación precio-duración', p:'$44.900', b:'En stock'}
    ],
    bots:['Si la usás para trabajar todos los días, andá al original: te dura casi el doble y a la larga te sale más barato. Si es uso ocasional, el alternativo va perfecto.\n\n¿Cuál te preparo?'],
    opts:[
      {t:'El original',n:'v_colocacion',k:'pieza',v:'Original — $78.500'},
      {t:'El alternativo',n:'v_colocacion',k:'pieza',v:'Alternativo — $44.900'},
      {t:'😬 Están caros',n:'obj_precio'}
    ],proc:['📦 Consultando stock de motopartes','✅ 2 alternativas compatibles']},

  m_casco:{bot:'Cascos homologados tengo estos 👇',
    cards:[
      {k:'casco',t:'Casco integral — homologado IRAM', s:'Visor antiempañante · talles S a XL', p:'$96.000', b:'En stock'},
      {k:'casco',t:'Casco rebatible — homologado IRAM', s:'Doble visor · más cómodo para ruta', p:'$148.000'}
    ],
    bots:['Los dos están homologados, así que ninguno te lo va a rechazar el control. ¿Qué talle usás?'],
    opts:[
      {t:'S',n:'v_entrega',k:'pieza',v:'Casco integral talle S'},{t:'M',n:'v_entrega',k:'pieza',v:'Casco integral talle M'},
      {t:'L',n:'v_entrega',k:'pieza',v:'Casco integral talle L'},{t:'XL',n:'v_entrega',k:'pieza',v:'Casco integral talle XL'}
    ],proc:['⛑️ Consultando stock por talle','✅ Homologación IRAM verificada']},

  /* ── KIT DE SERVICE (bundle) ────────────────────────── */
  kit_modelo:{bot:'Buenísimo, el kit sale bastante mejor que comprar suelto. ¿Qué vehículo es?',
    input:{ph:'Marca, modelo y año…',ex:'Fiat Cronos 2021',k:'modelo',n:'kit_km'},
    proc:['🛢️ Abriendo armador de kit de service']},
  kit_km:{bot:'¿Cuántos kilómetros tiene?',opts:[
    {t:'Menos de 50.000',n:'kit_result',k:'km'},{t:'50.000 a 100.000',n:'kit_result',k:'km'},
    {t:'100.000 a 150.000',n:'kit_result',k:'km'},{t:'Más de 150.000',n:'kit_result',k:'km'}
  ]},
  kit_result:{bot:function(c){return '🛢️ Kit de service para '+c.modelo+' ('+c.km+' km)'},
    cards:[
      {k:'aceite',t:'Kit completo de service', s:'Aceite sintético 5W30 4L · filtro de aceite · filtro de aire · filtro de habitáculo · 4 bujías', p:'$214.000', b:'Ahorrás $47.500'}
    ],
    bots:['Comprado suelto te sale $261.500. En kit, **$214.000**.\n\nY si lo hacés en nuestro taller, la mano de obra sale $58.000 y te queda el service registrado, que después suma cuando vendés el auto.\n\n¿Cómo lo hacemos?'],
    opts:[
      {t:'🔧 Kit + colocación en taller',n:'v_turno',k:'pieza',v:'Kit de service completo + mano de obra'},
      {t:'📦 Solo el kit, lo hago yo',n:'v_entrega',k:'pieza',v:'Kit de service completo'},
      {t:'❓ ¿Qué aceite le va?',n:'dudas_aceite'}
    ],
    proc:['🔍 Cruzando especificaciones del fabricante','📦 Armando kit compatible','💰 Comparando kit vs. suelto','✅ Ahorro calculado: $47.500']},

  /* ── PEDIDOS ────────────────────────────────────────── */
  ped_num:{bot:'Pasame el número de pedido.',input:{ph:'Ej: #R-2214…',ex:'#R-2214',k:'pedido',n:'ped_estado'},
    proc:['📦 Buscando pedido en el sistema']},
  ped_estado:{bot:function(c){return '📦 Pedido '+c.pedido+'\n\n✅ Recibido\n✅ Pago confirmado\n✅ Preparado\n🟡 En camino\n⚪ Entregado\n\n🔧 Pastillas de freno delanteras — Cronos 2021\n📍 Destino: Catamarca capital\n⏱️ Llega hoy entre las 15 y las 18\n\nTe aviso por acá cuando salga el repartidor.'},opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Necesito cambiar la dirección',n:'persona'}
  ],proc:['📦 Pedido localizado','🚚 Consultando estado de logística','📍 Ubicación actualizada']},

  /* ── DATOS Y CIERRE ─────────────────────────────────── */
  dato_nombre:{bot:'¿Tu nombre?',input:{ph:'Tu nombre…',ex:'Luis Carrizo',k:'nombre',n:'dato_tel'}},
  dato_tel:{bot:'¿Y un teléfono?',input:{ph:'Tu teléfono…',ex:'3834-445566',k:'tel',n:'cierre'},
    proc:['👤 Creando ficha de cliente en el panel']},

  cierre:{bot:function(c){return '✅ Listo\n\n📋 Pedido #R-2218\n🔧 '+(c.pieza||'Repuesto')+'\n🚗 '+(c.modelo||'')+'\n'+(c.turno?'📅 Turno de taller: '+c.turno:'📦 '+(c.entrega||'Retiro en local'))+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n📦 La pieza queda reservada a tu nombre 48 hs.\n🧾 Garantía por escrito con el remito.\n\nCualquier cosa escribime por acá.'},opts:[
    {t:'Perfecto, gracias 👍',n:'gracias'},{t:'Necesito otra cosa más',n:'start'}
  ],proc:['📋 Registrando pedido #R-2218','📦 Reservando pieza 48 h','📅 Cargando turno en agenda del taller','🧾 Generando garantía escrita','📲 Programando aviso de entrega','📊 Venta registrada en el panel','📉 Descontando stock del inventario']},

  seguimiento:{bot:'Dale, sin apuro 👍\nTe dejo la consulta guardada. Si te decidís, escribime y no tenés que repetir nada: ya sé qué auto tenés y qué buscabas.',opts:[
    {t:'Gracias',n:'gracias'}
  ],proc:['📝 Consulta guardada con el vehículo del cliente','🔔 Seguimiento a 3 días','📊 Lead marcado TIBIO']},

  /* ── DUDAS ──────────────────────────────────────────── */
  dudas:{bot:'Dale, preguntame.',opts:[
    {t:'¿Original o alternativo?',n:'dudas_original'},
    {t:'¿Qué garantía tienen?',n:'dudas_garantia'},
    {t:'¿Colocan ustedes?',n:'dudas_taller'},
    {t:'¿Hacen envíos al interior?',n:'dudas_envio'},
    {t:'¿Consiguen lo que no tienen?',n:'dudas_conseguir'},
    {t:'¿Hacen factura A?',n:'dudas_factura'},
    {t:'Quiero hablar con una persona',n:'persona'}
  ]},
  dudas_original:{bot:'La diferencia real, sin vueltas:\n\n🔵 **Original** — lo fabrica (o certifica) la marca del auto. Encastre exacto, 12 meses de garantía, dura más. Cuesta entre 40% y 70% más.\n\n🟢 **Alternativo de primera línea** — marcas que le fabrican a las terminales. Calidad muy pareja, 6 meses de garantía.\n\n🟡 **Tercera línea** — sirve para piezas no críticas (filtros, escobillas). En frenos, dirección o suspensión no te lo recomiendo.\n\nRegla: si de esa pieza depende que frenes o dobles, no ahorres ahí.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Buscar un repuesto',n:'start'}
  ]},
  dudas_garantia:{bot:'🧾 Garantía por escrito en el remito, siempre:\n\n• Original: 12 meses\n• Alternativo primera línea: 6 meses\n• Tercera línea: 3 meses\n• Colocación en nuestro taller: 6 meses sobre la mano de obra\n\nSi falla dentro del plazo, se cambia. Si lo colocamos nosotros, ni siquiera tenés que discutir de quién fue la culpa.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Buscar un repuesto',n:'start'}
  ]},
  dudas_taller:{bot:'Sí, tenemos taller propio con dos elevadores.\n\n🔧 Turnos de lunes a sábado\n⏱️ Un service completo sale en 90 minutos, podés esperarlo\n🧾 Queda registrado en el historial del vehículo\n\nY si comprás el repuesto acá, la mano de obra tiene precio preferencial.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Pedir turno',n:'v_turno'}
  ]},
  dudas_envio:{bot:'🚚 Envíos:\n\n• Catamarca capital: $6.000, llega el mismo día si pedís antes de las 15\n• Valle Viejo y Fray Mamerto Esquiú: $9.000, 24 hs\n• Interior de la provincia y otras provincias: por transporte o correo, 2 a 4 días\n\nPara mandar al interior pedimos el pago por adelantado. Te mando el seguimiento por acá.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Buscar un repuesto',n:'start'}
  ]},
  dudas_conseguir:{bot:'Sí. Si no lo tengo en stock, lo pido.\n\n⏱️ Plazo: 48 a 72 hs si está en Córdoba o Buenos Aires\n💰 Se pide con el 50% de seña\n\nY si no lo consigo, te lo digo el mismo día y te devuelvo la seña. No te dejo esperando una semana para después decirte que no.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Buscar un repuesto',n:'start'}
  ]},
  dudas_factura:{bot:'Sí, facturamos A, B y C. Para factura A necesito tu CUIT y constancia de inscripción.\n\nSi tenés taller o flota, te dejamos la cuenta cargada con precio de lista mayorista.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Buscar un repuesto',n:'start'}
  ]},
  dudas_aceite:{bot:function(c){return 'Para el '+(c.modelo||'tu modelo')+' el fabricante pide **5W30 sintético**, cambio cada 10.000 km o 12 meses, lo que ocurra primero.\n\n💡 Si andás mucho en ciudad con arranques cortos, adelantalo a 7.500 km. El motor te lo agradece y el costo es el mismo a la larga.'},opts:[
    {t:'Armame el kit',n:'kit_km'},{t:'Otra duda',n:'dudas'}
  ]},

  persona:{bot:'Dale, te paso con el mostrador. ¿Qué le adelanto?',
    input:{ph:'Tu consulta…',ex:'Necesito precio mayorista para mi taller',k:'consulta',n:'persona_ok'}},
  persona_ok:{bot:'✅ Listo.\n\n📋 Consulta #M-0533\nTe responden en el día. El local atiende de 8:30 a 13 y de 16:30 a 20:30.',opts:[
    {t:'Gracias 👍',n:'gracias'}
  ],proc:['📋 Ticket #M-0533 creado','🔔 Notificando al mostrador','📄 Adjuntando el vehículo y la pieza consultada']},

  gracias:{bot:'¡Gracias! 🙌 Cualquier cosa escribime, contesto siempre.\n\n📍 Av. Belgrano 890, Catamarca\n🕐 Lun a Sáb 8:30-13 y 16:30-20:30',opts:[],end:true,
    proc:['📊 Conversación registrada en el panel','✅ Ninguna consulta quedó sin responder']}
},

/* ══════════════════════════════════════════════════════════════════
   5 · TIENDA DE ROPA — Alfis Jeans
   Ticket bajo y decisión rápida: acá el vendedor no califica, empuja.
   Las palancas son el talle (escasez real de stock), el 2x (sube
   ticket) y el descuento por transferencia. Cambios y talles van
   arriba porque son la fricción número uno de la venta online.
   ══════════════════════════════════════════════════════════════════ */
ropa:{
  start:{bot:'¡Hola! Soy Sofi, de Alfis Jeans 👋\nTe atiendo por acá aunque el local esté cerrado.\n\n¿Qué andás buscando?',opts:[
    {t:'👕 Ver productos',n:'p_cat'},
    {t:'🔥 Ofertas de la semana',n:'p_ofertas'},
    {t:'📦 Estado de mi pedido',n:'ped_num'},
    {t:'🔄 Cambios y devoluciones',n:'cambios'},
    {t:'📏 Guía de talles',n:'dudas_talles'},
    {t:'❓ Tengo una duda',n:'dudas'}
  ],proc:['📡 Consulta entrante — WhatsApp','🤖 Asistente de ventas activo']},

  p_cat:{bot:'¿Qué te muestro?',opts:[
    {t:'👖 Jeans',n:'p_genero',k:'cat'},{t:'👕 Remeras',n:'p_genero',k:'cat'},
    {t:'🧥 Camperas',n:'p_genero',k:'cat'},{t:'👟 Zapatillas',n:'p_genero',k:'cat'},
    {t:'🔥 Ofertas',n:'p_ofertas'}
  ]},
  p_genero:{bot:'¿Para quién?',opts:[
    {t:'Hombre',n:'p_lista',k:'genero'},{t:'Mujer',n:'p_lista',k:'genero'},{t:'Unisex',n:'p_lista',k:'genero'}
  ],proc:['🛍️ Filtrando catálogo','📦 Cruzando con stock real']},

  p_lista:{bot:function(c){return 'Mirá lo que tengo en '+String(c.cat||'').toLowerCase()+' '+String(c.genero||'').toLowerCase()+' 👇'},
    cards:[
      {k:'jean',     t:'Jean Slim Fit Negro', s:'Elastizado · talles 38 al 46 · corte alto', p:'$35.000', b:'⭐ El más vendido'},
      {k:'jean',     t:'Jean Cargo Beige',    s:'Rígido · talles 38 al 46 · bolsillos laterales', p:'$40.000'},
      {k:'zapatilla',t:'Zapatilla Urban Blanca', s:'Cuero ecológico · talles 38 al 45', p:'$45.000', b:'Quedan 4 pares'}
    ],
    bots:['El Slim Fit Negro es el que más sale, no falla con nada. Y te tiro la que sirve: **llevando dos prendas de jean te quedan a $31.500 cada una**.\n\n¿Cuál te gustó?'],
    opts:[
      {t:'El Slim Fit Negro',n:'p_talle',k:'producto',v:'Jean Slim Fit Negro'},
      {t:'El Cargo Beige',n:'p_talle',k:'producto',v:'Jean Cargo Beige'},
      {t:'La zapatilla blanca',n:'p_talle',k:'producto',v:'Zapatilla Urban Blanca'},
      {t:'📏 No sé qué talle soy',n:'dudas_talles'},
      {t:'Ver otra categoría',n:'p_cat'}
    ],
    proc:['🛍️ 3 productos coinciden','📦 Verificando stock por talle','💰 Aplicando promo 2 unidades','📸 Adjuntando fichas']},

  p_ofertas:{bot:'🔥 Lo que está en oferta esta semana:',
    cards:[
      {k:'jean',  t:'Jean Recto Clásico', s:'Antes $32.000 · talles 38 al 48', p:'$25.600', b:'-20%'},
      {k:'remera',t:'Remera Básica — 2x1', s:'Blanca, negra o gris · talles S a XXL', p:'$12.000 las dos', b:'2x1'},
      {k:'campera',t:'Campera de Jean', s:'Antes $68.000 · talles S a XL', p:'$47.600', b:'-30%'}
    ],
    bots:['La campera de jean es la que más se está llevando: me quedan 6 y no repongo hasta el mes que viene.\n\n⏰ Los precios de oferta valen hasta el domingo.\n\n¿Alguna te sirve?'],
    opts:[
      {t:'El jean recto',n:'p_talle',k:'producto',v:'Jean Recto Clásico'},
      {t:'Las remeras 2x1',n:'p_talle',k:'producto',v:'Remeras Básicas 2x1'},
      {t:'La campera de jean',n:'p_talle',k:'producto',v:'Campera de Jean'},
      {t:'Ver todo el catálogo',n:'p_cat'}
    ],proc:['🔥 Cargando ofertas vigentes','📦 Stock limitado verificado']},

  p_talle:{bot:function(c){return '¡Buena elección! ¿Qué talle usás en '+c.producto+'?'},opts:[
    {t:'38',n:'p_stock',k:'talle'},{t:'40',n:'p_stock',k:'talle'},{t:'42',n:'p_stock',k:'talle'},
    {t:'44',n:'p_stock',k:'talle'},{t:'46',n:'p_stock',k:'talle'},{t:'No estoy seguro',n:'dudas_talles'}
  ],proc:['📏 Consultando disponibilidad por talle']},

  p_stock:{bot:function(c){return '📦 Talle '+c.talle+': me quedan **2 unidades**.\n\nTe las reservo 24 hs sin compromiso mientras decidís, así no te quedás sin.\n\n¿Llevás una o aprovechás la promo de dos?'},opts:[
    {t:'Una',n:'p_envio',k:'cant'},
    {t:'Dos (me queda $31.500 c/u)',n:'p_envio',k:'cant'},
    {t:'Quiero sumar otra prenda',n:'p_cat'}
  ],proc:['📦 Stock verificado: 2 unidades','🔒 Reserva temporal 24 h activada','💰 Recalculando con promo por cantidad']},

  p_envio:{bot:'¿Cómo lo recibís?',opts:[
    {t:'🏪 Retiro en el local (gratis)',n:'dato_nombre',k:'envio'},
    {t:'🛵 Envío en Catamarca ($2.500)',n:'p_dir',k:'envio'},
    {t:'📦 Envío al interior ($5.000)',n:'p_dir',k:'envio'}
  ]},
  p_dir:{bot:'¿A qué dirección?',input:{ph:'Tu dirección…',ex:'Rivadavia 320, B° Centro',k:'dir',n:'dato_nombre'},
    proc:['📍 Validando zona de reparto','🕐 Entrega estimada: 24 a 48 h']},

  dato_nombre:{bot:'¿Tu nombre?',input:{ph:'Tu nombre…',ex:'Ana López',k:'nombre',n:'dato_tel'}},
  dato_tel:{bot:'¿Y un teléfono?',input:{ph:'Tu teléfono…',ex:'3834-789012',k:'tel',n:'p_pago'},
    proc:['👤 Creando ficha de cliente en el panel']},

  p_pago:{bot:'¿Cómo preferís pagar?',opts:[
    {t:'💳 Mercado Pago (6 cuotas)',n:'p_resumen',k:'pago'},
    {t:'💵 Transferencia (10% off)',n:'p_resumen',k:'pago'},
    {t:'🏪 Efectivo al retirar',n:'p_resumen',k:'pago'}
  ],proc:['💳 Cargando medios de pago habilitados']},

  p_resumen:{bot:function(c){return '📋 Repasemos:\n\n👕 '+c.producto+' — talle '+c.talle+'\n📦 Cantidad: '+(c.cant||'1')+'\n🚚 '+(c.envio||'Retiro en el local')+(c.dir?'\n📍 '+c.dir:'')+'\n💳 '+c.pago+'\n👤 '+c.nombre+'\n\n¿Está todo bien?'},opts:[
    {t:'✅ Confirmar',n:'cierre'},
    {t:'✏️ Cambiar algo',n:'p_cat'},
    {t:'❌ Cancelar',n:'start'}
  ]},

  cierre:{bot:function(c){return '✅ ¡Pedido confirmado!\n\n📋 Pedido #P-5523\n👕 '+c.producto+' talle '+c.talle+' ×'+(c.cant||'1')+'\n🚚 '+(c.envio||'Retiro en el local')+'\n💳 '+c.pago+'\n\n⏱️ '+(c.dir?'Te llega en 24 a 48 hs':'Lo tenés listo en el local en 2 horas')+'\n🔄 Tenés 30 días para cambiarlo, con la etiqueta puesta\n\nTe voy avisando por acá cómo avanza. ¡Gracias! 🛍️'},opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Quiero comprar otra cosa',n:'p_cat'}
  ],proc:['📋 Registrando pedido #P-5523','👤 Guardando datos del cliente','📉 Descontando stock del inventario','💳 Generando link de pago','📦 Orden de preparación al depósito','🏷️ Generando etiqueta de envío','📲 Activando seguimiento del pedido','📊 Sincronizando stock en todos los canales','📊 Venta registrada en el panel']},

  ped_num:{bot:'Pasame el número de pedido.',input:{ph:'Ej: #P-5523…',ex:'#P-5523',k:'pedido',n:'ped_estado'},
    proc:['📦 Buscando pedido']},
  ped_estado:{bot:function(c){return '📦 Pedido '+c.pedido+'\n\n✅ Recibido\n✅ Pago confirmado\n✅ Preparado\n✅ Despachado\n🟡 En camino\n⚪ Entregado\n\n👕 Jean Slim Fit Negro, talle 42\n📍 Destino: Catamarca capital\n⏱️ Llega hoy entre las 16 y las 18'},opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Necesito cambiar la dirección',n:'persona'}
  ],proc:['📦 Pedido localizado','🚚 Consultando logística','📍 Ubicación actualizada']},

  cambios:{bot:'🔄 Cómo funciona:\n\n✅ 30 días para cambiar, sin uso y con la etiqueta puesta\n✅ 15 días para devolución con reintegro completo\n❌ No se cambian: ropa interior ni artículos de liquidación\n\n¿Querés iniciar un cambio ahora?',opts:[
    {t:'Sí, quiero cambiar algo',n:'cam_num'},{t:'Solo quería saber',n:'gracias'}
  ]},
  cam_num:{bot:'¿Cuál es tu número de pedido?',input:{ph:'Ej: #P-5523…',ex:'#P-5523',k:'pedido',n:'cam_que'},
    proc:['🔍 Buscando pedido','📅 Verificando que esté dentro de los 30 días','✅ En plazo']},
  cam_que:{bot:'¿Qué querés cambiar?',opts:[
    {t:'El talle',n:'cam_nuevo',k:'cambio'},{t:'El modelo',n:'cam_nuevo',k:'cambio'},
    {t:'El color',n:'cam_nuevo',k:'cambio'},{t:'Quiero devolverlo',n:'cam_devolucion'}
  ]},
  cam_nuevo:{bot:function(c){return '¿Por cuál '+String(c.cambio).toLowerCase().replace('el ','')+' lo cambiamos?'},
    input:{ph:'Ej: talle 44…',ex:'Talle 44',k:'nuevo',n:'cam_como'}},
  cam_como:{bot:'¿Cómo lo hacemos?',opts:[
    {t:'🏪 Lo llevo al local',n:'cam_ok',k:'metodo'},
    {t:'🛵 Que lo retiren de mi casa',n:'cam_ok',k:'metodo'}
  ],proc:['📦 Verificando stock del producto nuevo','✅ Disponible']},
  cam_ok:{bot:function(c){return '✅ Cambio registrado\n\n📋 Cambio #CM-0341\n🔄 '+c.cambio+' → '+c.nuevo+'\n📦 '+c.metodo+'\n\nTe aviso por acá cuando esté listo. No pagás nada extra.'},opts:[
    {t:'Gracias 👍',n:'gracias'}
  ],proc:['📋 Registrando cambio #CM-0341','📦 Reservando el producto nuevo','🏷️ Generando etiqueta de devolución','📲 Notificando al depósito','📊 Actualizando stock']},
  cam_devolucion:{bot:'Sin problema. Si está dentro de los 15 días y sin uso, te devolvemos el 100%.\n\n💰 Por transferencia tarda 48 hs hábiles.\n💳 Si pagaste con tarjeta, el reintegro lo hace el banco y puede tardar hasta un resumen.\n\n¿Lo llevás al local o lo retiramos?',opts:[
    {t:'Lo llevo al local',n:'cam_ok',k:'metodo'},{t:'Que lo retiren',n:'cam_ok',k:'metodo'}
  ],proc:['💰 Verificando plazo de devolución','✅ Dentro de los 15 días']},

  dudas:{bot:'Dale, preguntame.',opts:[
    {t:'📏 ¿Qué talle soy?',n:'dudas_talles'},
    {t:'¿Cuánto tarda el envío?',n:'dudas_envio'},
    {t:'¿Qué medios de pago aceptan?',n:'dudas_pago'},
    {t:'¿Venden por mayor?',n:'dudas_mayorista'},
    {t:'¿Dónde queda el local?',n:'dudas_ubi'},
    {t:'Quiero hablar con una vendedora',n:'persona'}
  ]},
  dudas_talles:{bot:'📏 Guía de talles (cintura):\n\n👨 Hombre\n38: 80 cm · 40: 84 cm · 42: 88 cm · 44: 92 cm · 46: 96 cm\n\n👩 Mujer\n26: 64 cm · 28: 68 cm · 30: 72 cm · 32: 76 cm · 34: 80 cm\n\n💡 Si estás entre dos talles, llevá el más grande: el jean elastizado cede un poco con el uso.\n\nY si igual no acertás, lo cambiás dentro de los 30 días sin costo.',opts:[
    {t:'Ver productos',n:'p_cat'},{t:'Otra duda',n:'dudas'}
  ]},
  dudas_envio:{bot:'🚚 Envíos:\n\n• Catamarca capital: $2.500, llega en 24 hs\n• Interior de la provincia: $5.000, 2 a 3 días\n• Retiro en el local: gratis, listo en 2 horas\n\n📦 Envío gratis en compras de más de $80.000.',opts:[
    {t:'Ver productos',n:'p_cat'},{t:'Otra duda',n:'dudas'}
  ]},
  dudas_pago:{bot:'💳 Aceptamos:\n\n• Mercado Pago, hasta 6 cuotas sin interés\n• Todas las tarjetas de crédito y débito\n• Transferencia bancaria — **10% de descuento**\n• Efectivo en el local — 10% de descuento\n\nLa transferencia es la que más conviene y es la que más usa la gente.',opts:[
    {t:'Ver productos',n:'p_cat'},{t:'Otra duda',n:'dudas'}
  ]},
  dudas_mayorista:{bot:'Sí, desde 10 prendas surtidas.\n\n💰 Lista mayorista con 35% a 45% de descuento sobre el precio de vidriera\n🧾 Facturamos A\n📦 Enviamos a todo el país\n\nEso lo maneja directamente la dueña. ¿Te la paso?',opts:[
    {t:'Sí, pasámela',n:'persona'},{t:'Otra duda',n:'dudas'}
  ]},
  dudas_ubi:{bot:'📍 San Martín 720, Catamarca\n\n🕐 Lunes a sábado: 9:30 a 13 y 17 a 21\n🕐 Domingos: cerrado\n\n🅿️ Hay estacionamiento en la cuadra.',opts:[
    {t:'Ver productos',n:'p_cat'},{t:'Otra duda',n:'dudas'}
  ]},

  persona:{bot:'Dale, te paso con una vendedora. ¿Qué le adelanto?',
    input:{ph:'Tu consulta…',ex:'Quiero consultar por precio mayorista',k:'consulta',n:'persona_ok'}},
  persona_ok:{bot:'✅ Listo.\n\n📋 Consulta #V-0445\nTe escriben en breve. El local atiende de 9:30 a 13 y de 17 a 21.',opts:[
    {t:'Gracias 👍',n:'gracias'}
  ],proc:['📋 Ticket #V-0445 creado','🔔 Notificando al equipo de ventas']},

  gracias:{bot:'¡Gracias por elegirnos! 😊\n\n📍 San Martín 720, Catamarca\n📱 @alfisjeans\n\nCualquier cosa escribime, contesto siempre.',opts:[],end:true,
    proc:['📊 Conversación registrada en el panel','✅ Ninguna consulta quedó sin responder']}
},

/* ══════════════════════════════════════════════════════════════════
   6 · RESERVAS Y TURNOS — genérico, sirve para cualquier agenda
   El visitante elige primero qué tipo de agenda tiene (mesa, cancha,
   consultorio, estética) y a partir de ahí corre el MISMO motor con
   el vocabulario adaptado. Eso demuestra en vivo lo que la landing
   promete: un solo sistema para cualquier negocio que vive de la
   agenda. Lo que hay que mostrar sí o sí:
   · toma la reserva sola, sin que nadie intervenga
   · confirma en el momento y programa el recordatorio
   · cuando no hay lugar, ofrece lista de espera en vez de perder al cliente
   · cancelar y reprogramar también son automáticos
   ══════════════════════════════════════════════════════════════════ */
reservas:{
  start:{bot:'¡Hola! 👋 Esta demo es la del circuito de reservas, y funciona igual para cualquier negocio que viva de la agenda.\n\nElegí el tuyo y la probás con tu vocabulario:',opts:[
    {t:'🍽️ Restaurante — mesas',n:'r_menu',k:'tipo',v:'restaurante'},
    {t:'🎾 Cancha — pádel, fútbol, tenis',n:'r_menu',k:'tipo',v:'cancha'},
    {t:'🦷 Consultorio — salud u odontología',n:'r_menu',k:'tipo',v:'consultorio'},
    {t:'💆 Estética o peluquería',n:'r_menu',k:'tipo',v:'estética'}
  ],proc:['📡 Consulta entrante — WhatsApp','📅 Motor de reservas activo']},

  r_menu:{bot:function(c){
    var s = { restaurante:'¡Hola! Soy el asistente del salón 🍽️',
              cancha:'¡Hola! Soy el asistente del complejo 🎾',
              consultorio:'¡Hola! Soy el asistente del consultorio 🦷',
              'estética':'¡Hola! Soy el asistente del centro 💆' }[c.tipo];
    return s+'\nTomo reservas sola, a cualquier hora, sin que nadie del equipo tenga que estar mirando el teléfono.\n\n¿Qué necesitás?';
  },opts:[
    {t:'📅 Reservar',n:'r_servicio'},
    {t:'🔄 Cambiar o cancelar mi reserva',n:'g_num'},
    {t:'💰 Precios',n:'r_precios'},
    {t:'❓ Tengo una duda',n:'dudas'}
  ]},

  r_servicio:{bot:function(c){
    return { restaurante:'¿Para cuántas personas?',
             cancha:'¿Qué cancha querés?',
             consultorio:'¿Qué necesitás?',
             'estética':'¿Qué tratamiento te hacés?' }[c.tipo];
  },optsFn:function(c){
    return {
      restaurante:[{t:'2 personas',n:'r_dia',k:'servicio'},{t:'4 personas',n:'r_dia',k:'servicio'},
                   {t:'6 personas',n:'r_dia',k:'servicio'},{t:'Más de 8 (evento)',n:'r_grupo',k:'servicio'}],
      cancha:[{t:'Pádel — cristal',n:'r_dia',k:'servicio'},{t:'Pádel — cemento',n:'r_dia',k:'servicio'},
              {t:'Fútbol 5',n:'r_dia',k:'servicio'},{t:'Tenis — polvo de ladrillo',n:'r_dia',k:'servicio'}],
      consultorio:[{t:'Primera consulta',n:'r_dia',k:'servicio'},{t:'Control',n:'r_dia',k:'servicio'},
                   {t:'Limpieza / profilaxis',n:'r_dia',k:'servicio'},{t:'🚨 Urgencia (me duele)',n:'r_urgencia'}],
      'estética':[{t:'Limpieza facial',n:'r_dia',k:'servicio'},{t:'Depilación definitiva',n:'r_dia',k:'servicio'},
                  {t:'Masajes descontracturantes',n:'r_dia',k:'servicio'},{t:'Corte y color',n:'r_dia',k:'servicio'}]
    }[c.tipo];
  },proc:['📋 Cargando servicios del negocio','⏱️ Cada servicio con su duración real']},

  r_urgencia:{bot:'🚨 Las urgencias no esperan turno.\n\nTengo un hueco reservado hoy a las 18:30 justamente para esto, y otro mañana a primera hora.\n\n¿Cuál tomás?',opts:[
    {t:'Hoy 18:30',n:'dato_nombre',k:'hora',v:'hoy 18:30'},
    {t:'Mañana 08:00',n:'dato_nombre',k:'hora',v:'mañana 08:00'},
    {t:'Quiero hablar con alguien ya',n:'persona'}
  ],proc:['🚨 Urgencia detectada','🔓 Liberando hueco de guardia','🔔 Avisando al profesional']},

  r_grupo:{bot:'Para más de 8 personas manejamos el salón aparte, así te aseguramos el espacio.\n\n¿Para qué fecha sería?',
    input:{ph:'Ej: sábado 15 a las 21…',ex:'El sábado 15 a las 21',k:'fecha',n:'r_grupo_ok'},
    proc:['🎉 Derivando a reserva de evento']},
  r_grupo_ok:{bot:function(c){return 'Anotado: '+c.fecha+'.\n\nPara grupos grandes la reserva la confirma el encargado del salón, porque hay que armar la mesa y ver el menú. Te escribe hoy mismo.\n\n¿A qué nombre?'},
    input:{ph:'Tu nombre…',ex:'Marcela Ríos',k:'nombre',n:'rg_tel'},
    proc:['📋 Reserva de evento pre-cargada','🔔 Notificando al encargado de salón','⚠️ Requiere confirmación humana: el sistema lo dice y deriva']},

  /* El evento queda PEDIDO, no confirmado: lo cierra una persona. El
     sistema lo dice en vez de fingir que ya está resuelto. */
  rg_tel:{bot:'¿Y un teléfono?',input:{ph:'Tu teléfono…',ex:'3834-556677',k:'tel',n:'rg_cierre'},
    proc:['👤 Creando ficha de cliente en el panel']},
  rg_cierre:{bot:function(c){return '📋 Pedido de evento registrado\n\n📋 Solicitud #E-0207\n🎉 '+c.fecha+'\n👥 '+(c.servicio||'Más de 8 personas')+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n⚠️ Todavía **no está confirmado**: los eventos los cierra el encargado del salón, porque hay que ver la mesa y el menú con vos. Te escribe hoy.\n\nLo que sí hice fue dejarle todo cargado, así cuando te llame ya sabe qué necesitás y no tenés que contar la historia de nuevo.'},opts:[
    {t:'Perfecto, gracias 👍',n:'gracias'},
    {t:'Mientras tanto, reservar una mesa normal',n:'r_servicio'}
  ],proc:['📋 Solicitud #E-0207 registrada','⚠️ Estado: PENDIENTE de confirmación humana','🔔 Notificando al encargado de salón','📄 Adjuntando historial completo de la charla','📊 Visible en el panel del dueño']},

  r_dia:{bot:'¿Qué día?',opts:[
    {t:'Hoy',n:'r_hora',k:'dia'},{t:'Mañana',n:'r_hora',k:'dia'},
    {t:'El viernes',n:'r_lleno',k:'dia'},{t:'El sábado',n:'r_hora',k:'dia'},
    {t:'Otro día',n:'r_dia_otro'}
  ],proc:['📅 Consultando la agenda en tiempo real']},

  r_dia_otro:{bot:'¿Qué día te sirve?',input:{ph:'Ej: el martes 12…',ex:'El martes 12',k:'dia',n:'r_hora'}},

  r_hora:{bot:function(c){return '📅 '+String(c.dia).charAt(0).toUpperCase()+String(c.dia).slice(1)+' tengo estos horarios libres:'},
    optsFn:function(c){
      return c.tipo === 'restaurante'
        ? [{t:'20:00',n:'dato_nombre',k:'hora'},{t:'21:00',n:'dato_nombre',k:'hora'},
           {t:'22:00',n:'dato_nombre',k:'hora'},{t:'22:30',n:'dato_nombre',k:'hora'}]
        : [{t:'09:00',n:'dato_nombre',k:'hora'},{t:'11:30',n:'dato_nombre',k:'hora'},
           {t:'16:00',n:'dato_nombre',k:'hora'},{t:'19:30',n:'dato_nombre',k:'hora'}];
    },
    proc:['📅 Leyendo huecos reales de la agenda','⏱️ Descontando duración del servicio','✅ 4 horarios disponibles']},

  /* ── El día lleno: en vez de perder al cliente, lista de espera ── */
  r_lleno:{bot:function(c){return '😕 El viernes lo tengo completo, no te voy a mentir.\n\nPero dos cosas:\n\n1️⃣ El jueves y el sábado tengo lugar en el mismo horario.\n2️⃣ Si el viernes es sí o sí, te anoto en la lista de espera. Cuando alguien cancela, el sistema te escribe automáticamente y el primero que contesta se queda con el lugar. La semana pasada se liberaron 3.\n\n¿Qué preferís?'},opts:[
    {t:'Dale, el jueves',n:'r_hora',k:'dia',v:'jueves'},
    {t:'Dale, el sábado',n:'r_hora',k:'dia',v:'sábado'},
    {t:'Anotame en lista de espera del viernes',n:'r_espera'}
  ],proc:['📅 Viernes sin disponibilidad','🧭 Ofreciendo alternativas antes de perder la reserva','📋 Lista de espera disponible']},

  /* Ojo: la lista de espera NO es una reserva y no puede cerrarse como si
     lo fuera. Tiene su propio circuito de datos y su propia confirmación,
     que dice con todas las letras que el lugar todavía no está. */
  r_espera:{bot:'Perfecto, te anoto. ¿A qué nombre?',
    input:{ph:'Tu nombre…',ex:'Marcela Ríos',k:'nombre',n:'r_espera_tel'},
    proc:['📋 Sumando a lista de espera del viernes','🔔 Alerta automática ante cancelación','⚡ Aviso al primero de la fila, sin intervención humana']},

  r_espera_tel:{bot:'¿Y un teléfono para avisarte apenas se libere?',
    input:{ph:'Tu teléfono…',ex:'3834-556677',k:'tel',n:'r_espera_ok'},
    proc:['👤 Creando ficha de cliente en el panel']},

  r_espera_ok:{bot:function(c){return '📋 Estás en la lista de espera\n\n⚠️ Ojo: esto **no es una reserva todavía**. El viernes sigue completo y no te voy a decir que tenés lugar cuando no lo tenés.\n\n📌 '+(c.servicio||'Turno')+'\n📅 '+(c.dia||'')+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n🔢 Sos el 2° de la fila\n\nApenas alguien cancele te escribo al instante, y el primero que conteste se queda con el lugar.\n\n¿Querés que además te deje una reserva firme el jueves o el sábado, por las dudas? La cancelás sin costo si se libera el viernes.'},opts:[
    {t:'Dale, dejame el jueves también',n:'r_hora',k:'dia',v:'jueves'},
    {t:'Dale, el sábado',n:'r_hora',k:'dia',v:'sábado'},
    {t:'No, espero el viernes',n:'gracias'}
  ],proc:['📋 Anotado en lista de espera — posición 2','⚠️ NO se confirma como reserva: no hay lugar','🔔 Alerta automática ante cancelación','💡 Ofreciendo alternativa firme para no perder al cliente']},

  /* ── DATOS Y CONFIRMACIÓN AUTOMÁTICA ────────────────── */
  dato_nombre:{bot:'¿A qué nombre?',input:{ph:'Tu nombre…',ex:'Marcela Ríos',k:'nombre',n:'dato_tel'}},
  dato_tel:{bot:'¿Y un teléfono para el recordatorio?',input:{ph:'Tu teléfono…',ex:'3834-556677',k:'tel',n:'r_cierre'},
    proc:['👤 Creando ficha de cliente en el panel']},

  r_cierre:{bot:function(c){
    var extra = { restaurante:'🍽️ Te guardo la mesa 15 minutos pasada la hora.',
                  cancha:'🎾 Llevá tu paleta o alquilás en el mostrador ($8.000).',
                  consultorio:'🦷 Vení 10 minutos antes con tu credencial de obra social.',
                  'estética':'💆 Vení sin maquillaje y con el pelo suelto.' }[c.tipo] || '';
    return '✅ **Reserva confirmada**\n\n📋 Reserva #R-1042\n📌 '+(c.servicio||'Turno')+'\n📅 '+(c.dia||'')+' '+(c.hora||'')+'\n👤 '+c.nombre+'\n📱 '+c.tel+'\n\n'+extra+'\n📲 Te mando el recordatorio 24 hs antes y otro 2 hs antes.\n🔄 ¿Te surge algo? Escribime "cancelar" y lo resolvemos al toque, sin llamar a nadie.\n\nY lo importante: esto lo tomé yo sola, sin que nadie del equipo tuviera que dejar lo que estaba haciendo.';
  },opts:[
    {t:'Perfecto, gracias 👍',n:'gracias'},
    {t:'Quiero reservar otra cosa',n:'r_servicio'}
  ],proc:['📋 Registrando reserva #R-1042','🔒 Bloqueando el horario en la agenda','📲 Programando recordatorio 24 h antes','📲 Programando recordatorio 2 h antes','🔔 Notificando al equipo','📊 Reserva visible en el panel del dueño','✅ Cero intervención humana en todo el circuito']},

  /* ── GESTIONAR RESERVA EXISTENTE ────────────────────── */
  g_num:{bot:'Dale, sin problema. ¿Cuál es tu número de reserva? Si no lo tenés, pasame tu nombre.',
    input:{ph:'Ej: #R-1042 o tu nombre…',ex:'#R-1042',k:'reserva',n:'g_que'},
    proc:['🔍 Buscando reserva en la agenda']},
  g_que:{bot:function(c){return '✅ La encontré:\n\n📋 '+c.reserva+'\n📅 Sábado 21:00 — mesa para 4\n\n¿Qué querés hacer?'},opts:[
    {t:'📅 Cambiarla de día u hora',n:'r_dia'},
    {t:'❌ Cancelarla',n:'g_cancelar'},
    {t:'👥 Cambiar la cantidad de personas',n:'r_servicio'}
  ],proc:['✅ Reserva localizada','📋 Cargando detalle']},
  g_cancelar:{bot:'Listo, cancelada. Sin vueltas y sin que tengas que llamar a nadie 👍\n\n📋 Reserva #R-1042 — CANCELADA\n\nEl horario ya volvió a la agenda y el sistema le está avisando a la primera persona de la lista de espera. Así el hueco no queda vacío.\n\nCuando quieras volver, escribime.',opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Quiero reservar otro día',n:'r_dia'}
  ],proc:['❌ Reserva #R-1042 cancelada','🔓 Horario liberado en la agenda','⚡ Avisando a la lista de espera automáticamente','📊 Cancelación registrada en el panel','💡 El hueco se vuelve a vender solo']},

  r_precios:{bot:function(c){
    return {
      restaurante:'💰 No cobramos por reservar la mesa.\n\n🍽️ Cubierto: $3.500 por persona\n🍷 Menú del día: $28.000\n🎉 Para grupos de más de 10 pedimos una seña de $30.000 que se descuenta del total.',
      cancha:'💰 Precios por turno de 90 minutos:\n\n🎾 Pádel cristal: $32.000\n🎾 Pádel cemento: $26.000\n⚽ Fútbol 5: $45.000\n🎾 Tenis: $22.000\n\n🌙 Con luz artificial se suman $6.000.\n🏓 Alquiler de paletas: $8.000.',
      consultorio:'💰 Aranceles:\n\n🦷 Primera consulta: $28.000 (sin cargo con obra social)\n🦷 Control: $18.000\n🦷 Limpieza: $45.000\n\n⚕️ Trabajamos con OSDE, Swiss Medical, Galeno y PAMI.\n💳 Los tratamientos se pueden financiar en 3 y 6 cuotas.',
      'estética':'💰 Precios:\n\n💆 Limpieza facial: $42.000\n✨ Depilación definitiva (sesión): $38.000\n💆 Masaje descontracturante: $35.000\n💇 Corte y color: desde $55.000\n\n🎁 Los paquetes de 6 sesiones tienen 20% off.'
    }[c.tipo];
  },opts:[
    {t:'Dale, quiero reservar',n:'r_servicio'},{t:'Otra duda',n:'dudas'}
  ],proc:['💰 Consultando lista de precios vigente']},

  /* ── DUDAS ──────────────────────────────────────────── */
  dudas:{bot:'Dale, preguntame.',opts:[
    {t:'¿Piden seña?',n:'dudas_sena'},
    {t:'¿Hasta cuándo puedo cancelar?',n:'dudas_cancelar'},
    {t:'¿Cómo me acuerdo del turno?',n:'dudas_recordatorio'},
    {t:'¿Y si no hay lugar el día que quiero?',n:'dudas_espera'},
    {t:'¿Dónde queda y hay estacionamiento?',n:'dudas_ubi'},
    {t:'Quiero hablar con una persona',n:'persona'}
  ]},
  dudas_sena:{bot:'Depende del caso:\n\n✅ Reservas normales: sin seña, alcanza con tu palabra\n💰 Grupos grandes o eventos: seña que se descuenta del total\n💰 Tratamientos largos: se puede señar para asegurar el cupo\n\nSi hace falta seña, el sistema te manda el link de pago acá mismo y la reserva queda confirmada apenas se acredita.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Reservar',n:'r_servicio'}
  ]},
  dudas_cancelar:{bot:'Hasta 4 horas antes, sin costo y sin llamar a nadie: me escribís "cancelar" por acá y listo.\n\n🔄 Si cancelás con menos de 4 horas, no pasa nada la primera vez, pero el lugar ya es difícil de volver a vender.\n\nEse es justo el punto: cuando cancelás, el horario vuelve a la agenda y el sistema le avisa solo a la lista de espera. El hueco no queda vacío.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Reservar',n:'r_servicio'}
  ]},
  dudas_recordatorio:{bot:'No te tenés que acordar vos, de eso me encargo yo 🙂\n\n📲 Un recordatorio 24 horas antes\n📲 Otro 2 horas antes\n✅ Con un botón para confirmar o reprogramar en el momento\n\nEso solo baja muchísimo la cantidad de gente que no aparece, que es la plata que más silenciosamente se pierde en un negocio de agenda.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Reservar',n:'r_servicio'}
  ]},
  dudas_espera:{bot:'Te anoto en la lista de espera y ahí empieza a trabajar solo:\n\n1️⃣ Alguien cancela\n2️⃣ El sistema le escribe al instante al primero de la lista\n3️⃣ El primero que contesta se queda con el lugar\n\nNadie del equipo tiene que hacer nada, y el horario no queda vacío. Un turno vacío es plata que no vuelve nunca.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Reservar',n:'r_servicio'}
  ]},
  dudas_ubi:{bot:'📍 Catamarca capital\n🕐 Los horarios reales de tu negocio se cargan cuando armamos el sistema\n🅿️ Estacionamiento en la puerta\n\nEn tu sistema esto sale con tu dirección, tus horarios y tu forma de hablar. Esta demo es genérica a propósito, para que veas el circuito.',opts:[
    {t:'Otra duda',n:'dudas'},{t:'Reservar',n:'r_servicio'}
  ]},

  persona:{bot:'Dale, te paso con alguien del equipo. ¿Qué le adelanto?',
    input:{ph:'Tu consulta…',ex:'Quiero preguntar por un evento para 30 personas',k:'consulta',n:'persona_ok'}},
  persona_ok:{bot:'✅ Listo.\n\n📋 Consulta #T-0290\nTe responden a la brevedad. Mientras tanto, la reserva podés hacerla igual por acá.',opts:[
    {t:'Gracias 👍',n:'gracias'},{t:'Reservar igual',n:'r_servicio'}
  ],proc:['📋 Ticket #T-0290 creado','🔔 Notificando al equipo','📄 Adjuntando historial de la charla']},

  gracias:{bot:'¡Gracias! 🙌\n\nAcordate de lo que acaba de pasar: reservaste, te confirmé y te programé los recordatorios, y nadie del negocio tuvo que dejar lo que estaba haciendo.\n\nEso funciona igual a las 3 de la tarde que a las 2 de la mañana.',opts:[],end:true,
    proc:['📊 Conversación registrada en el panel','✅ Ninguna reserva quedó sin tomar']}
}

};
