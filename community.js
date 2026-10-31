/* Local community demo based on the supplied screenshots. No remote social writes. */
(()=>{
 const byId=id=>document.getElementById(id),shell=document.querySelector('.app-shell');
 const posts=[
  {id:'guidelines',author:'INKBIRD',official:true,date:'04/08',title:'INKBIRD Community Guidelines',intro:'Welcome to the INKBIRD Community!',body:'We are delighted to have you join our community and explore the endless possibilities of precision cooking. Share your experiences, ask questions, and connect with fellow INKBIRD users.',thaiIntro:'ยินดีต้อนรับสู่ชุมชน INKBIRD!',thaiBody:'เรายินดีต้อนรับคุณสู่ชุมชน เพื่อร่วมสำรวจความเป็นไปได้ของการทำอาหารอย่างแม่นยำ แบ่งปันประสบการณ์ ตั้งคำถาม และพูดคุยกับผู้ใช้ INKBIRD คนอื่น ๆ',likes:38,comments:13,categories:['all','controllers','thermo']},
  {id:'thermometer',author:'InkbirdUser_1221e432338d',official:false,date:'3 ชั่วโมงที่แล้ว',title:'termometro int 11l-b',intro:'',body:'ho comprato questo da due giorni e non sono ancora riuscito ad effettuare una misurazione, la base indica tre linee e non misura niente. Inoltre, la sonda si collega ma non mostra la temperatura.',thaiIntro:'',thaiBody:'ซื้อมาได้สองวันแล้ว แต่ยังวัดค่าไม่ได้ ฐานแสดงขีดสามขีดและไม่แสดงค่าที่วัด นอกจากนี้ โพรบเชื่อมต่อแล้วแต่ยังไม่แสดงอุณหภูมิ',likes:0,comments:0,categories:['all','thermo']}
 ];
 const liked=new Set(),saved=new Set();let mode='feed',category='all',profileTab='posts';
 let profileName='InkbirdUser_6043c19eff74',profileBio='แนะนำตัวคุณเอง',draft={title:'',body:'',category:'',imageUrl:''};
 function icon(name){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),use=document.createElementNS('http://www.w3.org/2000/svg','use');svg.setAttribute('aria-hidden','true');use.setAttribute('href','#'+name);svg.append(use);return svg}
 function button(text,className){const element=document.createElement('button');element.className=className;element.textContent=text;return element}
 function updateLikeButtons(post){document.querySelectorAll('.community-post[data-post-id="'+post.id+'"] .community-like').forEach(control=>{control.setAttribute('aria-pressed',String(liked.has(post.id)));control.querySelector('span').textContent=post.likes+(liked.has(post.id)?1:0)||''})}
 function openPost(post){
  showDialog('<div class="community-post-detail"><h2></h2><p></p><button class="community-save-post"></button></div>');
  const detail=document.querySelector('.community-post-detail');detail.querySelector('h2').textContent=post.title;detail.querySelector('p').textContent=[post.intro,post.body].filter(Boolean).join('\n\n');
  if(post.imageUrl){const image=document.createElement('img');image.src=post.imageUrl;image.alt='รูปประกอบโพสต์';image.className='community-post-detail-image';detail.querySelector('h2').after(image)}
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
  footer.append(translate,like,comment);article.append(author,title,intro,body);if(post.imageUrl){const image=document.createElement('img');image.src=post.imageUrl;image.alt='รูปประกอบโพสต์';image.className='community-post-attached-image';article.append(image)}article.append(more,footer);return article;
 }
 function paintFeed(){
  const query=byId('community-feed-search').value.trim().toLocaleLowerCase();let list=posts.filter(post=>post.categories.includes(category)&&(!query||[post.author,post.title,post.body].join(' ').toLocaleLowerCase().includes(query)));
  if(byId('community-sort').value==='latest')list=[...list].sort((a,b)=>(b.createdAt||posts.indexOf(b))-(a.createdAt||posts.indexOf(a)));
  const container=byId('community-posts');container.replaceChildren(...list.map(makePost));
  if(!list.length){const empty=document.createElement('p');empty.className='community-no-results';empty.textContent='ไม่พบโพสต์ที่ค้นหา';container.append(empty)}
 }
 const emptyMessages={posts:'คุณยังไม่ได้แชร์โพสต์ใด ๆ',comments:'คุณยังไม่ได้แสดงความคิดเห็นในโพสต์ใด ๆ',likes:'คุณยังไม่ได้ถูกใจโพสต์ใด ๆ',saved:'คุณยังไม่ได้บันทึกโพสต์ใด ๆ'};
 function paintProfile(){
  const list=posts.filter(post=>profileTab==='posts'?post.owned===true:profileTab==='likes'?liked.has(post.id):profileTab==='saved'?saved.has(post.id):false);
  const results=byId('community-profile-results');results.replaceChildren();results.dataset.empty=String(!list.length);
  if(list.length)results.append(...list.map(makePost));
  else{const image=document.createElement('img');image.src='assets/community-empty.svg';image.alt='';image.className='community-empty-image';const text=document.createElement('p');text.className='community-empty-message';text.textContent=emptyMessages[profileTab];results.append(image,text)}
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
 byId('community-feed-search').addEventListener('input',paintFeed);byId('community-sort').onchange=paintFeed;
 document.querySelector('.community-category-menu').onclick=()=>{showDialog('<h2>หมวดชุมชน</h2><div id="community-category-choices"></div>');document.querySelectorAll('[data-community-category]').forEach(tab=>{const choice=button(tab.textContent.trim(),'choice');choice.onclick=()=>{byId('dialog').close();selectCategory(tab)};byId('community-category-choices').append(choice)})};
 const searchPage=byId('community-search-page'),searchInput=byId('community-profile-search');
 let searchPreviousTitle='lNKBlRD';
 function openProfileSearch(pushHistory=true){
  if(searchPage.open){searchInput.focus({preventScroll:true});return}
  if(byId('community-page').hidden)document.querySelector('[data-nav=community]').click();
  if(byId('community-profile-panel').hidden)selectMode(byId('community-profile-tab'));
  if(pushHistory&&location.hash!=='#community-search')history.pushState({communitySearch:true},'',location.pathname+location.search+'#community-search');
  searchPreviousTitle=document.title;document.title='ค้นหา — lNKBlRD';
  searchInput.value='';searchPage.showModal();document.body.classList.add('community-search-open');byId('community-profile-search-toggle').setAttribute('aria-expanded','true');
  searchInput.focus({preventScroll:true});
 }
 function closeProfileSearch(){if(searchPage.open)searchPage.close()}
 byId('community-profile-search-toggle').onclick=()=>openProfileSearch();
 byId('community-search-cancel').onclick=closeProfileSearch;
 byId('community-search-form').onsubmit=event=>{event.preventDefault();searchInput.blur()};
 searchPage.addEventListener('close',()=>{
  searchInput.blur();searchInput.value='';document.body.classList.remove('community-search-open');byId('community-profile-search-toggle').setAttribute('aria-expanded','false');document.title=searchPreviousTitle;
  if(location.hash==='#community-search')history.back();
  byId('community-profile-search-toggle').focus({preventScroll:true});
 });
 window.addEventListener('popstate',()=>{if(location.hash==='#community-search')openProfileSearch(false);else closeProfileSearch()});
 if(location.hash==='#community-search')openProfileSearch(false);
 const personalPage=byId('personal-info-page');let personalPreviousTitle='lNKBlRD';
 function syncPersonalInfo(){const name=document.querySelector('.profile-name').textContent;byId('personal-info-name').textContent=name;byId('personal-info-bio').textContent=profileBio}
 function openPersonalInfo(pushHistory=true){
  if(personalPage.open)return;
  if(byId('community-page').hidden)document.querySelector('[data-nav=community]').click();
  if(byId('community-profile-panel').hidden)selectMode(byId('community-profile-tab'));
  if(pushHistory&&location.hash!=='#personal-info')history.pushState({personalInfo:true},'',location.pathname+location.search+'#personal-info');
  syncPersonalInfo();personalPreviousTitle=document.title;document.title='ข้อมูลส่วนบุคคล — lNKBlRD';personalPage.showModal();personalPage.querySelector('.personal-info-scroll').scrollTop=0;document.body.classList.add('personal-info-open');byId('community-edit-profile').setAttribute('aria-expanded','true');byId('personal-info-back').focus({preventScroll:true});
 }
 function closePersonalInfo(){if(personalPage.open){if(byId('dialog').open)byId('dialog').close();personalPage.close()}}
 byId('community-edit-profile').onclick=()=>openPersonalInfo();
 byId('personal-info-back').onclick=closePersonalInfo;
 personalPage.addEventListener('close',()=>{document.body.classList.remove('personal-info-open');document.title=personalPreviousTitle;byId('community-edit-profile').setAttribute('aria-expanded','false');if(location.hash==='#personal-info')history.back();byId('community-edit-profile').focus({preventScroll:true})});
 window.addEventListener('popstate',()=>{if(location.hash==='#personal-info')openPersonalInfo(false);else closePersonalInfo()});
 if(location.hash==='#personal-info')openPersonalInfo(false);
 document.querySelectorAll('[data-personal-field]').forEach(control=>control.onclick=()=>{
  const field=control.dataset.personalField;
  if(field==='name'||field==='bio'){
   const name=field==='name';showDialog('<form class="community-form" id="personal-field-form"><h2></h2><label for="personal-field-input"></label>'+(name?'<input id="personal-field-input" maxlength="40" autocomplete="nickname">':'<textarea id="personal-field-input" maxlength="240"></textarea>')+'<button type="submit" class="community-form-save">บันทึก</button></form>');
   const form=byId('personal-field-form'),input=byId('personal-field-input');form.querySelector('h2').textContent=name?'ชื่อ':'แนะนำตัวสั้นๆ';form.querySelector('label').textContent=name?'ชื่อ':'แนะนำตัวคุณเอง';
   input.value=name?(byId('personal-info-name').textContent==='แตะเพื่อตั้งชื่อของคุณ'?'':byId('personal-info-name').textContent):(profileBio==='แนะนำตัวคุณเอง'?'':profileBio);
   form.onsubmit=event=>{event.preventDefault();const value=input.value.trim();if(name){profileName=value||'InkbirdUser_6043c19eff74';byId('community-profile-name').textContent=profileName;document.querySelectorAll('.profile-name').forEach(element=>element.textContent=value||'แตะเพื่อตั้งชื่อของคุณ')}else{profileBio=value||'แนะนำตัวคุณเอง';byId('community-profile-bio').textContent=profileBio}syncPersonalInfo();byId('dialog').close()};input.focus();
  }else if(field==='avatar')showDialog('<h2>รูปประจำตัว</h2><img class="personal-field-preview" src="assets/avatar.svg" alt="รูปประจำตัว">');
  else if(field==='background')showDialog('<h2>รูปพื้นหลัง</h2><span class="personal-background-preview" aria-label="รูปพื้นหลังสีครีม"></span>');
  else if(field==='timezone')showDialog('<h2>เขตเวลา</h2><p>Asia/Bangkok ✓</p>');
  else showDialog('<h2>เชื่อมโยงอีเมล</h2><p>เชื่อมต่อที่อยู่อีเมลกับบัญชีของคุณ</p>');
 });
 const composePage=byId('community-compose-page');let composePreviousTitle='lNKBlRD',composeOpener=null,imageAttempt=0;
 function syncComposer(){
  byId('community-draft-title').value=draft.title;byId('community-draft-body').value=draft.body;
  byId('community-title-placeholder').hidden=Boolean(draft.title);
  const selected=document.querySelector('[data-community-category="'+draft.category+'"]');byId('community-post-category-value').textContent=selected?selected.textContent.trim():'';
  const image=byId('community-post-image-preview');image.hidden=!draft.imageUrl;if(draft.imageUrl)image.src=draft.imageUrl;else image.removeAttribute('src');
 }
 function openComposer(pushHistory=true){
  if(composePage.open)return;
  if(byId('community-page').hidden)document.querySelector('[data-nav=community]').click();
  if(pushHistory&&location.hash!=='#create-post')history.pushState({createPost:true},'',location.pathname+location.search+'#create-post');
  syncComposer();composePreviousTitle=document.title;document.title='สร้างโพสต์ — lNKBlRD';composePage.showModal();composePage.querySelector('.community-compose-scroll').scrollTop=0;document.body.classList.add('community-composer-open');byId('community-compose-back').focus({preventScroll:true});
 }
 function closeComposer(){if(composePage.open){if(byId('dialog').open)byId('dialog').close();composePage.close()}}
 document.querySelectorAll('[data-community-compose]').forEach(control=>control.onclick=()=>{composeOpener=control;openComposer()});
 byId('community-compose-back').onclick=closeComposer;
 composePage.addEventListener('close',()=>{draft.title=byId('community-draft-title').value;draft.body=byId('community-draft-body').value;document.body.classList.remove('community-composer-open');document.title=composePreviousTitle;if(location.hash==='#create-post')history.back();const opener=composeOpener&&composeOpener.offsetParent!==null?composeOpener:document.querySelector('.community-add');opener.focus({preventScroll:true})});
 window.addEventListener('popstate',()=>{if(location.hash==='#create-post')openComposer(false);else closeComposer()});
 byId('community-draft-title').addEventListener('input',()=>{byId('community-title-placeholder').hidden=Boolean(byId('community-draft-title').value)});
 byId('community-post-category').onclick=()=>{
  showDialog('<h2>เลือกหมวดหมู่</h2><div id="community-compose-categories"></div>');
  document.querySelectorAll('[data-community-category]').forEach(tab=>{const choice=button(tab.textContent.trim(),'choice');choice.onclick=()=>{draft.category=tab.dataset.communityCategory;byId('community-post-category-value').textContent=tab.textContent.trim();byId('dialog').close()};byId('community-compose-categories').append(choice)});
 };
 byId('community-post-image').onchange=async event=>{
  const file=event.target.files?.[0];if(!file)return;
  if(!file.type.startsWith('image/')){event.target.value='';toast('กรุณาเลือกรูปภาพ');return}
  const attempt=++imageAttempt;byId('community-post-submit').disabled=true;const imageUrl=URL.createObjectURL(file),image=new Image();image.src=imageUrl;
  try{await image.decode();if(attempt!==imageAttempt){URL.revokeObjectURL(imageUrl);return}if(draft.imageUrl)URL.revokeObjectURL(draft.imageUrl);draft.imageUrl=imageUrl;const preview=byId('community-post-image-preview');preview.src=imageUrl;preview.hidden=false}catch{URL.revokeObjectURL(imageUrl);if(attempt===imageAttempt)toast('ไม่สามารถเปิดรูปภาพนี้ได้')}finally{if(attempt===imageAttempt)byId('community-post-submit').disabled=false}
 };
 byId('community-compose-form').onsubmit=event=>{
  event.preventDefault();const title=byId('community-draft-title').value.trim(),body=byId('community-draft-body').value.trim();
  if(!title){toast('กรุณาป้อนหัวข้อ');byId('community-draft-title').focus();return}
  if(!draft.category){toast('กรุณาเลือกหมวดหมู่');byId('community-post-category').focus();return}
  const createdAt=Date.now();posts.unshift({id:'local-'+createdAt+'-'+posts.length,author:profileName,official:false,owned:true,date:'เมื่อสักครู่',title,intro:'',body,thaiIntro:'',thaiBody:body,likes:0,comments:0,categories:draft.category==='all'?['all']:['all',draft.category],createdAt,imageUrl:draft.imageUrl});
  draft={title:'',body:'',category:'',imageUrl:''};byId('community-post-image').value='';syncComposer();closeComposer();selectMode(byId('community-profile-tab'));selectProfileTab(byId('community-posts-tab'));paintFeed();toast('สร้างโพสต์ในตัวอย่างแล้ว');
 };
 if(location.hash==='#create-post')openComposer(false);
 paintFeed();paintProfile();
})();
