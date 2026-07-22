/* ══════════════════════════════════════════════════════════════════
   DEMO — MOTOR
   Recorre los árboles de demo-flows.js y los actúa en un WhatsApp
   simulado: escribe, manda fotos, ofrece respuestas rápidas y va
   mostrando en el panel lateral lo que el sistema hace por detrás.

   Las "fotos" se dibujan con SVG en vez de traer imágenes de afuera.
   Motivo: el sitio se publica como directorio estático y una imagen
   externa rota arruina la demo justo en el momento en que el
   visitante está evaluando si confía. Dibujado nunca falla.
   ══════════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* TODO: mismo placeholder que el `wa` de index.html — reemplazar los dos juntos */
var WA = 'https://wa.me/54XXXXXXXXXX?text=' +
  encodeURIComponent('Hola, probé la demo y quiero este sistema para mi negocio.');

var RUBROS = window.DEMO_RUBROS || [];
var FLOWS  = window.DEMO_FLOWS  || {};

/* ══ Ilustraciones ═══════════════════════════════════════════════
   Line-art sobre duotono. Cada rubro tiene su color para que las
   fichas se lean como un catálogo propio y no como clip-art suelto. */
var GLIFOS = {
  casa:   '<path d="M3 11.5 12 4l9 7.5V21H3z"/><path d="M9.5 21v-6h5v6"/>',
  depto:  '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  lote:   '<path d="M3 8h18v12H3z" stroke-dasharray="3 2.5"/><path d="M8 20v-4M8 16c-1.6 0-2.5-1-2.5-2.3S6.4 11 8 11s2.5 1 2.5 2.7S9.6 16 8 16Z"/><path d="M3 8l3-3h12l3 3"/>',
  local:  '<path d="M4 9h16v12H4z"/><path d="M3 9l2-5h14l2 5"/><path d="M9.5 21v-7h5v7"/>',
  auto:   '<path d="M3 15h18v3H3z"/><path d="M5.5 15l2-5h9l2 5"/><circle cx="7.5" cy="18.5" r="1.8"/><circle cx="16.5" cy="18.5" r="1.8"/>',
  suv:    '<path d="M3 14h18v4H3z"/><path d="M5 14l1.5-6h11L19 14"/><path d="M9 8v6M15 8v6"/><circle cx="7.5" cy="18.5" r="1.8"/><circle cx="16.5" cy="18.5" r="1.8"/>',
  pickup: '<path d="M3 15h18v3H3z"/><path d="M4.5 15l1.5-5h6v5"/><path d="M12 11h9v4"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
  cemento:'<path d="M7 5h10l1.5 15H5.5z"/><path d="M8.5 5c0-1 1.5-1.6 3.5-1.6S15.5 4 15.5 5"/><path d="M9 11h6"/>',
  ladrillo:'<path d="M3 7h18v4H3zM3 13h18v4H3z"/><path d="M9 7v4M15 7v4M6 13v4M12 13v4M18 13v4"/>',
  arena:  '<path d="M2 19h20L12 6z"/><path d="M7.5 19l4.5-6 4.5 6"/>',
  freno:  '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>',
  bateria:'<rect x="3" y="8" width="18" height="10" rx="1.5"/><path d="M7 8V6h3v2M14 8V6h3v2"/><path d="M8 13h3M15.5 11.5v3M14 13h3"/>',
  kitmoto:'<circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  casco:  '<path d="M4 15a8 8 0 0 1 16 0v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4.5 13.5h9a3 3 0 0 0 3-3"/>',
  aceite: '<path d="M12 3.5c3 4.2 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-5.8 5.5-10Z"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5"/>',
  jean:   '<path d="M7 3h10l1 18h-4.5L12 11l-1.5 10H6z"/><path d="M7 7h10"/>',
  remera: '<path d="M8 4 4 6.5 6 10l2-1v11h8V9l2 1 2-3.5L16 4z"/><path d="M9.5 4a2.5 2.5 0 0 0 5 0"/>',
  campera:'<path d="M8 4 4 7l1.5 4L7 10v11h10V10l1.5 1L20 7l-4-3z"/><path d="M12 4v17"/>',
  zapatilla:'<path d="M3 17c0-2 .5-4 .5-6H7l2.5 2.5L14 15l6 1.5c1 .3 1.5 1 1.5 2v1.5H3z"/><path d="M7 11v3"/>'
};
var PALETA = {
  casa:'#1e6f5c',depto:'#1e6f5c',lote:'#1e6f5c',local:'#1e6f5c',
  auto:'#1d3557',suv:'#1d3557',pickup:'#1d3557',
  cemento:'#8a4b1f',ladrillo:'#8a4b1f',arena:'#8a4b1f',
  freno:'#3f4a54',bateria:'#3f4a54',kitmoto:'#3f4a54',casco:'#3f4a54',aceite:'#3f4a54',
  jean:'#6d3b8e',remera:'#6d3b8e',campera:'#6d3b8e',zapatilla:'#6d3b8e'
};

/* ══ Utilidades ══════════════════════════════════════════════════ */
var $ = function(id){ return document.getElementById(id) };
function esperar(ms){ return new Promise(function(r){ setTimeout(r,ms) }) }
function escapar(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
/* **negrita** → <strong>. Los saltos de línea los resuelve el CSS. */
function formato(s){ return escapar(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>') }
/* Quita el emoji del principio para que el valor guardado se lea bien
   cuando se interpola en otro mensaje ("🏠 Casa" → "Casa"). */
function sinEmoji(s){ return String(s).replace(/^[^\p{L}\p{N}$]+/u,'').trim() }
function resolver(v,c){ return typeof v === 'function' ? v(c) : v }
function ahora(){
  return new Date().toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit',hour12:false});
}

/* ══ Estado ══════════════════════════════════════════════════════ */
var S = { rubro:null, flow:null, ctx:{}, gen:0 };

/* ══ Pintado del chat ════════════════════════════════════════════ */
function scroll(){ var c = $('demo-chat'); c.scrollTop = c.scrollHeight }
/* Los controles (opciones o campo de texto) le roban alto al chat cuando
   aparecen, así que hay que volver a bajar una vez que el layout se acomodó.
   Si no, el último globo queda cortado justo cuando hay que leerlo. */
function scrollTrasLayout(){ requestAnimationFrame(function(){ requestAnimationFrame(scroll) }) }

function burbujaHTML(clase, html){
  var d = document.createElement('div');
  d.className = 'wa-msg ' + clase;
  d.innerHTML = html + '<span class="wa-hora">' + ahora() + (clase==='user' ? ' ✓✓' : '') + '</span>';
  $('demo-chat').appendChild(d);
  scroll();
  return d;
}
function pintarUser(t){ burbujaHTML('user', formato(t)) }

function typingOn(){
  var d = document.createElement('div');
  d.className = 'wa-typing'; d.id = 'wa-typing';
  d.innerHTML = '<i></i><i></i><i></i>';
  $('demo-chat').appendChild(d); scroll();
}
function typingOff(){ var t = $('wa-typing'); if(t) t.remove() }

/* Un globo del bot: escribe, espera proporcional al largo, aparece. */
async function burbuja(txt, mi){
  var t = resolver(txt, S.ctx);
  typingOn();
  await esperar(Math.min(1500, 420 + String(t).length * 6));
  if(mi !== S.gen){ typingOff(); return false }
  typingOff();
  burbujaHTML('bot', formato(t));
  return true;
}

function pintarCard(c){
  var color = PALETA[c.k] || '#0066FF';
  var glifo = GLIFOS[c.k] || GLIFOS.casa;
  var d = document.createElement('div');
  d.className = 'wa-card';
  d.innerHTML =
    '<div class="wa-card-img" style="background:linear-gradient(145deg,' + color + ',' +
      color + '22)">' +
      (c.b ? '<span class="wa-card-badge">' + escapar(c.b) + '</span>' : '') +
      '<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="1.3" ' +
        'stroke-linecap="round" stroke-linejoin="round">' + glifo + '</svg>' +
    '</div>' +
    '<div class="wa-card-body">' +
      '<h5>' + escapar(c.t) + '</h5>' +
      (c.s ? '<p>' + escapar(c.s) + '</p>' : '') +
      (c.p ? '<div class="wa-card-precio">' + escapar(c.p) + '</div>' : '') +
    '</div>';
  $('demo-chat').appendChild(d);
  scroll();
}

/* ══ Panel de procesos ═══════════════════════════════════════════ */
function pintarProc(lineas){
  var log = $('demo-proc-log');
  var vacio = log.querySelector('.demo-proc-vacio');
  if(vacio) vacio.remove();
  log.querySelectorAll('.proc-linea.nuevo').forEach(function(e){ e.classList.remove('nuevo') });
  lineas.forEach(function(l, i){
    setTimeout(function(){
      var d = document.createElement('div');
      d.className = 'proc-linea nuevo';
      d.textContent = l;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    }, i * 190);
  });
}

/* ══ Controles ═══════════════════════════════════════════════════ */
function ocultarControles(){
  $('demo-opts').innerHTML = '';
  $('demo-input').classList.remove('visible');
  $('demo-ej').innerHTML = '';
  $('demo-cta').style.display = 'none';
}

function mostrarOpts(opts){
  var cont = $('demo-opts');
  cont.innerHTML = '';
  opts.forEach(function(o){
    var b = document.createElement('button');
    b.className = 'wa-opt';
    b.textContent = o.t;
    b.onclick = function(){
      pintarUser(o.t);
      if(o.k) S.ctx[o.k] = (o.v !== undefined) ? o.v : sinEmoji(o.t);
      ir(o.n);
    };
    cont.appendChild(b);
  });
  scrollTrasLayout();
}

function mostrarInput(cfg){
  var wrap = $('demo-input'), campo = $('demo-campo');
  wrap.classList.add('visible');
  campo.value = '';
  campo.placeholder = cfg.ph || 'Escribí tu mensaje…';
  campo.focus();

  if(cfg.ex){
    $('demo-ej').innerHTML = 'Ej: <button type="button">' + escapar(cfg.ex) + '</button>';
    $('demo-ej').querySelector('button').onclick = function(){ campo.value = cfg.ex; campo.focus() };
  }

  function enviar(){
    var v = campo.value.trim();
    if(!v) return;
    pintarUser(v);
    if(cfg.k) S.ctx[cfg.k] = v;
    ir(cfg.n);
  }
  $('demo-send').onclick = enviar;
  campo.onkeydown = function(e){ if(e.key === 'Enter'){ e.preventDefault(); enviar() } };
  scrollTrasLayout();
}

function mostrarCTA(){ $('demo-cta').style.display = 'block' }

/* ══ Recorrido del árbol ═════════════════════════════════════════ */
async function ir(nombre){
  var mi = ++S.gen;
  var n = S.flow[nombre];
  if(!n) return;

  ocultarControles();
  if(n.proc) pintarProc(n.proc);

  if(n.bot && !await burbuja(n.bot, mi)) return;

  var cards = n.cards || (n.card ? [n.card] : null);
  if(cards){
    await esperar(420);
    if(mi !== S.gen) return;
    cards.forEach(function(c){ pintarCard(resolver(c, S.ctx)) });
  }

  if(n.bots){
    for(var i = 0; i < n.bots.length; i++){
      if(!await burbuja(n.bots[i], mi)) return;
    }
  }
  if(mi !== S.gen) return;

  var opts = n.optsFn ? n.optsFn(S.ctx) : n.opts;
  if(n.input)                    mostrarInput(n.input);
  else if(opts && opts.length)   mostrarOpts(opts);
  if(n.end)                      mostrarCTA();
}

/* ══ Selección de rubro ══════════════════════════════════════════ */
function elegirRubro(id){
  var r = RUBROS.filter(function(x){ return x.id === id })[0];
  if(!r || !FLOWS[id]) return;

  S.rubro = r;
  S.flow  = FLOWS[id];
  S.ctx   = {};
  S.gen++;

  $('demo-selector').style.display = 'none';
  $('demo-stage').classList.add('visible');
  $('demo-volver').style.display = '';
  $('demo-contexto').textContent = r.titulo + ' — ' + r.negocio;

  var av = $('demo-av');
  av.textContent = r.inicial;
  av.style.background = r.color;
  $('demo-nombre').textContent = r.negocio;

  $('demo-chat').innerHTML = '';
  $('demo-proc-log').innerHTML =
    '<p class="demo-proc-vacio">Acá vas a ver lo que el sistema hace por detrás mientras te atiende: ' +
    'consultar stock, bloquear la agenda, descontar inventario, avisarle al vendedor.<br><br>' +
    'Eso es lo que separa un sistema de un bot suelto.</p>';

  ir('start');
}

function volverAlSelector(){
  S.gen++;
  $('demo-stage').classList.remove('visible');
  $('demo-selector').style.display = '';
  $('demo-volver').style.display = 'none';
  $('demo-contexto').textContent = 'Elegí tu rubro';
  ocultarControles();
}

/* ══ Overlay ═════════════════════════════════════════════════════ */
function abrir(){
  $('demo-modal').classList.add('abierto');
  $('demo-modal').setAttribute('aria-hidden','false');
  document.body.classList.add('demo-abierta');
}
function cerrar(){
  S.gen++;
  $('demo-modal').classList.remove('abierto');
  $('demo-modal').setAttribute('aria-hidden','true');
  document.body.classList.remove('demo-abierta');
}

/* ══ Arranque ════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function(){

  // Tarjetas del selector, generadas desde DEMO_RUBROS
  var grid = $('demo-grid');
  RUBROS.forEach(function(r){
    var b = document.createElement('button');
    b.className = 'demo-card';
    b.innerHTML =
      '<span class="demo-card-tag ' + r.circuito + '">' + r.circuito + '</span>' +
      '<span class="demo-card-ico">' + r.icon + '</span>' +
      '<h3>' + r.titulo + '</h3>' +
      '<p>' + r.sub + '</p>';
    b.onclick = function(){ elegirRubro(r.id) };
    grid.appendChild(b);
  });

  document.querySelectorAll('[data-abrir-demo]').forEach(function(el){
    el.addEventListener('click', function(e){ e.preventDefault(); abrir() });
  });
  $('demo-cerrar').onclick = cerrar;
  $('demo-volver').onclick = volverAlSelector;
  $('demo-cta-link').href = WA;

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && $('demo-modal').classList.contains('abierto')) cerrar();
  });
});

})();
