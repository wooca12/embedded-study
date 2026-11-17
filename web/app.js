'use strict';
const $=s=>document.querySelector(s);
const KEY='embedded-study-day1-v1';
const lessons=window.STUDY_CURRICULUM;
const topicCount=lessons.length;
const empty=()=>({done:[],ratings:{},labnote:'',blog:'',github:'',velog:'',chatTurns:[],conceptNotes:[],archiveNotes:[],archivedChatTurns:[],curriculumVersion:3});
let state=empty();
try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&typeof saved==='object')state={...state,...saved,curriculumVersion:saved.curriculumVersion||1};}catch{}
if(!Array.isArray(state.done))state.done=[];
if(!state.ratings||typeof state.ratings!=='object')state.ratings={};
for(const k of ['labnote','blog','github','velog'])if(typeof state[k]!=='string')state[k]='';
function recordLimit(s){return s.curriculumVersion===3?lessons.length:s.curriculumVersion===2?12:6;}
function validateExtras(s){
  for(const key of ['chatTurns','conceptNotes'])if(s[key]!==undefined&&!Array.isArray(s[key]))throw Error('기록 형식 오류');
  for(const t of s.chatTurns||[]){if(!t||typeof t.id!=='string'||!Number.isInteger(t.lesson)||t.lesson<0||t.lesson>=recordLimit(s)||typeof t.question!=='string'||typeof t.answer!=='string'||typeof t.createdAt!=='string'||(t.error!==undefined&&typeof t.error!=='string'))throw Error('질문 기록 오류');}
  for(const n of s.conceptNotes||[]){if(!n||typeof n.id!=='string'||typeof n.turnId!=='string'||!Number.isInteger(n.lesson)||n.lesson<0||n.lesson>=recordLimit(s)||typeof n.question!=='string'||typeof n.summary!=='string'||typeof n.createdAt!=='string')throw Error('개념 기록 오류');}
}
try{validateExtras(state);}catch{state.chatTurns=[];state.conceptNotes=[];}
state.chatTurns=state.chatTurns||[];state.conceptNotes=state.conceptNotes||[];
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{status('저장 공간을 사용할 수 없어요. 전체 학습 기록을 내려받아 보관해주세요.');}}
function status(t){$('#status').textContent=t;}

function migrateCurriculum(s){
  if(s.curriculumVersion===3)return s;
  if(s.curriculumVersion!==2){
    const first=[0,10,11,6,11,5];
    s.chatTurns=(s.chatTurns||[]).map(t=>({...t,lesson:first[t.lesson]??t.lesson}));
    s.conceptNotes=(s.conceptNotes||[]).map(n=>({...n,lesson:first[n.lesson]??n.lesson}));
  }
  const previousTitles=["임베디드 Firmware 개요", "STM32 개발환경 · MCU와 ST-LINK", "초기 설정 ① · 디지털 신호와 Clock", "초기 설정 ② · PIN 역할과 Startup", "CubeIDE로 프로젝트 생성하기", "GPIO LED · 첫 출력과 코드 따라가기", "Switch Polling · 버튼으로 LED 제어", "UART · 보드와 PC가 데이터 주고받기", "printf · scanf를 UART에 연결하기", "도전 과제 · 외부 LED·PWM·버튼·UART", "보충 · C 포인터와 비트 연산", "보충 · MMIO와 GPIO 레지스터"];
  const mapping=[0,0,4,3,4,5,6,null,null,null,1,2];
  s.archiveNotes=Array.isArray(s.archiveNotes)?s.archiveNotes:[];
  s.archivedChatTurns=Array.isArray(s.archivedChatTurns)?s.archivedChatTurns:[];
  const transfer=(records,archive)=>records.flatMap(n=>{const target=mapping[n.lesson];if(target===null||target===undefined){archive.push({...n,sourceTopic:previousTitles[n.lesson]||'이전 학습'});return [];}return [{...n,lesson:target}];});
  s.conceptNotes=transfer(s.conceptNotes||[],s.archiveNotes);
  s.chatTurns=transfer(s.chatTurns||[],s.archivedChatTurns);
  s.done=[];s.ratings={};s.curriculumVersion=3;return s;
}
const curriculumChanged=state.curriculumVersion!==3;
state=migrateCurriculum(state);
if(curriculumChanged){const notice=document.createElement('p');notice.className='notice';notice.textContent='오늘 주제에 맞춰 예습 진도와 복습 평가는 새로 시작해요. 기존 개인 정리는 관련 개념에 유지하며, 범위 밖의 정리는 블로그 정리 아래 보관합니다.';$('#lessons').before(notice);}

function progress(){const n=lessons.filter((_,i)=>state.done.includes(i)).length;$('#progress').max=topicCount;$('#progress').value=n;$('#progress-label').textContent=`오늘의 예습 ${n}/${topicCount} · ${Math.round(n/topicCount*100)}%`;}

lessons.forEach((l,i)=>{const a=document.createElement('article');a.className='lesson';a.id='lesson-'+i;a.dataset.kind=l.kind;a.innerHTML=`<p class="eyebrow">TODAY / STEP ${String(i+1).padStart(2,'0')}</p><h3>${l.title}</h3><p class="lesson-goal">${l.goal}</p>${l.body}<details class="lesson-source"><summary>참고 자료</summary><p>${l.pages}</p></details><fieldset><legend>기초 확인 · ${l.q}</legend>${l.opts.map((o,j)=>`<label class="choice"><input type="radio" name="q${i}" value="${j}"> ${o}</label>`).join('')}</fieldset><p class="feedback" aria-live="polite"></p><label class="complete"><input type="checkbox" ${state.done.includes(i)?'checked':''}>읽고 기초 질문을 확인했어요</label>`;a.querySelectorAll('input[type=radio]').forEach(r=>r.addEventListener('change',()=>{a.querySelector('.feedback').textContent=(Number(r.value)===l.correct?'맞았어요. ':'다시 연결해봐요. ')+l.why;}));a.querySelector('input[type=checkbox]').addEventListener('change',e=>{state.done=state.done.filter(x=>x!==i);if(e.target.checked)state.done.push(i);save();progress();});$('#lessons').append(a);});progress();
let odr=0;function sim(){const bits=$('#bits');bits.replaceChildren();for(let i=7;i>=0;i--){const b=document.createElement('button');b.className=(odr&(1<<i))?'on':'';b.innerHTML=`<small>${i}</small>${odr>>i&1}`;b.setAttribute('aria-label',`${i}번 비트 ${odr>>i&1}, 누르면 반전`);b.setAttribute('aria-pressed',String(Boolean(odr&(1<<i))));b.onclick=()=>{odr^=1<<i;sim();};bits.append(b);}$('#register').textContent=`ODR = 0x${odr.toString(16).padStart(2,'0').toUpperCase()}`;const on=Boolean(odr&32);$('#led').classList.toggle('on',on);$('#led-label').textContent=on?'LD2 켜짐':'LD2 꺼짐';}sim();$('#set').onclick=()=>{odr|=32;sim();};$('#reset').onclick=()=>{odr&=~32;sim();};$('#toggle').onclick=()=>{odr^=32;sim();};
const reviews=lessons.map(l=>[l.q,l.why]);
let weak=false;function renderReviews(){$('#review-list').replaceChildren();let count=0;reviews.forEach(([q,a],i)=>{if(weak&&!['애매함','모름'].includes(state.ratings[i]))return;count++;const el=document.createElement('article');el.innerHTML=`<h3>${q}</h3><details><summary>설명한 뒤 해설 보기</summary><p>${a}</p></details><div class="actions rating">${['설명 가능','애매함','모름'].map(r=>`<button class="${state.ratings[i]===r?'selected':''}" aria-pressed="${state.ratings[i]===r}">${r}</button>`).join('')}</div>`;el.querySelectorAll('.rating button').forEach(b=>b.onclick=()=>{state.ratings[i]=b.textContent;save();renderReviews();});$('#review-list').append(el);});if(!count)$('#review-list').textContent='아직 애매함·모름으로 표시한 질문이 없어요. 전체 질문에서 먼저 답해보세요.';}renderReviews();$('#weak-review').onclick=()=>{weak=true;renderReviews();};$('#all-review').onclick=()=>{weak=false;renderReviews();};
let remaining=180,clock=null;function time(){$('#time').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;}function stop(){clearInterval(clock);clock=null;$('#timer').textContent='타이머 시작';}$('#draw').onclick=()=>{stop();remaining=180;time();$('#topic').textContent=reviews[Math.floor(Math.random()*reviews.length)][0];};$('#timer').onclick=()=>{if(clock){stop();$('#timer').textContent='이어서 시작';return;}if(remaining===0)remaining=180;$('#timer').textContent='일시 정지';clock=setInterval(()=>{remaining--;time();if(remaining<=0){stop();$('#timer').textContent='다시 시작';}},1000);};
const template='# 코드가 LED를 켜기까지: MMIO와 GPIO\n\n## 이번에 배운 것\n\n내 말로 설명해보세요.\n\n## MMIO와 GPIO를 처음 배우는 사람에게 설명한다면\n\n## 실습 환경\n- 보드: NUCLEO-F103RB\n- IDE 버전: \n- macOS 버전: \n\n## 예상과 실제 실행 결과\n\n## 막힌 점과 해결 과정\n\n## 아직 궁금한 점\n\n## 실습 코드\nGitHub 링크:\n\n## 참고한 공개 문서\n- ST RM0008\n- ST UM1724\n';
for(const id of ['labnote','blog','github','velog']){const el=$('#'+id);el.value=state[id]||(id==='blog'?template:'');el.addEventListener('input',()=>{state[id]=el.value;save();});}
function download(name,text,type){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#download-blog').onclick=()=>{download('day01-mmio-gpio.md',$('#blog').value,'text/markdown;charset=utf-8');status('글 원본을 내려받았어요. GitHub의 studies/01-mmio-gpio/blog.md로 보관하세요.');};$('#copy-blog').onclick=async()=>{try{await navigator.clipboard.writeText($('#blog').value);status('복사했어요. Velog 편집기에 붙여 넣고 이미지·코드 표시를 확인하세요.');}catch{status('복사 권한이 없어요. 글을 직접 선택해 복사하거나 .md 파일을 내려받으세요.');}};$('#export').onclick=()=>{download('embedded-study-day1.json',JSON.stringify({...state,blog:$('#blog').value},null,2),'application/json');status('학습 기록을 백업했어요.');};$('#import').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const s=JSON.parse(await file.text());if(!Array.isArray(s.done)||!s.done.every(i=>Number.isInteger(i)&&i>=0&&i<recordLimit(s))||!s.ratings||typeof s.ratings!=='object'||Array.isArray(s.ratings))throw Error();for(const k of ['labnote','blog','github','velog'])if(typeof s[k]!=='string')throw Error();for(const [k,v]of Object.entries(s.ratings))if(!/^\d+$/.test(k)||Number(k)>=recordLimit(s)||!['설명 가능','애매함','모름'].includes(v))throw Error();validateExtras(s);state={done:s.done,ratings:s.ratings,labnote:s.labnote,blog:s.blog,github:s.github,velog:s.velog,chatTurns:s.chatTurns||[],conceptNotes:s.conceptNotes||[],archiveNotes:Array.isArray(s.archiveNotes)?s.archiveNotes:[],archivedChatTurns:Array.isArray(s.archivedChatTurns)?s.archivedChatTurns:[],curriculumVersion:s.curriculumVersion};state=migrateCurriculum(state);save();location.reload();}catch{status('이 학습 도구에서 내보낸 올바른 JSON 백업 파일을 선택해주세요.');}e.target.value='';};
const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id));}},{rootMargin:'-10% 0px -70% 0px'});document.querySelectorAll('main>section[id]').forEach(s=>observer.observe(s));

const contents=document.createElement('div');contents.className='curriculum-index';
contents.innerHTML='<h3>오늘의 학습 순서</h3><p class="muted">왜 동작하는지 이해한 뒤 직접 바꿔보고 설명해요. 그림과 PDF는 필요한 부분에서 참고합니다.</p>';
lessons.forEach((l,i)=>{const link=document.createElement('a');link.href='#lesson-'+i;link.textContent=String(i+1).padStart(2,'0')+' · '+l.title;contents.append(link);});
$('#lessons').before(contents);
