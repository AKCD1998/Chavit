const devices=[{name:'คลังยาด้านบน(ในห้อง)',state:'ออนไลน์',alarm:true,room:'living'},{name:'ตู้เย็น',state:'ออนไลน์',room:'living'},{name:'พื้นที่ขายหน้าร้าน',state:'ออฟไลน์',disabled:true,room:'master'},{name:'พื้นที่เก็บสำรองยา',state:'ออนไลน์',room:'master'},{name:'คลังยาด้านบน(นอกห้อง)',state:'ออนไลน์',room:'master'}];
const $=s=>document.querySelector(s);let room='all';let adDismissed=false;let toastTimer;
if(new URLSearchParams(location.search).has('native'))document.body.classList.add('native');
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400)}
function showDialog(html){$('#dialog-content').innerHTML=html;$('#dialog').showModal()}
function render(){const root=$('#devices');const isRoom=room!=='all';root.replaceChildren();root.hidden=isRoom;$('#room-empty').hidden=!isRoom;$('#intro').hidden=false;$('#banner').hidden=isRoom||adDismissed;$('#home-page').classList.toggle('room-mode',isRoom);if(isRoom)return;devices.forEach((d,i)=>{const card=document.createElement('button');card.className='device'+(d.disabled?' disabled':'');card.innerHTML=`${d.alarm?'<span class="alarm-dot" aria-label="มีการแจ้งเตือน"></span>':''}<img class="sensor" src="assets/sensor.svg" alt="เซ็นเซอร์อุณหภูมิ"><p class="name">${d.name}</p><p class="state">${d.state}</p>`;card.onclick=()=>showDialog(`<h2>${d.name}</h2><img class="sensor" src="assets/sensor.svg" alt="เซ็นเซอร์"><p>สถานะ: ${d.state}</p><p>${d.alarm?'มีการแจ้งเตือน':''}</p><small>ข้อมูลจำลอง · ยังไม่ได้เชื่อมต่ออุปกรณ์จริง</small>`);root.append(card)})}
render();
$('#close-banner').onclick=()=>{adDismissed=true;$('#banner').hidden=true};
const houses=[{id:'003',name:'วัดช่องลม'},{id:'004',name:'ตลาดบางน้อย'},{id:'001',name:'ตลาดแม่กลอง'}];
let selectedHouse='001';
function renderHouseOptions(){
 const root=$('#house-options');root.replaceChildren();
 houses.forEach(house=>{
  const row=document.createElement('button');row.className='house-option';
  row.setAttribute('aria-label',house.id+' '+house.name);row.setAttribute('aria-pressed',String(house.id===selectedHouse));
  row.innerHTML='<svg class="house-check" aria-hidden="true" viewBox="0 0 28 28"><path d="m4 14 6 6L24 6"/></svg><span></span>';
  row.querySelector('span').textContent=house.id+' '+house.name;
  row.onclick=()=>{selectedHouse=house.id;$('#location .location-label').textContent=house.id+' '+house.name;$('#location').title=house.id+' '+house.name;$('#house-picker').close()};
  root.append(row);
 });
}
$('#location').onclick=()=>{renderHouseOptions();$('#house-picker').showModal();$('#location').setAttribute('aria-expanded','true');document.body.classList.add('house-picker-open')};
$('#house-picker').addEventListener('close',()=>{$('#location').setAttribute('aria-expanded','false');document.body.classList.remove('house-picker-open')});
$('#house-picker').addEventListener('click',event=>{if(event.target!==$('#house-picker'))return;const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close()});
$('#manage-houses').onclick=()=>{$('#house-picker').close();showDialog('<h2>จัดการบ้าน</h2>'+houses.map(h=>'<p>'+h.id+' '+h.name+'</p>').join('')+'<small>หน้าจอจำลองการจัดการบ้าน</small>')};
document.querySelectorAll('[data-room]').forEach(button=>button.onclick=()=>{room=button.dataset.room;document.querySelectorAll('[data-room]').forEach(x=>{x.classList.toggle('active',x===button);x.setAttribute('aria-selected',String(x===button))});render();button.scrollIntoView({block:'nearest',inline:'nearest'});$('#main').scrollTop=0});
const dialogs={add:'<h2>เพิ่มอุปกรณ์</h2><p>เซ็นเซอร์อุณหภูมิและความชื้น</p><small>ขั้นตอนจับคู่อุปกรณ์จะเพิ่มในรอบถัดไป</small>',rooms:'<h2>จัดการห้อง</h2><p>ทุกอุปกรณ์</p><p>Living Room</p><p>Master Bedroom</p><p>Second Bedroom</p>'};
document.querySelectorAll('[data-dialog]').forEach(b=>b.onclick=()=>{if(b.dataset.dialog==='scan')$('#camera-permission').showModal();else showDialog(dialogs[b.dataset.dialog])});
$('#dialog-close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
const labels={smart:'สมาร์ท',shop:'ร้านค้า',community:'ชุมชน',me:'ฉัน'};
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{
 closeDeviceMenu();
 document.querySelectorAll('[data-nav]').forEach(x=>{x.classList.toggle('selected',x===b);if(x===b)x.setAttribute('aria-current','page');else x.removeAttribute('aria-current')});
 const home=b.dataset.nav==='home',me=b.dataset.nav==='me';
 $('#home-page').hidden=!home;$('#me-page').hidden=!me;$('#other-page').hidden=home||me;
 document.querySelector('.app-shell').classList.toggle('me-active',me);
 $('#me-page').classList.remove('profile-collapsed');
 if(!home&&!me)$('#other-page').innerHTML=`<h1>${labels[b.dataset.nav]}</h1><p>หน้าจอนี้อยู่ระหว่างเตรียม mockup</p>`;
 $('#main').scrollTop=0;
});
setTimeout(()=>$('#splash').classList.add('hidden'),900);

let cameraStream=null,cameraAttempt=0;
function stopCamera(){
 cameraAttempt++;
 if(cameraStream){cameraStream.getTracks().forEach(track=>track.stop());cameraStream=null}
 $('#camera-video').srcObject=null;
}
function closeCamera(){if($('#camera-view').open)$('#camera-view').close();stopCamera()}
$('#camera-cancel').onclick=()=>$('#camera-permission').close();
$('#camera-back').onclick=closeCamera;
$('#camera-view').addEventListener('close',stopCamera);
$('#camera-confirm').onclick=async()=>{
 $('#camera-permission').close();
 $('#camera-loading').hidden=false;
 $('#camera-view').showModal();
 const attempt=++cameraAttempt;
 try{
  if(!navigator.mediaDevices?.getUserMedia)throw new Error('unsupported');
  const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
  if(attempt!==cameraAttempt||!$('#camera-view').open){stream.getTracks().forEach(track=>track.stop());return}
  cameraStream=stream;$('#camera-video').srcObject=stream;
  await $('#camera-video').play();
  if(attempt===cameraAttempt)$('#camera-loading').hidden=true;
 }catch(error){
  if(attempt!==cameraAttempt)return;
  closeCamera();
  if(error.name==='NotAllowedError'||error.name==='PermissionDeniedError')toast('ไม่ได้รับอนุญาตให้ใช้กล้อง');
  else if(error.name==='NotFoundError')toast('ไม่พบกล้องบนอุปกรณ์นี้');
  else toast('ไม่สามารถเปิดกล้องได้ กรุณาลองอีกครั้ง');
 }
};
document.addEventListener('visibilitychange',()=>{if(document.hidden)closeCamera()});
window.addEventListener('pagehide',closeCamera);

const deviceMenu=$('#device-menu'),deviceMenuToggle=$('#device-menu-toggle');
function closeDeviceMenu(restoreFocus=false){if(deviceMenu.open)deviceMenu.close();deviceMenuToggle.setAttribute('aria-expanded','false');if(restoreFocus)deviceMenuToggle.focus({preventScroll:true})}
deviceMenuToggle.onclick=()=>{
 if(deviceMenu.open){closeDeviceMenu();return}
 const trigger=deviceMenuToggle.getBoundingClientRect(),shell=document.querySelector('.app-shell').getBoundingClientRect();
 deviceMenu.style.visibility='hidden';deviceMenu.show();
 const rect=deviceMenu.getBoundingClientRect(),left=Math.max(shell.left+12,Math.min(trigger.right-rect.width-6,shell.right-rect.width-12));
 const top=Math.max(8,Math.min(trigger.bottom-5,innerHeight-rect.height-58));
 deviceMenu.style.left=left+'px';deviceMenu.style.top=top+'px';deviceMenu.style.visibility='';deviceMenuToggle.setAttribute('aria-expanded','true');deviceMenu.querySelector('button').focus({preventScroll:true});
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)deviceMenu.animate([{opacity:0,transform:'translateY(-6px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:160,easing:'ease-out'});
};
deviceMenu.addEventListener('close',()=>deviceMenuToggle.setAttribute('aria-expanded','false'));
document.addEventListener('pointerdown',event=>{if(deviceMenu.open&&!deviceMenu.contains(event.target)&&!deviceMenuToggle.contains(event.target))closeDeviceMenu()});
deviceMenu.addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();closeDeviceMenu(true)}
 if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const items=[...deviceMenu.querySelectorAll('button')],current=items.indexOf(document.activeElement);items[(current+(event.key==='ArrowDown'?1:-1)+items.length)%items.length].focus()}
 if(event.key==='Tab')closeDeviceMenu();
});
$('#main').addEventListener('scroll',()=>closeDeviceMenu(),{passive:true});
window.addEventListener('resize',()=>closeDeviceMenu());
document.querySelectorAll('[data-device-menu]').forEach(button=>button.onclick=()=>{
 closeDeviceMenu();
 const action=button.dataset.deviceMenu;
 if(action==='rooms')showDialog(dialogs.rooms);
 else if(action==='details')showDialog('<h2>ใช้เป็นข้อมูล</h2>'+devices.map(device=>'<p>'+device.name+' · '+device.state+'</p>').join(''));
 else showDialog('<h2>ลำดับอุปกรณ์</h2>'+devices.map((device,index)=>'<p>'+(index+1)+'. '+device.name+'</p>').join(''));
});

$('#main').addEventListener('scroll',()=>{if(!$('#me-page').hidden)$('#me-page').classList.toggle('profile-collapsed',$('#main').scrollTop>=150)},{passive:true});
const profileActionLabels={settings:'ตั้งค่า',messages:'ศูนย์ข้อความ',feedback:'ข้อเสนอแนะ',support:'บริการลูกค้า',widget:'วิดเจ็ต',watch:'Apple Watch',alexa:'Alexa Connection Guide',assistant:'Google Assistant',manual:'คู่มือผู้ใช้',about:'เกี่ยวกับ'};
document.querySelectorAll('[data-profile-action]').forEach(button=>button.onclick=()=>{
 const action=button.dataset.profileAction;
 if(action==='name'){
  showDialog('<h2>ตั้งชื่อของคุณ</h2><label for="profile-name-input">ชื่อ</label><input id="profile-name-input" maxlength="40" autocomplete="nickname"><button id="profile-save">บันทึก</button>');
  const input=$('#profile-name-input'),current=$('.profile-name').textContent;input.value=current==='แตะเพื่อตั้งชื่อของคุณ'?'':current;
  $('#profile-save').onclick=()=>{const name=input.value.trim()||'แตะเพื่อตั้งชื่อของคุณ';document.querySelectorAll('.profile-name').forEach(element=>element.textContent=name);$('#dialog').close()};input.focus();
 }else if(action==='homes'){showDialog('<h2>การจัดการบ้าน</h2>'+houses.map(h=>'<p>'+h.id+' '+h.name+'</p>').join(''))}
 else showDialog('<h2>'+profileActionLabels[action]+'</h2>'+(action==='about'?'<p>lNKBlRD</p><p>เวอร์ชัน 0.1.0</p>':''));
});
