/* Outdoor weather around Mae Klong; device telemetry remains simulated. */
(()=>{
 const endpoint='https://api.open-meteo.com/v1/forecast?latitude=13.409&longitude=100.002&current=temperature_2m,relative_humidity_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m,apparent_temperature&daily=sunrise,sunset,weather_code,temperature_2m_min,temperature_2m_max,apparent_temperature_min,apparent_temperature_max,uv_index_max&timezone=Asia%2FBangkok&forecast_days=7&wind_speed_unit=ms';
 const get=id=>document.getElementById('weather-'+id);
 let inFlight=false,lastSuccess=0,latestData=null,windUnit='ms';
 const symbols={sun:'<circle cx="32" cy="32" r="15"/><path d="M32 3v8m0 42v8M3 32h8m42 0h8M11.5 11.5l6 6m29 29 6 6m0-41-6 6m-29 29-6 6"/>',moon:'<path d="M44 8A24 24 0 1 0 56 44 25 25 0 0 1 44 8Z"/>',cloud:'<path d="M17 47C2 47 2 24 17 24C20 5 44 6 49 23C65 23 65 47 49 47Z"/>',rain:'<path d="M17 38a11 11 0 1 1-2-22 17 17 0 0 1 32-3 13 13 0 1 1 3 25Z"/><path d="m18 8 0 0M21 46l-4 10m17-10-4 10m17-10-4 10"/>',fog:'<path d="M10 19h44M4 32h56M10 45h44"/>',snow:'<path d="M32 4v56M8 18l48 28M8 46l48-28M26 9l6 6 6-6m-12 46 6-6 6 6"/>',storm:'<path d="M17 36a11 11 0 1 1-2-22 17 17 0 0 1 32-3 13 13 0 1 1 3 25Z"/><path d="m33 31-9 16h11l-5 15 17-22H35l7-9"/>'};
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
 const detail=id=>document.getElementById('detail-'+id);
 const number=value=>Number.isFinite(value)?String(Math.round(value)):'—';
 function paintWind(){
  const speed=latestData?.current?.wind_speed_10m;
  detail('wind').textContent=Number.isFinite(speed)?(speed*(windUnit==='kmh'?3.6:1)).toFixed(1)+(windUnit==='kmh'?'km/h':'m/s'):'—';
  document.getElementById('wind-unit').firstChild.textContent=windUnit==='kmh'?'km/h ':'m/s ';
 }
 function paintDetails(data,label,icon){
  latestData=data;const c=data.current,d=data.daily;
  detail('temperature').textContent=number(c.temperature_2m);detail('condition').textContent=label;
  detail('weather-icon').innerHTML=symbols[icon];
  detail('humidity').textContent=number(c.relative_humidity_2m)+'%';
  detail('uv').textContent=number(d.uv_index_max?.[0]);
  detail('sunset').textContent=solarTime(d.sunset?.[0]);detail('sunrise').textContent=solarTime(d.sunrise?.[0]);
  detail('feels-high').textContent=number(d.apparent_temperature_max?.[0]);detail('feels-low').textContent=number(d.apparent_temperature_min?.[0]);
  const direction=c.wind_direction_10m;
  detail('wind-direction').textContent=Number.isFinite(direction)&&direction>=0&&direction<=360?['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(direction/22.5)%16]:'—';
  paintWind();
  const rows=document.getElementById('forecast-days');rows.replaceChildren();
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date());
  for(let i=0;i<7;i++){
   const date=d.time?.[i],validDate=/^\d{4}-\d{2}-\d{2}$/.test(date||'');
   const day=validDate?(date===today?'วันนี้':new Intl.DateTimeFormat('th-TH',{weekday:'long',timeZone:'Asia/Bangkok'}).format(new Date(date+'T12:00:00+07:00')).replace(/^วัน/,'')):'—';
   let rowIcon='',rowLabel='ไม่มีข้อมูล';try{[rowLabel,rowIcon]=condition(d.weather_code?.[i],1)}catch{}
   const row=document.createElement('div');row.className='forecast-row';
   row.innerHTML='<span class="forecast-day"></span><svg role="img" viewBox="0 0 64 64"></svg><span class="forecast-temp forecast-low"></span><span class="forecast-range" aria-hidden="true"></span><span class="forecast-temp forecast-high"></span>';
   row.querySelector('.forecast-day').textContent=day;
   const svg=row.querySelector('svg');svg.dataset.condition=rowIcon;svg.setAttribute('aria-label',rowLabel);svg.innerHTML=symbols[rowIcon]||'';
   row.querySelector('.forecast-low').innerHTML=number(d.temperature_2m_min?.[i])+'<sup>°C</sup>';
   row.querySelector('.forecast-high').innerHTML=number(d.temperature_2m_max?.[i])+'<sup>°C</sup>';
   rows.append(row);
  }
  detail('weather-status').textContent='อัปเดต '+c.time.replace('T',' ')+' (เวลาไทย)';document.getElementById('weather-retry').hidden=true;
 }
 let navigationAnimation=null,navigationVersion=0,weatherClosing=false;
 function setHomeInert(inert){document.querySelectorAll('.app-shell>header,.app-shell>main,.app-shell>.bottom-nav').forEach(element=>{element.inert=inert;if(inert)element.setAttribute('aria-hidden','true');else element.removeAttribute('aria-hidden')})}
 function slidePage(from,to){
  const page=document.getElementById('weather-details');
  const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?0:300;
  return page.animate([{transform:from},{transform:to}],{duration,easing:'cubic-bezier(.22,.7,.2,1)',fill:'both'});
 }
 function displayDetails(){
  const page=document.getElementById('weather-details');
  const from=page.hidden?'translateX(100%)':getComputedStyle(page).transform;
  const version=++navigationVersion;weatherClosing=false;
  if(navigationAnimation)navigationAnimation.cancel();
  document.title='สภาพอากาศ — lNKBlRD';document.querySelector('.app-shell').classList.add('weather-detail-open');
  page.hidden=false;setHomeInert(true);page.focus({preventScroll:true});
  const animation=slidePage(from,'translateX(0)');navigationAnimation=animation;
  animation.finished.then(()=>{if(version===navigationVersion){animation.cancel();navigationAnimation=null}}).catch(()=>{});
  if(!lastSuccess)refresh();
 }
 window.closeWeatherDetails=()=>{
  if(document.getElementById('weather-details').hidden)return false;
  if(weatherClosing)return true;
  weatherClosing=true;
  if(location.hash==='#weather')history.back();else hideDetails();return true;
 };
 function hideDetails(){
  const page=document.getElementById('weather-details');if(page.hidden)return;
  const from=getComputedStyle(page).transform,version=++navigationVersion;weatherClosing=true;
  if(navigationAnimation)navigationAnimation.cancel();
  const animation=slidePage(from,'translateX(100%)');navigationAnimation=animation;
  animation.finished.then(()=>{
   if(version!==navigationVersion)return;
   page.hidden=true;animation.cancel();navigationAnimation=null;weatherClosing=false;
   document.title='lNKBlRD';document.querySelector('.app-shell').classList.remove('weather-detail-open');setHomeInert(false);
   document.querySelector('.weather-overview').focus({preventScroll:true});
  }).catch(()=>{});
 }
 function openDetails(){if(location.hash!=='#weather')history.pushState({weather:true},'',location.pathname+location.search+'#weather');displayDetails()}
 document.querySelector('.weather-overview').addEventListener('click',openDetails);
 document.querySelector('.weather-overview').addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openDetails()}});
 document.getElementById('weather-details-back').onclick=()=>window.closeWeatherDetails();
 document.getElementById('wind-unit').onclick=()=>{windUnit=windUnit==='ms'?'kmh':'ms';paintWind()};
 document.getElementById('weather-retry').onclick=refresh;
 window.addEventListener('popstate',()=>{if(location.hash==='#weather')displayDetails();else hideDetails()});
 if(location.hash==='#weather')displayDetails();
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
   paintDetails(data,label,icon);get('card').dataset.status='live';lastSuccess=Date.now();
  }catch(error){
   get('card').dataset.status=lastSuccess?'stale':'unavailable';
   if(!lastSuccess){get('condition').textContent='โหลดอากาศไม่ได้';get('icon').setAttribute('hidden','');get('temperature').textContent='—';get('humidity').textContent='';get('sunrise').textContent='—';get('sunset').textContent='—'}
   detail('weather-status').textContent=lastSuccess?'ยังอัปเดตไม่ได้ · แสดงข้อมูลเดิม ณ '+latestData.current.time.replace('T',' '):'โหลดข้อมูลอากาศไม่ได้ กรุณาลองใหม่';document.getElementById('weather-retry').hidden=false;if(!lastSuccess){detail('condition').textContent='โหลดอากาศไม่ได้';document.getElementById('forecast-days').innerHTML='<p class="forecast-loading">ยังไม่มีข้อมูลพยากรณ์</p>'}
   get('source').textContent=lastSuccess?'Open-Meteo · ข้อมูลเดิม':'Open-Meteo · ออฟไลน์';
   get('source').title=lastSuccess?'ยังอัปเดตไม่ได้ กำลังแสดงข้อมูลล่าสุดที่โหลดสำเร็จ':'ไม่สามารถโหลดข้อมูลอากาศ กรุณาลองใหม่ภายหลัง';
  }finally{clearTimeout(timeout);inFlight=false}
 }
 refresh();
 setInterval(()=>{if(!document.hidden)refresh()},15*60*1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-lastSuccess>=15*60*1000)refresh()});
})();
