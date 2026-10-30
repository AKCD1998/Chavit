const devices=[{name:'คลังยาด้านบน(ในห้อง)',state:'ออนไลน์',alarm:true,room:'living'},{name:'ตู้เย็น',state:'ออนไลน์',room:'living'},{name:'พื้นที่ขายหน้าร้าน',state:'ออฟไลน์',disabled:true,room:'master'},{name:'พื้นที่เก็บสำรองยา',state:'ออนไลน์',room:'master'},{name:'คลังยาด้านบน(นอกห้อง)',state:'ออนไลน์',room:'master'}];
const $=s=>document.querySelector(s);let room='all';let toastTimer;
if(new URLSearchParams(location.search).has('native'))document.body.classList.add('native');
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2400)}
function showDialog(html){$('#dialog-content').innerHTML=html;$('#dialog').showModal()}
function render(){const root=$('#devices');const isRoom=room!=='all';root.replaceChildren();root.hidden=isRoom;$('#room-empty').hidden=!isRoom;$('#room-weather').hidden=!isRoom;$('#intro').hidden=isRoom;if(isRoom)return;devices.forEach((d,i)=>{const card=document.createElement('button');card.className='device'+(d.disabled?' disabled':'');card.innerHTML=`${d.alarm?'<span class="alarm-dot" aria-label="มีการแจ้งเตือน"></span>':''}<img class="sensor" src="assets/sensor.svg" alt="เซ็นเซอร์อุณหภูมิ"><p class="name">${d.name}</p><p class="state">${d.state}</p>`;card.onclick=()=>showDialog(`<h2>${d.name}</h2><img class="sensor" src="assets/sensor.svg" alt="เซ็นเซอร์"><p>สถานะ: ${d.state}</p><p>${d.alarm?'มีการแจ้งเตือน':''}</p><small>ข้อมูลจำลอง · ยังไม่ได้เชื่อมต่ออุปกรณ์จริง</small>`);root.append(card)})}
const mockWeather={temperature:30,condition:'แดดจัด',sunset:'05:53 p.m.',sunrise:'06:13 a.m.',location:'ตำบล แม่กลอง'};
for(const [key,value] of Object.entries(mockWeather))$('#mock-'+key).textContent=value;
render();
$('#close-banner').onclick=()=>$('#banner').hidden=true;
$('#location').onclick=()=>{showDialog('<h2>เลือกบ้าน</h2><button class="choice" id="select-house">001 ตลาด... ✓</button>');$('#select-house').onclick=()=>$('#dialog').close()};
document.querySelectorAll('[data-room]').forEach(button=>button.onclick=()=>{room=button.dataset.room;document.querySelectorAll('[data-room]').forEach(x=>{x.classList.toggle('active',x===button);x.setAttribute('aria-selected',String(x===button))});render();button.scrollIntoView({block:'nearest',inline:'nearest'});$('#main').scrollTop=0});
const dialogs={scan:'<h2>สแกน</h2><p>สแกน QR เพื่อเพิ่มอุปกรณ์</p><small>หน้าจอจำลอง ยังไม่ได้เปิดกล้อง</small>',add:'<h2>เพิ่มอุปกรณ์</h2><p>เซ็นเซอร์อุณหภูมิและความชื้น</p><small>ขั้นตอนจับคู่อุปกรณ์จะเพิ่มในรอบถัดไป</small>',rooms:'<h2>จัดการห้อง</h2><p>ทุกอุปกรณ์</p><p>Living Room</p><p>Master Bedroom</p><p>Second Bedroom</p>'};
document.querySelectorAll('[data-dialog]').forEach(b=>b.onclick=()=>showDialog(dialogs[b.dataset.dialog]));
$('#dialog-close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
const labels={smart:'สมาร์ท',shop:'ร้านค้า',community:'ชุมชน',me:'ฉัน'};
document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-nav]').forEach(x=>x.classList.toggle('selected',x===b));const home=b.dataset.nav==='home';$('#home-page').hidden=!home;$('#other-page').hidden=home;if(!home)$('#other-page').innerHTML=`<h1>${labels[b.dataset.nav]}</h1><p>หน้าจอนี้อยู่ระหว่างเตรียม mockup</p>`;$('#main').scrollTop=0});
setTimeout(()=>$('#splash').classList.add('hidden'),900);
