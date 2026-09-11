
const WHATSAPP_NUMERO = "5493734525075";
const LS_KEY = "primax_productos_v2";

const productosDefault = [
  {id:1, nombre:"Samsung Galaxy A54 128GB Liberado", categoria:"celulares", medidas:"6.4'' AMOLED - 8GB RAM - 50MP - 5000mAh", precio:345000, stock:8, img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600", mp_link:""},
  {id:2, nombre:"Motorola Moto G84 256GB", categoria:"celulares", medidas:"6.55'' pOLED - 12GB RAM", precio:299000, stock:12, img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600", mp_link:""},
  {id:3, nombre:"Horno Eléctrico 45L Grill", categoria:"electro", medidas:"2000W - Convección - Timer 60min", precio:89000, stock:15, img:"https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600", mp_link:""},
  {id:4, nombre:"Freidora de Aire 6.5L Digital", categoria:"electro", medidas:"1500W - Sin aceite", precio:125000, stock:10, img:"https://images.unsplash.com/photo-1585237672814-8c0a6e4d013a?q=80&w=600", mp_link:""},
  {id:5, nombre:"Rack TV 180cm Roble", categoria:"muebles", medidas:"180x45x60 - Melamina 18mm", precio:159000, stock:4, img:"https://images.unsplash.com/photo-1532372320572-cda25653a694?q=80&w=600", mp_link:""},
  {id:6, nombre:"Placard 3 Puertas 180cm", categoria:"muebles", medidas:"180x60x200 - Interior completo", precio:310000, stock:2, img:"https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=600", mp_link:""},
  {id:7, nombre:"Sommier 2 Plazas + Respaldo", categoria:"muebles", medidas:"140x190 - Resortes - 2 almohadas", precio:235000, stock:6, img:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600", mp_link:""},
  {id:8, nombre:"Set Ollas Antiadherentes 10 pzas", categoria:"hogar", medidas:"Granito - Apta inducción", precio:75000, stock:20, img:"https://images.unsplash.com/photo-1585515656151-8fe2cf2146ba?q=80&w=600", mp_link:""},
];

function getProductos(){
  try{
    const saved = localStorage.getItem(LS_KEY);
    if(saved){ return JSON.parse(saved); }
  }catch(e){}
  return productosDefault;
}

let productos = getProductos();
let carrito = [];
let filtroActual = 'todos';

function renderProductos(){
  const grid = document.getElementById('grid-productos');
  const filtrados = filtroActual === 'todos' ? productos : productos.filter(p => p.categoria === filtroActual);
  grid.innerHTML = filtrados.map(p => `
    <div class="card">
      <div class="badge-cat">${p.categoria}</div>
      <img src="${p.img}" alt="${p.nombre}">
      <div class="card-body">
        <h3>${p.nombre}</h3>
        <div class="medidas">${p.medidas}</div>
        <span class="stock">● Stock: ${p.stock} disp. - Entrega 48hs</span>
        <div class="precio">$${p.precio.toLocaleString('es-AR')}</div>
        <div class="cuotas">12 cuotas de $${Math.round(p.precio/12).toLocaleString('es-AR')}</div>
        <div class="btns">
          <button class="btn-card btn-cart" onclick="agregarAlCarrito(${p.id})">Agregar</button>
          <a class="btn-card btn-mp" href="${p.mp_link || 'https://wa.me/'+WHATSAPP_NUMERO+'?text=Hola! Me interesa '+encodeURIComponent(p.nombre)}" target="_blank">Comprar</a>
        </div>
      </div>
    </div>
  `).join('') || '<p style="grid-column:1/-1; text-align:center; padding:40px; background:#fff; border-radius:12px">No hay productos en esta categoría. Agregá desde el panel Admin.</p>';
}

function filtrar(cat){
  filtroActual = cat;
  document.querySelectorAll('.filtro').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`[data-cat='${cat}']`);
  if(btn) btn.classList.add('active');
  renderProductos();
}

function agregarAlCarrito(id){
  const prod = productos.find(p => p.id == id);
  carrito.push(prod);
  actualizarCarrito();
  abrirCarrito();
}

function actualizarCarrito(){
  const countEl = document.getElementById('cart-count');
  if(countEl) countEl.innerText = carrito.length;
  const total = carrito.reduce((s,p)=> s+p.precio, 0);
  document.getElementById('carrito-total').innerText = total.toLocaleString('es-AR');
  document.getElementById('carrito-items').innerHTML = carrito.map((p,i)=>`
    <div class="item-carrito">
      <img src="${p.img}"><div><b>${p.nombre}</b><br>$${p.precio.toLocaleString('es-AR')} <br><small style="cursor:pointer;color:red" onclick="carrito.splice(${i},1); actualizarCarrito()">Quitar</small></div>
    </div>
  `).join('') || '<p style="padding:20px">Tu carrito está vacío</p>';

  let mensaje = `Hola Pri-Max Hogar!%0AQuiero comprar:%0A`;
  carrito.forEach(p=> mensaje += `- ${p.nombre} $${p.precio.toLocaleString('es-AR')}%0A`);
  mensaje += `%0ATotal: $${total.toLocaleString('es-AR')}%0A%0AMi zona es: (escribí tu barrio)%0A`;
  document.getElementById('btn-finalizar-wsp').href = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensaje}`;
}

function abrirCarrito(){ document.getElementById('carrito').classList.add('open'); }
function cerrarCarrito(){ document.getElementById('carrito').classList.remove('open'); }

// Recargar si hay cambios en admin en otra pestaña
window.addEventListener('storage', ()=>{ productos = getProductos(); renderProductos(); });

renderProductos();
