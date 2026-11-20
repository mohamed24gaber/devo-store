// ===== CURSOR =====
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx-6+'px';cur.style.top=my-6+'px';});
setInterval(()=>{rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;ring.style.left=rx-18+'px';ring.style.top=ry-18+'px';},16);
document.querySelectorAll('button,a,[onclick]').forEach(el=>{
  el.addEventListener('mouseenter',()=>ring.classList.add('expand'));
  el.addEventListener('mouseleave',()=>ring.classList.remove('expand'));
});

// ===== NAV =====
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>40);
});
function toggleMenu(){document.getElementById('navLinks').classList.toggle('open');}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));

// ===== PAGE SYSTEM =====
function showPage(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById(p+'-page').classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  const n=document.getElementById('nav-'+p);
  if(n)n.classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(p==='products')renderProducts();
  if(p==='order')renderCart();
  if(p==='admin')initAdmin();
}

// ===== PRODUCTS DATA =====
let allProducts=[
  {id:1,name:'Air Max Classic Pro',cat:'classic',price:399,old:499,badge:'hot',emoji:'👟',desc:'كوتشي كلاسيك فاخر بنعل هوائي مريح'},
  {id:2,name:'Retro Leather Oxford',cat:'classic',price:549,old:0,badge:'',emoji:'👞',desc:'حذاء جلد طبيعي بتصميم رسمي أنيق'},
  {id:3,name:'Shadow Classic Low',cat:'classic',price:329,old:420,badge:'sale',emoji:'🥿',desc:'كلاسيك لو توب بألوان متعددة'},
  {id:4,name:'Street Casual Slip-On',cat:'casual',price:299,old:0,badge:'new',emoji:'🥿',desc:'سليب أون عملي للاستخدام اليومي'},
  {id:5,name:'Sport Flex Mesh',cat:'casual',price:289,old:0,badge:'',emoji:'👟',desc:'خفيف ومرن مناسب للرياضة والسير'},
  {id:6,name:'Laid Back Loafer',cat:'casual',price:349,old:0,badge:'',emoji:'🥾',desc:'لوفر كاجوال بتصميم عصري مريح'},
  {id:7,name:'Urban Runner 2026',cat:'new',price:459,old:0,badge:'new',emoji:'👠',desc:'أحدث إصدار 2026 بتصميم مستقبلي'},
  {id:8,name:'Neon Boost Runner',cat:'new',price:379,old:0,badge:'new',emoji:'👟',desc:'بوست نيون بألوان جريئة ومتميزة'},
  {id:9,name:'Cloud Walk Premium',cat:'new',price:419,old:0,badge:'new',emoji:'🥿',desc:'نعل سحابي فائق الراحة كولكشن خاص'},
  {id:10,name:'Air Max Classic Pro',cat:'classic',price:199,old:399,badge:'sale',emoji:'👟',desc:'آخر قطع بخصم 50% - مقاسات محدودة'},
  {id:11,name:'Sport Flex Old Season',cat:'casual',price:149,old:289,badge:'sale',emoji:'👟',desc:'خصم نهاية الموسم - اللون الرمادي فقط'},
];
{const sp=(()=>{try{return JSON.parse(localStorage.getItem('devo_products'))}catch(e){return null}})();if(Array.isArray(sp)&&sp.length)allProducts=sp;}

const PH={1:'1654130491481-dc83a0a05e4e',2:'1576133385309-203e67da8e58',3:'1679284392805-1b7f8e2e3f21',4:'1457968867385-9f877f3f2bce',5:'1567069041071-bab3e18d72f0',6:'1576133385309-203e67da8e58',7:'1686067776426-9646eb4b5796',8:'1488993497948-5e80ca852d9c',9:'1460353581641-37baddab0fa2',10:'1654130491481-dc83a0a05e4e',11:'1567069041071-bab3e18d72f0'};
const imgOf=p=>p.img||(PH[p.id]?`https://images.unsplash.com/photo-${PH[p.id]}?auto=format&fit=crop&w=700&q=70`:'');
const imgTag=p=>imgOf(p)?`<img src="${imgOf(p)}" alt="${p.name}" loading="lazy" onerror="this.replaceWith(document.createTextNode('${p.emoji}'))">`:p.emoji;

let activeFilter='all';
function renderProducts(){
  const filtered=allProducts.filter(p=>activeFilter==='all'||p.cat===activeFilter||(activeFilter==='sale'&&p.old>0));
  const grid=document.getElementById('productsGrid');
  grid.innerHTML=filtered.map(p=>`
    <div class="product-card reveal" onclick="addToCart('${p.name}','${p.price}')">
      ${p.badge?`<div class="product-badge badge-${p.badge}">${p.badge==='hot'?'🔥 HOT':p.badge==='new'?'✨ NEW':'🔥 SALE'}</div>`:''}
      <div class="product-img sq" style="font-size:4rem;min-height:180px;">
        ${imgTag(p)}
        <div class="product-img-overlay"></div>
        <button class="quick-add" onclick="event.stopPropagation();addToCart('${p.name}','${p.price}')">أضف للسلة</button>
      </div>
      <div class="product-info">
        <div class="product-cat">${p.cat.toUpperCase()}</div>
        <div class="product-name">${p.name}</div>
        <div style="font-size:0.75rem;color:var(--off);margin:0.2rem 0;">${p.desc}</div>
        <div class="product-price-row">
          <div>${p.old?`<span class="product-price-old">${p.old} ج</span>`:''}
          <span class="product-price">${p.price} جنيه</span></div>
          <button class="add-cart-btn" onclick="event.stopPropagation();addToCart('${p.name}','${p.price}')">+</button>
        </div>
      </div>
    </div>
  `).join('');
  observeReveal();
}

function filterProducts(cat,btn){
  activeFilter=cat;
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderProducts();
}

// ===== CART =====
let cart=[];
let shipping='sohag';

function addToCart(name,price){
  const existing=cart.find(i=>i.name===name);
  if(existing){existing.qty++;}
  else{cart.push({name,price:parseInt(price),qty:1});}
  updateCartCount();
  showNotif();
  renderCart();
}

function removeFromCart(idx){
  cart.splice(idx,1);
  updateCartCount();
  renderCart();
}

function updateCartCount(){
  const total=cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('cartCount').textContent=total;
}

function renderCart(){
  const el=document.getElementById('cartItems');
  if(!el)return;
  if(cart.length===0){el.innerHTML='<div class="empty-cart">🛒<br>السلة فارغة<br><small>أضف منتجات من المتجر</small></div>';}
  else{el.innerHTML=cart.map((item,i)=>`
    <div class="cart-item">
      <div class="cart-item-img">👟</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">الكمية: ${item.qty}</div>
      </div>
      <div class="cart-item-price">${item.price*item.qty} ج</div>
      <button class="cart-item-remove" onclick="removeFromCart(${i})">✕</button>
    </div>
  `).join('');}
  calcTotal();
}

function calcTotal(){
  const subtotal=cart.reduce((s,i)=>s+i.price*i.qty,0);
  const ship=shipping==='outside'?50:0;
  const total=subtotal+ship;
  const sv=document.getElementById('subtotalVal');
  const shv=document.getElementById('shippingVal');
  const tv=document.getElementById('totalVal');
  if(sv)sv.textContent=subtotal+' ج';
  if(shv)shv.textContent=ship===0?'مجاني':'+'+ship+' ج';
  if(tv)tv.textContent=total+' ج';
}

function selectShip(type){
  shipping=type;
  document.getElementById('ship-sohag').classList.toggle('selected',type==='sohag');
  document.getElementById('ship-outside').classList.toggle('selected',type==='outside');
  calcTotal();
}

// ===== CONTACT =====
// ===== NOTIF =====
function showNotif(){
  const n=document.getElementById('notif');
  n.classList.add('show');
  setTimeout(()=>n.classList.remove('show'),2500);
}

// ===== SCROLL REVEAL =====
function observeReveal(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*80);}});
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>{if(!el.classList.contains('visible'))obs.observe(el);});
}
observeReveal();

// ===== PRODUCT SELECTOR IN ORDER FORM =====
document.addEventListener('DOMContentLoaded',()=>{
  const sel=document.getElementById('o-product');
  if(sel)sel.addEventListener('change',()=>{
    const val=sel.value;
    if(val){
      const[name,price]=val.split('|');
      addToCart(name,price);
    }
  });
});

/* ===== DEVO CONFIG & STORAGE ===== */
const CFG={phone:'01234567890',user:'admin',pass:'devo@2026'};
const $=id=>document.getElementById(id);
const LS={get:(k,d)=>{try{const v=JSON.parse(localStorage.getItem('devo_'+k));return v==null?d:v}catch(e){return d}},set:(k,v)=>{try{localStorage.setItem('devo_'+k,JSON.stringify(v))}catch(e){}}};
const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STAT=['جديد','قيد التجهيز','تم التوصيل','ملغي'];
document.querySelectorAll('.ph').forEach(e=>e.textContent=CFG.phone);
let orders=LS.get('orders',null),msgs=LS.get('msgs',[]);
if(!orders){
  const mk=(id,d,name,phone,items,status)=>({id,date:new Date(Date.now()-d*864e5).toISOString(),name,phone,address:'سوهاج - شارع الجمهورية',items,total:items.reduce((a,i)=>a+i.price*i.qty,0),status,demo:1});
  orders=[mk(1005,0,'أحمد محمد','01012345678',[{name:'Air Max Classic Pro',price:399,qty:1}],'جديد'),
  mk(1004,1,'محمود علي','01123456789',[{name:'Cloud Walk Premium',price:419,qty:2}],'قيد التجهيز'),
  mk(1003,2,'يوسف حسن','01234567891',[{name:'Retro Leather Oxford',price:549,qty:1}],'تم التوصيل'),
  mk(1002,4,'كريم سعيد','01512345678',[{name:'Neon Boost Runner',price:379,qty:1},{name:'Sport Flex Mesh',price:289,qty:1}],'تم التوصيل'),
  mk(1001,5,'عمر خالد','01098765432',[{name:'Urban Runner 2026',price:459,qty:1}],'تم التوصيل')];
  LS.set('orders',orders);
}
const sv=()=>{LS.set('orders',orders);LS.set('msgs',msgs);LS.set('products',allProducts);};
function fillSel(){$('o-product').innerHTML='<option value="">-- اختر المنتج --</option>'+allProducts.map(p=>`<option value="${esc(p.name)}|${p.price}">${esc(p.name)} - ${p.price} ج</option>`).join('');}
fillSel();

function submitOrder(){
  const name=$('o-name').value.trim(),phone=$('o-phone').value.trim();
  if(!name||!phone||!cart.length){alert('الرجاء ملء اسمك ورقم هاتفك وإضافة منتج للسلة');return;}
  const ship=shipping==='outside'?50:0;
  orders.unshift({id:Math.max(1000,...orders.map(o=>o.id))+1,date:new Date().toISOString(),name,phone,address:$('o-address').value.trim(),size:$('o-size').value,notes:$('o-notes').value.trim(),items:cart.map(i=>({...i})),total:cart.reduce((a,i)=>a+i.price*i.qty,0)+ship,status:'جديد'});
  sv();cart=[];updateCartCount();renderCart();
  const s=$('orderSuccess');s.style.display='block';setTimeout(()=>s.style.display='none',5000);
  ['o-name','o-phone','o-address','o-notes'].forEach(k=>$(k).value='');
}
function sendMessage(){
  const name=$('c-name').value.trim(),contact=$('c-email').value.trim();
  if(!name||!contact){alert('الرجاء إدخال اسمك وبيانات التواصل');return;}
  msgs.unshift({id:Date.now(),date:new Date().toISOString(),name,contact,subject:$('c-subject').value,text:$('c-msg').value.trim()});sv();
  const s=$('contactSuccess');s.style.display='block';setTimeout(()=>s.style.display='none',5000);
  ['c-name','c-email','c-msg'].forEach(k=>$(k).value='');
}

/* ===== SPLASH + SPOTLIGHT ===== */
setTimeout(()=>$('splash').classList.add('out'),1900);
document.querySelector('.hero').addEventListener('mousemove',e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',(e.clientX-r.left)+'px');e.currentTarget.style.setProperty('--my',(e.clientY-r.top)+'px');});

/* ===== ADMIN ===== */
let _auth=false;
const isAuth=()=>{try{return sessionStorage.getItem('devo_auth')==='1'}catch(e){return _auth}};
function initAdmin(){const ok=isAuth();$('loginBox').style.display=ok?'none':'flex';$('dash').style.display=ok?'block':'none';if(ok)renderDash();}
function doLogin(){
  if($('a-user').value.trim()===CFG.user&&$('a-pass').value===CFG.pass){_auth=true;try{sessionStorage.setItem('devo_auth','1')}catch(e){}$('a-pass').value='';$('loginErr').textContent='';initAdmin();}
  else{$('loginErr').textContent='بيانات الدخول غير صحيحة';const c=document.querySelector('.login-card');c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');}
}
function doLogout(){_auth=false;try{sessionStorage.removeItem('devo_auth')}catch(e){}initAdmin();}
function showTab(t,btn){document.querySelectorAll('.dtab').forEach(x=>x.style.display='none');$('t-'+t).style.display='block';document.querySelectorAll('#dash .filter-btn').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');}
const fd=d=>new Date(d).toLocaleDateString('ar-EG',{day:'numeric',month:'short'});
const itemsTxt=o=>o.items.map(i=>`${esc(i.name)} ×${i.qty}`).join('، ');
function orderRows(list,full){
  if(!list.length)return '<div class="empty">لا توجد طلبات</div>';
  return `<table><tr><th>#</th><th>التاريخ</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th>${full?'<th></th>':''}</tr>`+list.map(o=>`<tr><td>${o.id}${o.demo?'<span class="tag">تجريبي</span>':''}</td><td>${fd(o.date)}</td><td>${esc(o.name)}<br><small style="color:var(--off)">${esc(o.phone)}${o.address?' · '+esc(o.address):''}</small></td><td>${itemsTxt(o)}</td><td style="color:var(--accent);font-weight:800">${o.total} ج</td><td>${full?`<select onchange="setStatus(${o.id},this.value)">${STAT.map(x=>`<option${x===o.status?' selected':''}>${x}</option>`).join('')}</select>`:esc(o.status)}</td>${full?`<td><button class="del" onclick="delOrder(${o.id})">🗑</button></td>`:''}</tr>`).join('')+'</table>';
}
function renderDash(){
  const live=orders.filter(o=>o.status!=='ملغي'),rev=live.reduce((a,o)=>a+o.total,0);
  $('d-stats').innerHTML=[['💰','إجمالي الإيرادات',rev+' ج'],['📦','عدد الطلبات',orders.length],['🆕','طلبات جديدة',orders.filter(o=>o.status==='جديد').length],['👟','المنتجات',allProducts.length],['✉️','الرسائل',msgs.length]].map(x=>`<div class="d-stat"><i>${x[0]}</i><b>${x[2]}</b><span>${x[1]}</span></div>`).join('');
  const days=[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*864e5);return{l:d.toLocaleDateString('ar-EG',{weekday:'short'}),v:live.filter(o=>new Date(o.date).toDateString()===d.toDateString()).reduce((a,o)=>a+o.total,0)}});
  const mx=Math.max(...days.map(d=>d.v),1);
  $('d-chart').innerHTML=`<svg viewBox="0 0 700 230" style="width:100%"><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e3b0"/><stop offset="1" stop-color="#8a6d3b"/></linearGradient></defs>${[0,1,2,3].map(i=>`<line x1="20" x2="680" y1="${40+i*45}" y2="${40+i*45}" stroke="#26252a" stroke-dasharray="4"/>`).join('')}${days.map((d,i)=>{const h=d.v/mx*140,x=45+i*92;return `<rect x="${x}" y="${175-h}" width="56" height="${h}" rx="8" fill="url(#gg)"/><text x="${x+28}" y="${167-h}" text-anchor="middle" fill="#d4af6a" font-size="13" font-weight="700">${d.v||''}</text><text x="${x+28}" y="205" text-anchor="middle" fill="#9d978a" font-size="13">${d.l}</text>`}).join('')}</svg>`;
  $('d-recent').innerHTML=orderRows(orders.slice(0,5),false);
  $('d-orders').innerHTML=orderRows(orders,true);
  $('d-products').innerHTML=`<table><tr><th></th><th>المنتج</th><th>القسم</th><th>السعر</th><th></th></tr>`+allProducts.map(p=>`<tr><td style="font-size:1.4rem">${imgOf(p)?`<img class="thumb" src="${esc(imgOf(p))}" alt="">`:esc(p.emoji||'👟')}</td><td>${esc(p.name)}</td><td>${esc(p.cat)}</td><td><input type="number" value="${p.price}" onchange="setPrice(${p.id},this.value)"> ج</td><td><button class="del" onclick="delProd(${p.id})">🗑</button></td></tr>`).join('')+'</table>';
  $('d-msgs').innerHTML=msgs.length?msgs.map(m=>`<div class="msg"><div><b>${esc(m.name)}</b> · ${esc(m.contact)} <span class="tag">${esc(m.subject)}</span><p>${esc(m.text)||'—'}</p></div><button class="del" onclick="delMsg(${m.id})">🗑</button></div>`).join(''):'<div class="empty">لا توجد رسائل</div>';
}
function setStatus(id,v){const o=orders.find(x=>x.id===id);if(o){o.status=v;sv();renderDash();}}
function delOrder(id){if(confirm('حذف الطلب؟')){orders=orders.filter(o=>o.id!==id);sv();renderDash();}}
function delMsg(id){msgs=msgs.filter(m=>m.id!==id);sv();renderDash();}
function setPrice(id,v){const p=allProducts.find(x=>x.id===id);if(p&&+v>0){p.price=+v;sv();fillSel();renderDash();}}
function delProd(id){if(confirm('حذف المنتج؟')){allProducts=allProducts.filter(p=>p.id!==id);sv();fillSel();renderDash();}}
function addProd(){
  const name=$('p-name').value.replace(/['"<>&\\`$]/g,'').trim(),price=+$('p-price').value;
  if(!name||!(price>0)){alert('اكتب اسم المنتج وسعره');return;}
  const old=+$('p-old').value||0;
  allProducts.push({id:Date.now(),name,cat:$('p-cat').value,price,old:old>price?old:0,badge:old>price?'sale':($('p-cat').value==='new'?'new':''),emoji:$('p-emoji').value.trim()||'👟',img:/^https?:\/\//.test($('p-img').value.trim())?$('p-img').value.trim():'',desc:'منتج جديد من DEVO'});
  sv();fillSel();['p-name','p-price','p-old','p-emoji','p-img'].forEach(k=>$(k).value='');renderDash();
}
function resetDemo(){orders=orders.filter(o=>!o.demo);sv();renderDash();}
