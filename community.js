/* Local community demo based on the supplied screenshots. No remote social writes. */
(()=>{
 const byId=id=>document.getElementById(id),shell=document.querySelector('.app-shell');
 const posts=[
  {id:'guidelines',author:'INKBIRD',official:true,date:'04/08',title:'INKBIRD Community Guidelines',intro:'Welcome to the INKBIRD Community!',body:'We are delighted to have you join our community and explore the endless possibilities of precision cooking. Share your experiences, ask questions, and connect with fellow INKBIRD users.',thaiIntro:'ยินดีต้อนรับสู่ชุมชน INKBIRD!',thaiBody:'เรายินดีต้อนรับคุณสู่ชุมชน เพื่อร่วมสำรวจความเป็นไปได้ของการทำอาหารอย่างแม่นยำ แบ่งปันประสบการณ์ ตั้งคำถาม และพูดคุยกับผู้ใช้ INKBIRD คนอื่น ๆ',likes:38,comments:13,categories:['all','controllers','thermo']},
  {id:'thermometer',author:'InkbirdUser_1221e432338d',official:false,date:'3 ชั่วโมงที่แล้ว',title:'termometro int 11l-b',intro:'',body:'ho comprato questo da due giorni e non sono ancora riuscito ad effettuare una misurazione, la base indica tre linee e non misura niente. Inoltre, la sonda si collega ma non mostra la temperatura.',thaiIntro:'',thaiBody:'ซื้อมาได้สองวันแล้ว แต่ยังวัดค่าไม่ได้ ฐานแสดงขีดสามขีดและไม่แสดงค่าที่วัด นอกจากนี้ โพรบเชื่อมต่อแล้วแต่ยังไม่แสดงอุณหภูมิ',likes:0,comments:0,categories:['all','thermo']}
 ];
 const liked=new Set(),saved=new Set();let mode='feed',category='all',profileTab='posts';
 let profileName='InkbirdUser_6043c19eff74',profileBio='แนะนำตัวคุณเอง',draft={title:'',body:''};
 function icon(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),use=document.createElementNS('http://www.w3.org/2000/svg','use');svg.setAttribute('aria-hidden','true');use.setAttribute('href','#'+name);svg.append(use);return svg}
 function button(text,className){const element=document.createElement('button');element.className=className;element.textContent=text;return element}
 function updateLikeButtons(post){document.querySelectorAll('.community-post[data-post-id="'+post.id+'"] .community-like').forEach(control=>{control.setAttribute('aria-pressed',String(liked.has(post.id)));control.querySelector('span').textContent=post.likes+(liked.has(post.id)?1:0)||''})}
 function openPost(post){
  showDialog('<div class="community-post-detail"><h2></h2><p></p><button class="community-save-post"></button></div>');
  const detail=document.querySelector('.community-post-detail');detail.querySelector('h2').textContent=post.title;detail.querySelector('p').textContent=[post.intro,post.body].filter(Boolean).join('\n\n');
  const save=detail.querySelector('button');save.textContent=saved.has(post.id)?'บันทึกแล้ว':'บันทึก';save.setAttribute('aria-pressed',String(saved.has(post.id)));
  save.onclick=()=>{if(saved.has(post.id))saved.delete(post.id);else saved.add(post.id);save.textContent=saved.has(post.id)?'บันทึกแล้ว':'บันทึก';save.setAttribute('aria-pressed',String(saved.has(post.id)));paintProfile()};
 }
 function makePost(post){
  const article=document.createElement('article');article.className='community-post';article.dataset.postId=post.id;article.dataset.official=String(post.official);
  const author=document.createElement('div');author.className='community-post-author';const avatar=document.createElement('img');avatar.src=post.official?'assets/splash.png':'assets/avatar.svg';avatar.alt='';
  const authorText=document.createElement('div'),authorName=document.createElement('div');authorName.className='community-author-name';authorName.textContent=post.author;
  if(post.official){const badge=document.createElement('span');badge.className='community-verified';badge.textContent='V';badge.setAttribute('aria-label','บัญชีทางการ');authorName.append(badge)}
  const date=document.createElement('div');date.className='community-post-date';date.textContent=post.date;authorText.append(authorName,date);author.append(avatar,authorText);
  const title=document.createElement('h2');title.textContent=post.title;
  const intro=document.createElement('p');intro.className='community-post-intro';intro.textContent=post.intro;intro.hidden=!post.intro;
  const body=document.createElement('p');body.className='community-post-body';body.textContent=post.body;
  const more=button('แสดงเพิ่มเติม','community-post-expand');more.setAttribute('aria-expanded','false');more.onclick=()=>{const expanded=article.classList.toggle('expanded');more.textContent=expanded?'แสดงน้อยลง':'แสดงเพิ่มเติม';more.setAttribute('aria-expanded',String(expanded))};
  const footer=document.createElement('div');footer.className='community-post-footer';
  const translate=button('ดูคำแปล','community-translate');translate.onclick=()=>{const thai=article.classList.toggle('translated');intro.textContent=thai?post.thaiIntro:post.intro;body.textContent=thai?post.thaiBody:post.body;translate.textContent=thai?'ดูต้นฉบับ':'ดูคำแปล'};
  const like=button('','community-post-action community-like');like.setAttribute('aria-label','ถูกใจ '+post.title);like.setAttribute('aria-pressed',String(liked.has(post.id)));const count=document.createElement('span');count.textContent=post.likes+(liked.has(post.id)?1:0)||'';like.append(icon('community-like'),count);
  like.onclick=()=>{if(liked.has(post.id))liked.delete(post.id);else liked.add(post.id);updateLikeButtons(post);paintProfile()};
  const comment=button('','community-post-action');comment.setAttribute('aria-label','ความคิดเห็น '+post.title);const comments=document.createElement('span');comments.textContent=post.comments||'';comment.append(icon('message'),comments);comment.onclick=()=>{showDialog('<h2>ความคิดเห็น</h2><p id="community-comment-title"></p>');byId('community-comment-title').textContent=post.title};
  title.tabIndex=0;title.setAttribute('role','button');title.setAttribute('aria-label','เปิดโพสต์ '+post.title);title.onclick=()=>openPost(post);title.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();openPost(post)}};
  footer.append(translate,like,comment);article.append(author,title,intro,body,more,footer);return article;
 }
 function paintFeed(){
  const query=byId('community-feed-search').value.trim().toLocaleLowerCase();let list=posts.filter(post=>post.categories.includes(category)&&(!query||[post.author,post.title,post.body].join(' ').toLocaleLowerCase().includes(query)));
  if(byId('community-sort').value==='latest')list=[...list].reverse();
  const container=byId('community-posts');container.replaceChildren(...list.map(makePost));
  if(!list.length){const empty=document.createElement('p');empty.className='community-no-results';empty.textContent='ไม่พบโพสต์ที่ค้นหา';container.append(empty)}
 }
 const emptyMessages={posts:'คุณยังไม่ได้แชร์โพสต์ใด ๆ',comments:'คุณยังไม่ได้แสดงความคิดเห็นในโพสต์ใด ๆ',likes:'คุณยังไม่ได้ถูกใจโพสต์ใด ๆ',saved:'คุณยังไม่ได้บันทึกโพสต์ใด ๆ'};
 function paintProfile(){
  const query=byId('community-profile-search').value.trim().toLocaleLowerCase();const list=posts.filter(post=>(profileTab==='likes'?liked.has(post.id):profileTab==='saved'?saved.has(post.id):false)&&(!query||[post.title,post.body,post.author].join(' ').toLocaleLowerCase().includes(query)));
  const results=byId('community-profile-results');results.replaceChildren();results.dataset.empty=String(!list.length);
  if(list.length)results.append(...list.map(makePost));
  else{const image=document.createElement('img');image.src='assets/community-empty.svg';image.alt='';image.className='community-empty-image';const text=document.createElement('p');text.className='community-empty-message';text.textContent=query?'ไม่พบโพสต์ที่ค้นหา':emptyMessages[profileTab];results.append(image,text)}
 }
 function selectProfileTab(tab){
  profileTab=tab.dataset.communityProfileTab;
  document.querySelectorAll('[data-community-profile-tab]').forEach(button=>{const active=button===tab;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(button.dataset.communityProfileTab==='saved')button.querySelector('span').textContent=active?'บันทึกแล้ว':'บันทึก'});
  byId('community-profile-results').setAttribute('aria-labelledby',tab.id);paintProfile();tab.scrollIntoView({block:'nearest',inline:'nearest'});byId('main').scrollTop=0;
 }
 function selectMode(tab){
  mode=tab.dataset.communityView;const ownProfile=mode==='profile';
  document.querySelectorAll('[data-community-view]').forEach(button=>{button.classList.toggle('active',button===tab);button.setAttribute('aria-selected',String(button===tab));button.tabIndex=button===tab?0:-1});
  byId('community-feed-panel').hidden=ownProfile;byId('community-profile-panel').hidden=!ownProfile;byId('community-page').classList.toggle('community-profile-view',ownProfile);
  shell.classList.toggle('community-profile-mode',ownProfile&&!byId('community-page').hidden);byId('community-compose').hidden=ownProfile||byId('community-page').hidden;byId('main').scrollTop=0;
  if(ownProfile)paintProfile();else paintFeed();
 }
 function selectCategory(tab){
  category=tab.dataset.communityCategory;document.querySelectorAll('[data-community-category]').forEach(button=>{button.classList.toggle('active',button===tab);button.setAttribute('aria-selected',String(button===tab));button.tabIndex=button===tab?0:-1});byId('community-posts').setAttribute('aria-labelledby',tab.id);tab.scrollIntoView({block:'nearest',inline:'nearest'});paintFeed();byId('main').scrollTop=0;
 }
 function bindTabs(selector,activate){const buttons=[...document.querySelectorAll(selector)];buttons.forEach(tab=>{tab.onclick=()=>activate(tab);tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const index=buttons.indexOf(tab),next=event.key==='Home'?buttons[0]:event.key==='End'?buttons.at(-1):buttons[(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length];activate(next);next.focus({preventScroll:true})})})}
 document.querySelectorAll('[data-community-category]').forEach(tab=>{tab.id='community-category-'+tab.dataset.communityCategory;tab.setAttribute('aria-controls','community-posts')});byId('community-posts').setAttribute('role','tabpanel');byId('community-posts').setAttribute('aria-labelledby','community-category-all');
 bindTabs('[data-community-view]',selectMode);bindTabs('[data-community-profile-tab]',selectProfileTab);bindTabs('[data-community-category]',selectCategory);
 byId('community-feed-search').addEventListener('input',paintFeed);byId('community-sort').onchange=paintFeed;byId('community-profile-search').addEventListener('input',paintProfile);
 document.querySelector('.community-category-menu').onclick=()=>{showDialog('<h2>หมวดชุมชน</h2><div id="community-category-choices"></div>');document.querySelectorAll('[data-community-category]').forEach(tab=>{const choice=button(tab.textContent.trim(),'choice');choice.onclick=()=>{byId('dialog').close();selectCategory(tab)};byId('community-category-choices').append(choice)})};
 byId('community-profile-search-toggle').onclick=()=>{const row=document.querySelector('.community-profile-search');row.hidden=!row.hidden;byId('community-profile-search-toggle').setAttribute('aria-expanded',String(!row.hidden));if(!row.hidden)byId('community-profile-search').focus();else{byId('community-profile-search').value='';paintProfile()}};
 byId('community-edit-profile').onclick=()=>{
  showDialog('<form class="community-form" id="community-edit-form"><h2>แก้ไขโปรไฟล์</h2><label for="community-name-input">ชื่อ</label><input id="community-name-input" maxlength="40" autocomplete="nickname"><label for="community-bio-input">แนะนำตัวคุณเอง</label><textarea id="community-bio-input" maxlength="240"></textarea><button type="submit" class="community-form-save">บันทึก</button></form>');
  byId('community-name-input').value=profileName;byId('community-bio-input').value=profileBio==='แนะนำตัวคุณเอง'?'':profileBio;
  byId('community-edit-form').onsubmit=event=>{event.preventDefault();profileName=byId('community-name-input').value.trim()||'InkbirdUser_6043c19eff74';profileBio=byId('community-bio-input').value.trim()||'แนะนำตัวคุณเอง';byId('community-profile-name').textContent=profileName;byId('community-profile-bio').textContent=profileBio;byId('dialog').close()};
 };
 document.querySelectorAll('[data-community-compose]').forEach(control=>control.onclick=()=>{
  showDialog('<form class="community-form" id="community-draft-form"><h2>สร้างโพสต์</h2><label for="community-draft-title">หัวข้อ</label><input id="community-draft-title" maxlength="120"><label for="community-draft-body">เนื้อหา</label><textarea id="community-draft-body" maxlength="2000"></textarea><button type="submit" class="community-form-save">บันทึกแบบร่าง</button></form>');
  byId('community-draft-title').value=draft.title;byId('community-draft-body').value=draft.body;byId('community-draft-form').onsubmit=event=>{event.preventDefault();draft={title:byId('community-draft-title').value,body:byId('community-draft-body').value};byId('dialog').close();toast('บันทึกแบบร่างแล้ว')};
 });
 paintFeed();paintProfile();
})();
