
const defaultProductos=[
{id:1,nombre:"FREIDORA DE AIRE 6.5L DIGITAL",categoria:"electro",medidas:"1500W - Sin aceite",precio:125000,stock:10,mp_link:"",img:"https://http2.mlstatic.com/D_NQ_NP_2X_648439-MLA74783043681_022024-F.webp",imagenes:["https://http2.mlstatic.com/D_NQ_NP_2X_648439-MLA74783043681_022024-F.webp","https://http2.mlstatic.com/D_NQ_NP_2X_648440-MLA74783043682_022024-F.webp"]},
{id:2,nombre:"RACK TV 180CM ROBLE",categoria:"muebles",medidas:"180x45x60 - Melamina 18mm",precio:159000,stock:4,mp_link:"",img:"https://http2.mlstatic.com/D_NQ_NP_2X_912230-MLA71782870452_092023-F.webp",imagenes:["https://http2.mlstatic.com/D_NQ_NP_2X_912230-MLA71782870452_092023-F.webp"]},
{id:3,nombre:"SET OLLAS ANTIADHERENTES 10 PZAS",categoria:"bazar",medidas:"Granito - Apta inducción",precio:75000,stock:20,mp_link:"",img:"https://http2.mlstatic.com/D_NQ_NP_2X_758186-MLA53983041122_022023-F.webp",imagenes:["https://http2.mlstatic.com/D_NQ_NP_2X_758186-MLA53983041122_022023-F.webp"]}
];

function getProductos(){let p=localStorage.getItem('primax_productos');if(p){try{return JSON.parse(p)}catch(e){}}return defaultProductos;}
function saveProductos(p){localStorage.setItem('primax_productos',JSON.stringify(p));}

let carrito=JSON.parse(localStorage.getItem('primax_carrito')||'[]');

function renderProductos(filtro='todos'){
  const cont=document.getElementById('grid-productos');
  let productos=getProductos();
  if(filtro!=='todos') productos=productos.filter(p=>p.categoria===filtro);
  cont.innerHTML=productos.map(p=>`
    <div class="card">
      <div class="badge-cat">${p.categoria}</div>
      ${p.imagenes && p.imagenes.length>1 ? `<div class="card-img-count">📸 ${p.imagenes.length}</div>` : ``}
      <img src="${p.img}" onclick="verProducto(${p.id})" loading="lazy">
      <div class="card-body">
        <div class="card-title">${p.nombre}</div>
        <div class="card-medidas">${p.medidas}</div>
        <div class="stock">● Stock: ${p.stock} disp. - Envios a todo el pais</div>
        <div class="precio">$${p.precio.toLocaleString('es-AR')}</div>
        <div class="cuotas">12 cuotas de $${Math.round(p.precio/12).toLocaleString('es-AR')}</div>
        <div class="btns">
          <button class="btn-card btn-cart" onclick="agregarCarrito(${p.id})">AGREGAR</button>
          ${p.mp_link ? `<a class="btn-card btn-mp" href="${p.mp_link}" target="_blank">COMPRAR</a>` : `<a class="btn-card btn-mp" href="#" onclick="comprarAhora(${p.id});return false;">COMPRAR</a>`}
        </div>
      </div>
    </div>
  `).join('');
  document.getElementById('cart-count').innerText=carrito.reduce((s,i)=>s+i.cant,0);
}

function cambiarModalImg(src){
  document.getElementById('modal-img').src=src;
  document.querySelectorAll('#modal-thumbs img').forEach(i=>{i.classList.remove('active'); if(i.src===src) i.classList.add('active')});
}

function verProducto(id){
  const p=getProductos().find(x=>x.id==id);
  if(!p) return;
  const imagenes = p.imagenes && p.imagenes.length>0 ? p.imagenes : [p.img];
  document.getElementById('modal-img').src=imagenes[0];
  const thumbs=document.getElementById('modal-thumbs');
  thumbs.innerHTML=imagenes.map((src,i)=>`<img src="${src}" onclick="cambiarModalImg('${src}')" class="${i===0?'active':''}">`).join('');
  thumbs.style.display=imagenes.length>1?'flex':'none';
  document.getElementById('modal-titulo').innerText=p.nombre;
  document.getElementById('modal-medidas').innerText=p.medidas;
  document.getElementById('modal-precio').innerText='$'+p.precio.toLocaleString('es-AR');
  document.getElementById('modal-stock').innerText='Stock: '+p.stock+' disp.';
  document.getElementById('modal-cuotas').innerText='12 cuotas de $'+Math.round(p.precio/12).toLocaleString('es-AR');
  document.getElementById('modal-comprar').onclick=()=>agregarCarrito(p.id);
  document.getElementById('modal-mp').href=p.mp_link||'#';
  document.getElementById('modal-mp').style.display=p.mp_link?'flex':'none';
  document.getElementById('modal').classList.add('active');
}

function cerrarModal(){document.getElementById('modal').classList.remove('active');}

function agregarCarrito(id){
  let prod=getProductos().find(x=>x.id==id);
  let ex=carrito.find(x=>x.id==id);
  if(ex) ex.cant++; else carrito.push({...prod,cant:1});
  localStorage.setItem('primax_carrito',JSON.stringify(carrito));
  renderProductos(document.getElementById('filtro-cat')?.value||'todos');
  alert('✅ Agregado al carrito');
}

function comprarAhora(id){agregarCarrito(id);verCarrito();}

function verCarrito(){
  if(carrito.length===0) return alert('Carrito vacio');
  let lista=document.getElementById('carrito-lista');
  let total=0;
  lista.innerHTML=carrito.map((p,i)=>{total+=p.precio*p.cant; return `<div style="display:flex;gap:10px;margin-bottom:10px;align-items:center"><img src="${p.img}" style="width:50px;height:50px;object-fit:cover;border-radius:8px"><div style="flex:1"><div style="font-weight:800;font-size:12px">${p.nombre}</div><div style="font-size:11px">Cant: ${p.cant} - $${(p.precio*p.cant).toLocaleString('es-AR')}</div></div><button onclick="eliminarDelCarrito(${i})" style="background:#ffeded;border:none;width:28px;height:28px;border-radius:50%;cursor:pointer">✕</button></div>`}).join('');
  document.getElementById('carrito-total').innerText='Total: $'+total.toLocaleString('es-AR');
  document.getElementById('carrito-modal').classList.add('active');
}

function eliminarDelCarrito(i){carrito.splice(i,1);localStorage.setItem('primax_carrito',JSON.stringify(carrito));verCarrito();renderProductos();}
function cerrarCarrito(){document.getElementById('carrito-modal').classList.remove('active');renderProductos();}

function finalizarCompra(){
  const nombre=document.getElementById('cliente-nombre').value.trim();
  const tel=document.getElementById('cliente-tel').value.trim();
  const dir=document.getElementById('cliente-dir').value.trim();
  if(!nombre||!tel) return alert('Completá nombre y teléfono');
  let msg=`Hola Pri-Max Hogar! Quiero comprar:%0A`;
  let total=0;
  carrito.forEach(p=>{msg+=`- ${p.nombre} x${p.cant} $${p.precio*p.cant}%0A`; total+=p.precio*p.cant;});
  msg+=`%0ATotal: $${total}%0ANombre: ${nombre}%0ATel: ${tel}%0ADir: ${dir}`;
  window.open('https://wa.me/5493755400000?text='+msg,'_blank');
}

function filtrar(cat){document.getElementById('filtro-cat').value=cat;renderProductos(cat);}

// ATAJO SECRETO ADMIN: Shift+Ctrl+A
document.addEventListener('keydown',e=>{if(e.shiftKey&&e.ctrlKey&&e.key.toLowerCase()==='a'){e.preventDefault();location.href='admin.html';}});

renderProductos();
