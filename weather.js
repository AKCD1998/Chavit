/* Outdoor weather around Mae Klong; device telemetry remains simulated. */
(()=>{
 const endpoint='https://api.open-meteo.com/v1/forecast?latitude=13.409&longitude=100.002&current=temperature_2m,relative_humidity_2m,weather_code,is_day&daily=sunrise,sunset&timezone=Asia%2FBangkok&forecast_days=1';
 const get=id=>document.getElementById('weather-'+id);
 let inFlight=false,lastSuccess=0;
 const symbols={sun:'<circle cx="32" cy="32" r="15"/><path d="M32 3v8m0 42v8M3 32h8m42 0h8M11.5 11.5l6 6m29 29 6 6m0-41-6 6m-29 29-6 6"/>',moon:'<path d="M44 8A24 24 0 1 0 56 44 25 25 0 0 1 44 8Z"/>',cloud:'<path d="M17 47a12 12 0 1 1-2-24 18 18 0 0 1 34-3 14 14 0 1 1 3 27Z"/>',rain:'<path d="M17 38a11 11 0 1 1-2-22 17 17 0 0 1 32-3 13 13 0 1 1 3 25Z"/><path d="m18 8 0 0M21 46l-4 10m17-10-4 10m17-10-4 10"/>',fog:'<path d="M10 19h44M4 32h56M10 45h44"/>',snow:'<path d="M32 4v56M8 18l48 28M8 46l48-28M26 9l6 6 6-6m-12 46 6-6 6 6"/>',storm:'<path d="M17 36a11 11 0 1 1-2-22 17 17 0 0 1 32-3 13 13 0 1 1 3 25Z"/><path d="m33 31-9 16h11l-5 15 17-22H35l7-9"/>'};
 function condition(code,day){
  if(code===0)return [day?'แดดจัด':'ท้องฟ้าแจ่มใส',day?'sun':'moon'];
  if(code===1)return ['มีเมฆเล็กน้อย',day?'sun':'moon'];
  if(code===2)return ['มีเมฆบางส่วน','cloud'];
  if(code===3)return ['เมฆมาก','cloud'];
  if([45,48].includes(code))return ['มีหมอก','fog'];
  if([51,53,55,56,57].includes(code))return ['ฝนปรอย','rain'];
  if([61,63,65,66,67,80,81,82].includes(code))return ['ฝนตก','rain'];
  if([71,73,75,77,85,86].includes(code))return ['หิมะตก','snow'];
  if([95,96,99].includes(code))return ['ฝนฟ้าคะนอง','storm'];
  throw new Error('Invalid weather code');
 }
 function solarTime(value){
  const m=/^\d{4}-\d{2}-\d{2}T(\d{2}):(\d{2})/.exec(value||'');
  if(!m||Number(m[1])>23||Number(m[2])>59)throw new Error('Invalid solar time');
  const hour=Number(m[1]);return String(hour%12||12).padStart(2,'0')+':'+m[2]+(hour>=12?' p.m.':' a.m.');
 }
 async function refresh(){
  if(inFlight)return;inFlight=true;
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
  try{
   const response=await fetch(endpoint,{signal:controller.signal});if(!response.ok)throw new Error('Weather unavailable');
   const data=await response.json(),c=data.current;
   if(!c||!Number.isFinite(c.temperature_2m)||!Number.isFinite(c.relative_humidity_2m)||c.relative_humidity_2m<0||c.relative_humidity_2m>100||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(c.time)||![0,1].includes(c.is_day))throw new Error('Invalid weather');
   const [label,icon]=condition(c.weather_code,c.is_day),sunrise=solarTime(data.daily?.sunrise?.[0]),sunset=solarTime(data.daily?.sunset?.[0]);
   get('temperature').textContent=Math.round(c.temperature_2m);
   get('condition').textContent=label;
   get('humidity').textContent=' · '+Math.round(c.relative_humidity_2m)+'%';
   get('humidity').setAttribute('aria-label','ความชื้น '+Math.round(c.relative_humidity_2m)+' เปอร์เซ็นต์');
   get('sunrise').textContent=sunrise;get('sunset').textContent=sunset;
   get('icon').innerHTML=symbols[icon];get('icon').dataset.condition=icon;get('icon').removeAttribute('hidden');
   get('source').textContent='Open-Meteo · '+c.time.slice(11);
   get('source').title='ข้อมูลอากาศภายนอก ตำบลแม่กลอง ณ '+c.time.replace('T',' ')+' (เวลาไทย)';
   get('card').dataset.status='live';lastSuccess=Date.now();
  }catch(error){
   get('card').dataset.status=lastSuccess?'stale':'unavailable';
   if(!lastSuccess){get('condition').textContent='โหลดอากาศไม่ได้';get('icon').setAttribute('hidden','');get('temperature').textContent='—';get('humidity').textContent='';get('sunrise').textContent='—';get('sunset').textContent='—'}
   get('source').textContent=lastSuccess?'Open-Meteo · ข้อมูลเดิม':'Open-Meteo · ออฟไลน์';
   get('source').title=lastSuccess?'ยังอัปเดตไม่ได้ กำลังแสดงข้อมูลล่าสุดที่โหลดสำเร็จ':'ไม่สามารถโหลดข้อมูลอากาศ กรุณาลองใหม่ภายหลัง';
  }finally{clearTimeout(timeout);inFlight=false}
 }
 refresh();
 setInterval(()=>{if(!document.hidden)refresh()},15*60*1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastSuccess>=15*60*1000)refresh()});
})();
