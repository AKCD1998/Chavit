/* Reference catalog: official INKBIRD images; screenshot prices are retained for demo fidelity. */
(()=>{
 const products=[
  {
    "id": "grinder",
    "name": "2-in-1 Dual-Chamber Electric Grinder",
    "price": "29.99",
    "category": "new",
    "image": "assets/shop/grinder.jpg"
  },
  {
    "id": "blender",
    "name": "Portable Electric Blender IPB-02",
    "price": "29.99",
    "category": "new",
    "image": "assets/shop/blender.jpg"
  },
  {
    "id": "int33",
    "name": "WiFi Bluetooth Meat Thermometer INT-33-BW",
    "price": "119.99",
    "category": "new",
    "image": "assets/shop/int33.jpg"
  },
  {
    "id": "int11c",
    "name": "Bluetooth Meat Thermometer INT-11C-B",
    "price": "55.99",
    "category": "new",
    "image": "assets/shop/int11c.jpg"
  },
  {
    "id": "itc312",
    "name": "Temperature Controller ITC-312",
    "price": "49.99",
    "category": "controllers",
    "image": "assets/shop/itc312.png"
  },
  {
    "id": "c216t",
    "name": "Temperature Controller C216T",
    "price": "22.99",
    "category": "controllers",
    "image": "assets/shop/c216t.jpg"
  },
  {
    "id": "c236t",
    "name": "Temperature Controller C236T",
    "price": "39.99",
    "category": "controllers",
    "image": "assets/shop/c236t.jpg"
  },
  {
    "id": "itc308",
    "name": "Temperature Controller ITC-308",
    "price": "35.99",
    "category": "controllers",
    "image": "assets/shop/itc308.png"
  },
  {
    "id": "int12-reference",
    "name": "WiFi Bluetooth Meat Thermometer INT-12-BW",
    "price": "97.99",
    "category": "food",
    "image": "assets/shop/int12-reference.jpg"
  },
  {
    "id": "int14-reference",
    "name": "WiFi Bluetooth Meat Thermometer INT-14-BW",
    "price": "139.99",
    "category": "food",
    "image": "assets/shop/int14-reference.jpg"
  },
  {
    "id": "int11x",
    "name": "Bluetooth Meat Thermometer INT-11X-B",
    "price": "99.99",
    "category": "food",
    "image": "assets/shop/int11x.jpg"
  },
  {
    "id": "int11p",
    "name": "Bluetooth Meat Thermometer INT-11P-B",
    "price": "59.99",
    "category": "food",
    "image": "assets/shop/int11p.jpg"
  },
  {
    "id": "ith13",
    "name": "Bluetooth Hygrometer Thermometer ITH-13-B",
    "price": "25.99",
    "category": "sensors",
    "image": "assets/shop/ith13.jpg"
  },
  {
    "id": "ith21",
    "name": "Bluetooth Hygrometer Thermometer ITH-21-B",
    "price": "19.99",
    "category": "sensors",
    "image": "assets/shop/ith21.jpg"
  },
  {
    "id": "ibsth3",
    "name": "WiFi Hygrometer Thermometer IBS-TH3 WIFI PLUS",
    "price": "29.99",
    "category": "sensors",
    "image": "assets/shop/ibsth3.jpg"
  },
  {
    "id": "ibspool",
    "name": "Remote Pool Thermometer Set IBS-P02R",
    "price": "39.99",
    "category": "sensors",
    "image": "assets/shop/ibspool.jpg"
  },
  {
    "id": "isv200",
    "name": "INKBIRD Culinary Sous Vide ISV-200W",
    "price": "89.99",
    "category": "sous",
    "image": "assets/shop/isv200.jpg"
  },
  {
    "id": "isv300-reference",
    "name": "WiFi Sous Vide Cooker ISV-300W",
    "price": "120.99",
    "category": "sous",
    "image": "assets/shop/isv300-reference.jpg"
  },
  {
    "id": "isv100",
    "name": "WiFi Sous Vide Cooker ISV-100W",
    "price": "125.99",
    "category": "sous",
    "image": "assets/shop/isv100.jpg"
  },
  {
    "id": "ssv103",
    "name": "WiFi Sous Vide Cooker SSV-103-W",
    "price": "150.99",
    "category": "sous",
    "image": "assets/shop/ssv103.jpg"
  }
];
 const categories=[...document.querySelectorAll('[data-shop-category]')];
 function render(category){
  const panel=document.getElementById('shop-products');panel.replaceChildren();
  const list=category==='all'?products:products.filter(product=>product.category===category);
  list.forEach((product,index)=>{
   const card=document.createElement('button');card.className='shop-product';card.dataset.productId=product.id;
   const image=document.createElement('img');image.src=product.image;image.alt=product.name;image.loading=index<4?'eager':'lazy';image.width=700;image.height=700;
   const name=document.createElement('span');name.className='shop-product-name';name.textContent=product.name;
   const price=document.createElement('span');price.className='shop-product-price';price.textContent='$ '+product.price;
   card.append(image,name,price);
   card.onclick=()=>{
    showDialog('<div class="shop-product-detail"><img class="shop-product-preview" alt=""><h2></h2><p class="shop-detail-price"></p></div>');
    const detail=document.querySelector('.shop-product-detail');detail.querySelector('img').src=product.image;detail.querySelector('img').alt=product.name;detail.querySelector('h2').textContent=product.name;detail.querySelector('p').textContent='$ '+product.price;
   };
   panel.append(card);
  });
 }
 function selectCategory(button){
  categories.forEach(tab=>{const active=tab===button;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1});
  document.getElementById('shop-products').setAttribute('aria-labelledby',button.id);
  render(button.dataset.shopCategory);
  button.scrollIntoView({block:'nearest',inline:categories.indexOf(button)<3?'nearest':'center'});
  if(button.dataset.shopCategory==='food'){const tabs=button.parentElement,box=button.getBoundingClientRect();tabs.scrollLeft+=box.left-tabs.getBoundingClientRect().left-(tabs.clientWidth*.64-box.width/2)}
  document.getElementById('main').scrollTop=0;
 }
 categories.forEach(button=>{
  button.onclick=()=>selectCategory(button);
  button.addEventListener('keydown',event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();let index=categories.indexOf(button);
   if(event.key==='Home')index=0;else if(event.key==='End')index=categories.length-1;else index=(index+(event.key==='ArrowRight'?1:-1)+categories.length)%categories.length;
   selectCategory(categories[index]);categories[index].focus({preventScroll:true});
  });
 });
 document.getElementById('shop-support').onclick=()=>showDialog('<h2>บริการลูกค้า</h2><p>INKBIRD</p>');
 document.getElementById('shop-promo').onclick=()=>showDialog('<h2>Get 10% Off</h2><p>Subscribe To Get 10% OFF For Your First Order</p>');
 render('all');
})();
