const $=id=>document.getElementById(id);
const flow=(items)=>items.map(([icon,label,title,visual,kind='skill'])=>({icon,label,title,visual,kind}));
const recipes=[
  {name:'볶음밥',full:'고슬고슬 황금 볶음밥',copy:'알알이 고소한 한 접시!',ingredients:['🥕 당근','🧅 양파','🫑 피망','🥩 고기'],flow:flow([['🔪','썰기','채소를 빠르게 다져요!','🥕'],['🍳','뒤집기','팬을 힘차게 뒤집어요!','🍚'],['🥚','계란','노른자를 톡 깨뜨려요','🥚','egg'],['🍚','볶기','밥알을 고슬고슬 볶아요!','🍚'],['✨','고명','파와 깨로 마무리해요','✨']])},
  {name:'스테이크',full:'지글지글 갈릭 스테이크',copy:'육즙 가득, 노릇하게!',ingredients:['🥩 소고기','🧄 마늘','🥦 브로콜리','🧂 소금'],flow:flow([['🔪','손질','곁들임 채소를 손질해요!','🥦'],['🧂','간하기','소금을 딱 맞게 뿌려요!','🧂'],['🔥','불 조절','팬 온도를 알맞게 맞춰요','🔥'],['🥩','굽기','스페이스바로 스테이크를 뒤집어요!','🥩'],['🥣','소스','스테이크 소스를 그려요','🥣']])},
  {name:'떡볶이',full:'매콤달콤 떡볶이',copy:'쫀득한 떡에 양념 듬뿍!',ingredients:['🍥 떡','🌶️ 고추장','🥬 양배추','🥚 달걀'],flow:flow([['🔪','썰기','양배추를 빠르게 썰어요!','🥬'],['🌶️','양념','양념을 딱 맞게 넣어요!','🌶️'],['🫧','끓이기','보글보글 농도를 맞춰요','🫧'],['🥄','젓기','스페이스바로 골고루 저어요!','🍥'],['✨','꾸미기','마지막 고명을 올려요','✨']])},
  {name:'파스타',full:'향긋한 토마토 파스타',copy:'소스가 면에 돌돌!',ingredients:['🍅 토마토','🧄 마늘','🍝 면','🌿 바질'],flow:flow([['🔪','손질','토마토와 마늘을 손질해요!','🍅'],['💧','물 맞추기','냄비 물을 알맞게 맞춰요!','💧'],['⏱️','면 삶기','면의 익힘을 딱 맞춰요','🍝'],['🍳','팬 토스','스페이스바로 면을 토스해요!','🍝'],['🥣','소스','토마토 소스로 마무리해요','🍅']])},
  {name:'카레',full:'포근포근 카레라이스',copy:'향긋하고 부드러운 한 그릇!',ingredients:['🥔 감자','🥕 당근','🧅 양파','🍛 카레'],flow:flow([['🔪','깍둑썰기','채소를 빠르게 깍둑썰기!','🥔'],['🟤','카레 넣기','카레 가루를 딱 맞게 넣어요!','🟤'],['🫧','푹 끓이기','부드러운 농도를 맞춰요','🫧'],['🥄','저어주기','스페이스바로 눌지 않게 저어요!','🥄'],['🍚','담기','밥 위에 예쁘게 담아요','🍚']])},
  {name:'라멘',full:'보글보글 달걀 라멘',copy:'따끈한 국물에 면발 후루룩!',ingredients:['🍜 면','🥚 달걀','🥬 파','🍥 어묵'],flow:flow([['🔪','고명 썰기','파와 어묵을 빠르게 썰어요!','🥬'],['💧','물 끓이기','물을 딱 맞게 끓여요!','💧'],['🥚','계란','반숙 계란을 톡 넣어요','🥚','egg'],['🍜','면 풀기','스페이스바로 면을 풀어요!','🍜'],['✨','고명','고명을 자유롭게 올려요','🍥']])},
  {name:'팬케이크',full:'폭신폭신 베리 팬케이크',copy:'달콤한 시럽이 사르르!',ingredients:['🍓 딸기','🥚 달걀','🥛 우유','🥞 반죽'],flow:flow([['🔪','과일 썰기','딸기를 빠르게 손질해요!','🍓'],['🥣','반죽 붓기','반죽을 동그랗게 부어요!','🥣'],['🥚','계란','계란을 부드럽게 톡!','🥚','egg'],['🥞','뒤집기','스페이스바로 팬케이크를 뒤집어요!','🥞'],['🍯','시럽','시럽으로 달콤하게 그려요','🍯']])},
  {name:'돈가스',full:'바삭바삭 돈가스',copy:'겉은 바삭, 속은 촉촉!',ingredients:['🥩 돼지고기','🥬 양배추','🍞 빵가루','🥚 달걀'],flow:flow([['🔪','채썰기','양배추를 빠르게 채 썰어요!','🥬'],['🍞','빵가루','빵가루를 고르게 입혀요!','🍞'],['🔥','기름 온도','튀김 온도를 딱 맞춰요','🔥'],['🥢','튀기기','스페이스바로 노릇하게 튀겨요!','🥩'],['🥣','소스','돈가스 소스를 그려요','🥣']])},
  {name:'우동',full:'따끈따끈 유부 우동',copy:'쫄깃한 면발과 깊은 국물!',ingredients:['🍜 우동면','🧅 대파','🍥 어묵','🥢 유부'],flow:flow([['🔪','고명 썰기','대파와 어묵을 썰어요!','🧅'],['💧','육수 우리기','육수를 깊고 맑게 우려요!','💧'],['🍜','면 삶기','우동면을 쫄깃하게 삶아요','🍜'],['🥄','면 풀기','면발을 부드럽게 풀어요!','🍜'],['✨','고명','대파와 유부를 올려요','✨']])}
];
// Every recipe uses the same scene and motion vocabulary, including preparation and plating.
const motionPlans=[
  ['cut:chop','pan:toss','egg:crack','cook:toss','finish:draw'],
  ['cut:chop','action:season','heat:heat','cook:sear','finish:draw'],
  ['cut:chop','action:sauce','heat:simmer','cook:stir','finish:sprinkle'],
  ['cut:chop','water:fill','noodles:boil','cook:toss','finish:sprinkle'],
  ['cut:chop','action:powder','heat:simmer','cook:stir','finish:ladle'],
  ['cut:chop','water:fill','egg:crack','cook:separate','finish:sprinkle'],
  ['cut:chop','action:pour','egg:crack','cook:flip','finish:draw'],
  ['cut:chop','action:coat','heat:heat','cook:fry','finish:draw'],
  ['cut:chop','broth:broth','noodles:boil','cook:separate','finish:sprinkle']
];
recipes.forEach((recipe,index)=>recipe.flow.forEach((step,stageIndex)=>{
  const [scene,action,visual]=motionPlans[index][stageIndex].split(':');
  step.motion={scene,action,visual:visual||step.visual};
}));
const riceGarnish=recipes[0].flow[4];
Object.assign(riceGarnish,{icon:'🍅',label:'케첩',title:'완성된 볶음밥 위에 케첩을 뿌려요',visual:'🍅',motion:{scene:'finish',action:'draw',visual:'ketchup'}});
const riceIngredientVisual={carrot:'🥕',onion:'🧅',pepper:'🫑',meat:'🥩'};
recipes[0].flow=[...window.CookingPlans[0].steps.map(step=>({icon:'',label:step.label,title:step.instruction,visual:riceIngredientVisual[step.ingredient]||'🍚',kind:'skill'})),riceGarnish];
const curryIngredientVisual={carrot:'🥕',onion:'🧅',potato:'🥔'};
recipes[4].flow=window.CookingPlans[4].steps.map(step=>({icon:'',label:step.label,title:step.instruction,visual:curryIngredientVisual[step.ingredient]||'🍛',kind:'skill'}));
const pancakeTest=window.COOKING_RECIPE_DATA.pancakeTest;
window.CookingPlans[6]={...window.CookingPlans[6],id:pancakeTest.id,hasFreeGarnish:pancakeTest.hasFreeGarnish,steps:pancakeTest.steps};
recipes[6].ingredients=pancakeTest.ingredients;
recipes[6].flow=[...pancakeTest.steps.map(step=>({icon:({TIMING:'🥚',HOLD_AMOUNT:'🥣',STIR:'🥄',COOK_TIMING:'🔥',FLIP:'🍳',POINTER_DRAW:'🍯'})[step.interaction],label:step.label,title:step.instruction,visual:step.ingredient,kind:'skill',motion:{scene:'interactive',action:step.animation,visual:step.ingredient}})),{icon:'🥞',label:'완성',title:'시럽과 과일을 얹어 팬케이크를 완성해요!',kind:'result'}];
// Each recipe supplies its own number of cooking steps, followed by free plating.
const cookingIcons={CUT:'🔪',ADD:'🥣',COAT:'🍞',PLACE:'🥘',POUR:'🫗',STIR:'🥄',COOK_TIMING:'🫧',FRY:'🍳',GRILL:'🔥',BOIL:'🫧',FLIP:'🍳',TOSS:'🍳',SEASON:'🧂',TOPPING:'✨',BAKE:'♨️'};
recipes.forEach((recipe,index)=>{if(index===6)return;window.CookingPlans[index].steps.forEach((plan,stepIndex)=>{
  Object.assign(recipe.flow[stepIndex],{icon:cookingIcons[plan.action],label:plan.label,title:plan.instruction,motion:{scene:'interactive',action:plan.action.toLowerCase(),visual:recipe.flow[stepIndex].visual}});
})});
recipes[1].flow=window.CookingPlans[1].steps.map(step=>({icon:step.action==='COOK_TIMING'?'🔥':cookingIcons[step.action]||'🥩',label:step.label,title:step.instruction,visual:'🥩',kind:'skill',motion:{scene:'interactive',action:step.action.toLowerCase(),visual:'🥩'}}));
recipes[5].ingredients=['🍖 돼지뼈','🍶 간장','🧂 후추','🍜 라멘면'];
recipes[5].flow=[...window.CookingPlans[5].steps.map((step,i)=>({icon:['🍲','🔥','🍜','🥢','🫗'][i],label:step.label,title:step.instruction,visual:step.ingredient,kind:'skill',motion:{scene:'interactive',action:step.action.toLowerCase(),visual:step.ingredient}})),{icon:'✨',label:'고명',title:'원하는 고명을 올려 라멘을 완성해요',visual:'🍥',kind:'result'}];
recipes[7].flow.push({icon:'🥣',label:'소스',title:'돈가스 위에 소스를 직접 그려 마무리해요',visual:'🥣',kind:'result',motion:{scene:'finish',action:'draw',visual:'tonkatsu-sauce'}});
const defaultStepNavMarkup=$('steps').innerHTML;
const finishings=[
  {name:'케첩',button:'케첩 뿌리기',gesture:'완성된 볶음밥 위에 케첩을 뿌려요',feedback:'접시에 담긴 볶음밥 위를 따라 케첩을 뿌려보세요.',mode:'draw',colors:['#c92e25']},
  {name:'스테이크 소스',button:'소스 한 줄',gesture:'스테이크 위에 소스를 천천히 둘러요',feedback:'고기 결을 따라 스테이크 소스를 둘러주세요.',mode:'draw',colors:['#6b3f2a']},
  {name:'깨·파 고명',button:'고명 톡톡',gesture:'드래그하거나 눌러 깨와 파를 뿌려요',feedback:'떡볶이 위에 깨와 송송 썬 파를 골고루 올려요.',mode:'sprinkle',colors:['#fff2b5','#5fa95a']},
  {name:'바질·치즈',button:'고명 톡톡',gesture:'드래그하거나 눌러 바질과 치즈를 올려요',feedback:'파스타 위에 바질과 치즈를 가볍게 흩뿌려요.',mode:'sprinkle',colors:['#48975a','#fff1bd']},
  {name:'카레 담기',button:'카레 한 국자',gesture:'밥 옆으로 카레를 부드럽게 담아요',feedback:'밥 옆 빈 곳에 카레를 넉넉하게 담아주세요.',mode:'ladle',colors:['#c98228']},
  {name:'파·어묵 고명',button:'고명 톡톡',gesture:'드래그하거나 눌러 라멘 고명을 올려요',feedback:'라멘 위에 파와 어묵 고명을 보기 좋게 올려요.',mode:'sprinkle',colors:['#62a85e','#ef9d9a']},
  {name:'메이플 시럽',button:'시럽 한 줄',gesture:'팬케이크 위에 시럽을 천천히 둘러요',feedback:'팬케이크 위에 메이플 시럽을 달콤하게 그려보세요.',mode:'draw',colors:['#c6842d']},
  {name:'돈가스 소스',button:'소스 한 줄',gesture:'돈가스 위에 소스를 지그재그로 둘러요',feedback:'바삭한 돈가스 위에 전용 소스를 고르게 둘러주세요.',mode:'draw',colors:['#70402c']},
  {name:'파·유부 고명',button:'고명 톡톡',gesture:'우동 위에 파와 유부를 올려요',feedback:'따끈한 우동에 파와 유부를 올려주세요.',mode:'sprinkle',colors:['#62a85e','#f1d7a3']}
];
const ranks=[
  {grade:'S',min:170,title:'전설의 주방장',copy:'속도와 정확도, 마무리까지 완벽해요!'},
  {grade:'A',min:145,title:'수석 요리사',copy:'안정적인 손맛이 돋보이는 한 접시예요.'},
  {grade:'B',min:115,title:'든든한 요리사',copy:'조금만 더 다듬으면 최고의 맛이에요.'},
  {grade:'C',min:0,title:'새싹 요리사',copy:'다음 도전에서는 더 높은 랭크를 노려봐요!'}
];
const cutColors=['#e87835','#67a64d','#8ab95f','#e7584d','#d4a35b','#63a65b','#e85f6d','#8ab95f','#7eb56a'];
const recipeDifficulty=[1.08,1.16,1.1,1.12,1.18,1.1,1.14,1.16,1.05];
// 온도·농도 단계는 음식에 따라 '누르고 유지'하는 조리감도 섞어 둡니다.
[1,2,3,7].forEach(index=>{recipes[index].flow[2].kind='hold'});
recipes[4].flow[4].kind='hold';recipes[4].flow[6].kind='hold';
recipes[0].flow[3].kind='skill';recipes[3].flow[3].kind='skill';

let selected=0,stage=-1,round=0,score=0,stageScoreStart=0,phase=0,last=0,pos=0,playing=false,mistakes=0,retryStage=-1,meterLeft=43,meterWidth=14,difficultyLevel='easy';
let sound=false,audio,master,musicBus,musicTimer,musicStep=0,bubbleTimer,advanceTimer,combo=0,drawn=0,drawing=false,drawingPointerId=null,videoPointerId=null,prev=null;
let cookingInteraction=null;
let riceCookingState=null;
let pancakeCookingState=null;
let ramenCookingState=null,ramenDrag=null;
const cookingStepCount=()=>window.CookingPlans[selected].steps.length;
const hasFreeGarnish=()=>window.CookingPlans[selected].hasFreeGarnish!==false;
const garnishStage=()=>hasFreeGarnish()?cookingStepCount():-1;
const resultStage=()=>cookingStepCount()+(hasFreeGarnish()?1:0);
const GAUGE_PERIOD_SCALE=1.375;
const DIFFICULTY=1.08;
const foodSprite=new Image();foodSprite.src='food-sprite-v1.png';
const newFoodSprite=new Image();newFoodSprite.src='new-food-sprite-v1.png';
const garnishSprite=new Image();garnishSprite.src='garnish-sprite-v1.png';
const DISH_PATHS=['fried-rice','steak','tteokbokki','pasta','curry','ramen','pancakes','tonkatsu','udon'].map(name=>`assets/food/${name}.webp`);
const dishImages=DISH_PATHS.map((src,index)=>{const image=new Image();image.decoding='async';image.src=src;image.onerror=()=>document.body.classList.add(`dish-fallback-${index}`);return image});

function storedDevice(){try{return sessionStorage.getItem('lulu-device-mode')}catch{return null}}
function storeDevice(mode){try{sessionStorage.setItem('lulu-device-mode',mode)}catch{}}
function applyDeviceMode(mode){
  if(!['desktop','mobile'].includes(mode))return;
  if(mode==='mobile'){try{screen.orientation?.lock?.('landscape').catch(()=>{})}catch{}}
  document.body.classList.remove('device-desktop','device-mobile');document.body.classList.add(`device-${mode}`);storeDevice(mode);cookingInteraction?.setDisplayMode(mode);
  $('device-picker').hidden=true;$('app-shell').inert=false;$('intro').inert=false;$('intro').removeAttribute('aria-hidden');
  $('current-device').textContent=`현재 화면 모드 · ${mode==='mobile'?'스마트폰':'PC'}`;
  requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}
function showDevicePicker(){
  $('settings-modal').hidden=true;$('device-picker').hidden=false;$('app-shell').inert=true;$('intro').inert=true;$('intro').setAttribute('aria-hidden','true');
  requestAnimationFrame(()=>document.querySelector('[data-device]')?.focus());
}
function initDeviceMode(){const mode=storedDevice();if(['desktop','mobile'].includes(mode))applyDeviceMode(mode);else showDevicePicker()}

function setCoach(message){$('coach-message').innerHTML=message.replace(/\n/g,'<br>')}
function selectDifficulty(level){difficultyLevel=level;const labels={easy:['★ ☆ ☆','쉬움'],normal:['★ ★ ☆','보통'],hard:['★ ★ ★','어려움']};document.querySelectorAll('[data-difficulty]').forEach(button=>button.classList.toggle('selected',button.dataset.difficulty===level));const value=labels[level]||labels.easy;$('difficulty-stars').firstChild.textContent=value[0]+' ';$('difficulty-label').textContent=value[1]}
function openDifficulty(){if(stage!==-1)return;$('difficulty-menu-name').textContent=recipes[selected].name;$('difficulty-modal').hidden=false;document.querySelectorAll('[data-modal-difficulty]').forEach(button=>button.classList.toggle('selected',button.dataset.modalDifficulty===difficultyLevel))}
function closeDifficulty(){if($('difficulty-modal'))$('difficulty-modal').hidden=true}
function addScore(points){score=Math.max(0,score+points);$('score').textContent=String(score).padStart(3,'0')}
function ensureAudio(){try{if(!audio){audio=new(window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=.68;master.connect(audio.destination);musicBus=audio.createGain();musicBus.gain.value=.82;musicBus.connect(master)}audio.resume();return true}catch{return false}}
function tone(frequency,duration=.12,gain=.05,type='sine',slide=frequency){if(!sound||!ensureAudio())return;const now=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(frequency,now);o.frequency.exponentialRampToValueAtTime(Math.max(20,slide),now+duration);g.gain.setValueAtTime(gain,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g);g.connect(master);o.start(now);o.stop(now+duration)}
function musicTone(frequency,duration,gain,type='triangle'){if(!sound||!ensureAudio())return;const now=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=frequency;g.gain.setValueAtTime(gain*1.55,now);g.gain.exponentialRampToValueAtTime(.001,now+duration);o.connect(g);g.connect(musicBus);o.start(now);o.stop(now+duration)}
function noiseBurst(duration=.08,frequency=850,gain=.1){if(!sound||!ensureAudio())return;const length=Math.ceil(audio.sampleRate*duration),buffer=audio.createBuffer(1,length,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),volume=audio.createGain();filter.type='bandpass';filter.frequency.value=frequency;filter.Q.value=.8;volume.gain.value=gain;source.buffer=buffer;source.connect(filter);filter.connect(volume);volume.connect(master);source.start()}
function musicPulse(){const melody=[659,0,784,659,880,784,659,523,587,0,659,784,587,523,494,0],note=melody[musicStep%melody.length];if(note)musicTone(note,.14,.026,musicStep%4?'triangle':'square');if(musicStep%4===0)musicTone([131,165,147,196][Math.floor(musicStep/4)%4],.23,.022,'triangle');musicStep++}
function syncMusic(){clearInterval(musicTimer);musicTimer=null;if(sound){musicStep=0;musicPulse();musicTimer=setInterval(musicPulse,228)}}
function chopSound(){noiseBurst(.05,1100,.16);tone(145,.07,.08,'triangle',65)}
function flipSound(good){noiseBurst(.2,good?780:420,.08);tone(good?330:150,.18,.055,'sine',good?680:90)}
function seasoningSound(salt,perfect=true){noiseBurst(perfect ? .045 : .025,salt ? 1850 : 2500,perfect ? .085 : .045);tone(salt ? 880 : 620,perfect ? .08 : .055,perfect ? .04 : .024,'triangle',salt ? 1160 : 480)}
function skillSound(good){noiseBurst(.07,good?1450:650,.13);tone(good?520:180,.12,.045,'triangle',good?720:100)}
function uiClick(){if(!ensureAudio())return;tone(760,.045,.018,'square',620)}
function bubbleSound(){if(!sound||(![1,3].includes(stage)&&!(selected===2&&stage===2)))return;tone(90+Math.random()*90,.13,.03,'sine',42);noiseBurst(.08,360,.025)}
function rewardSound(){tone(630,.1,.04,'sine',760);setTimeout(()=>tone(850,.13,.035,'sine',1000),65)}
function syncBubbles(){document.body.classList.toggle('game-active',stage>=0&&stage<resultStage());document.body.classList.toggle('timing-active',stage>=0&&stage<cookingStepCount());clearInterval(bubbleTimer);bubbleTimer=null;if(sound&&stage>=0&&stage<cookingStepCount()&&['BOIL','STIR','TOSS'].includes(window.CookingPlans[selected].steps[stage].action)){bubbleSound();bubbleTimer=setInterval(bubbleSound,470)}}
function setSound(on){sound=on;if(on&&!ensureAudio())sound=false;$('sound').textContent=sound?'♫ BGM·효과음 ON':'♫ BGM·효과음 OFF';$('sound').setAttribute('aria-label',sound?'BGM과 효과음 끄기':'BGM과 효과음 켜기');$('sound').setAttribute('aria-pressed',String(sound));syncMusic();syncBubbles()}

function burst(icon='✨',amount=6){const wrap=$('particles');for(let i=0;i<amount;i++){const piece=document.createElement('span');piece.textContent=icon;piece.className='confetti';piece.style.left=(18+Math.random()*64)+'%';piece.style.animationDelay=(i*.025)+'s';wrap.append(piece);setTimeout(()=>piece.remove(),1500)}}
function recipeMarkup(recipe){return recipe.ingredients.map(x=>`<span>${x}</span>`).join('')}
function lockRecipes(locked){document.querySelectorAll('.recipe-card').forEach(button=>button.disabled=locked)}
function setDishClass(element,index,extra=''){element.className=`${extra} dish-art dish-${index}`.trim()}
function updateStepLabels(){$('steps').innerHTML=recipes[selected].flow.map((item,i)=>`<span><i>${i+1}</i><b>${item.label}</b></span>`).join('')}
function selectRecipe(index){if(stage>=0&&stage<resultStage())return;selected=Number(index);const recipe=recipes[selected];document.querySelectorAll('.recipe-card').forEach((button,i)=>button.classList.toggle('selected',i===selected));$('recipe-title').innerHTML=`오늘은 <em>${recipe.name}</em>`;setDishClass($('menu-image'),selected,'menu-image');$('menu-image').setAttribute('aria-label',recipe.name);$('menu-name').textContent=recipe.full;$('menu-copy').textContent=recipe.copy;$('ingredient-tray').innerHTML='<span class="tray-label">오늘의 재료</span>'+recipeMarkup(recipe);updateStepLabels();if(stage===-1){$('scene').innerHTML=`<div class="ready-dish dish-art dish-${selected}" role="img" aria-label="${recipe.name}"></div><p class="ready-copy"><strong>${recipe.full}</strong><br>${recipe.copy}</p>`;$('feedback').textContent=`${recipe.name}를 골랐어요. ${recipe.flow.length}단계에 도전해요!`;setCoach(`${recipe.name} 좋지!\n앞치마를 단단히 매자.`)}}

function updateSteps(active){const nav=$('steps');if(selected===7){const labels=recipes[7].flow.map(step=>step.label);if(nav.dataset.recipe!=='tonkatsu'){nav.innerHTML=labels.map((label,i)=>`<span><i>${i+1}</i><b>${label}</b></span>`).join('');nav.dataset.recipe='tonkatsu';nav.setAttribute('aria-label','돈가스 조리 순서')}}else if(nav.dataset.recipe==='tonkatsu'){nav.innerHTML=defaultStepNavMarkup;delete nav.dataset.recipe;nav.setAttribute('aria-label','요리 순서')}nav.querySelectorAll(':scope>span').forEach((item,i)=>item.className=i===active?'active':i<active?'done':'')}
function stageHeader(n){const info=recipes[selected].flow[n];$('task-icon').textContent=info.icon;$('stage-tag').textContent=`STEP ${String(n+1).padStart(2,'0')} · ${info.label}`;$('task-title').textContent=n<cookingStepCount()?`${recipes[selected].name} · ${info.label}`:info.title}
const ramenToppingTypes=[{id:'meat',icon:'🥩',name:'고기',stock:3},{id:'nori',icon:'🌿',name:'김',stock:3},{id:'egg',icon:'🥚',name:'계란',stock:1},{id:'scallion',icon:'🌱',name:'파',stock:4},{id:'fishcake',icon:'🍥',name:'어묵',stock:3},{id:'gungchae',icon:'🥬',name:'궁채',stock:3}];
function ramenBowlMarkup(toppings=ramenCookingState?.toppings||[],isResult=false){const items=toppings.map(item=>{const type=ramenToppingTypes.find(x=>x.id===item.type)||ramenToppingTypes[0];return `<span class="ramen-placed-topping topping-${type.id}" data-id="${item.id}" data-topping="${item.type}" style="--tx:${item.x*100}%;--ty:${item.y*100}%" aria-label="${type.name}">${type.icon}</span>`}).join('');return `<div class="ramen-bowl-scene${isResult?' ramen-result-bowl':''}"><img class="ramen-plating-backdrop" src="assets/ramen/고명올리기.png" alt="라멘 그릇과 준비된 고명"><div class="ramen-bowl-drop"><div class="ramen-broth-surface"><i class="ramen-noodle-lines"></i><i class="ramen-steam"></i><div class="ramen-placed-layer">${items}</div></div></div>${isResult?'':'<p class="ramen-plating-tip">왼쪽 트레이에서 고명을 끌어 라멘 위에 올려요</p>'}</div>`}
function setupRamenPlating(){document.body.classList.add('ramen-cooking');$('board').className='board ramen-plating-board';$('board-label').textContent='고명 자유롭게 올리기';$('counter').textContent=`고명 ${ramenCookingState.toppings.length}개`;$('gesture').textContent='고명을 그릇으로 끌어 원하는 곳에 놓아요';$('feedback').textContent='고명은 한 번에 하나씩 놓고, 다시 움직일 수 있어요.';$('hint').hidden=true;$('meter').hidden=true;$('drawing').hidden=true;$('sauce').hidden=true;$('action').disabled=!ramenCookingState.toppings.length;setAction('요리 완성! <span>★</span>');$('action').disabled=!ramenCookingState.toppings.length;$('scene').innerHTML=`${ramenBowlMarkup()}<div class="ramen-topping-tray" aria-label="라멘 고명">${ramenToppingTypes.map(type=>`<button class="ramen-topping-source" type="button" data-topping="${type.id}" aria-label="${type.name} 고명 가져오기"><span>${type.icon}</span><b>${type.name}</b><small data-stock="${type.id}">${type.stock}</small></button>`).join('')}</div><div class="ramen-drag-ghost" hidden></div>`;const scene=$('scene');scene.addEventListener('pointerdown',event=>{const placed=event.target.closest('.ramen-placed-topping'),source=event.target.closest('.ramen-topping-source');if(!placed&&!source)return;event.preventDefault();const typeId=placed?.dataset.topping||source.dataset.topping,type=ramenToppingTypes.find(item=>item.id===typeId),recordId=placed?.dataset.id||null;if(!recordId&&Number(scene.querySelector(`[data-stock="${typeId}"]`)?.textContent||0)<=0)return;ramenDrag={typeId,recordId,pointerId:event.pointerId,old:recordId?{...ramenCookingState.toppings.find(item=>item.id===recordId)}:null};const ghost=scene.querySelector('.ramen-drag-ghost');ghost.hidden=false;ghost.textContent=type.icon;ghost.style.left=`${event.clientX}px`;ghost.style.top=`${event.clientY}px`;try{scene.setPointerCapture(event.pointerId)}catch{}});scene.addEventListener('pointermove',event=>{if(!ramenDrag||ramenDrag.pointerId!==event.pointerId)return;const ghost=scene.querySelector('.ramen-drag-ghost');ghost.style.left=`${event.clientX}px`;ghost.style.top=`${event.clientY}px`});const drop=event=>{if(!ramenDrag||ramenDrag.pointerId!==event.pointerId)return;const drag=ramenDrag;ramenDrag=null;scene.querySelector('.ramen-drag-ghost').hidden=true;const bowl=scene.querySelector('.ramen-broth-surface'),rect=bowl.getBoundingClientRect(),inside=event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;let changed=false;if(inside){const x=Math.max(.08,Math.min(.92,(event.clientX-rect.left)/rect.width)),y=Math.max(.08,Math.min(.92,(event.clientY-rect.top)/rect.height));if(drag.recordId){const item=ramenCookingState.toppings.find(entry=>entry.id===drag.recordId);if(item){item.x=x;item.y=y;changed=true}}else{const type=ramenToppingTypes.find(entry=>entry.id===drag.typeId),stock=scene.querySelector(`[data-stock="${drag.typeId}"]`);if(type&&stock&&Number(stock.textContent)>0){stock.textContent=String(Number(stock.textContent)-1);ramenCookingState.toppings.push({id:`ramen-top-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:drag.typeId,x,y});changed=true}}}if(changed){scene.querySelector('.ramen-bowl-scene').outerHTML=ramenBowlMarkup();$('counter').textContent=`고명 ${ramenCookingState.toppings.length}개`;$('feedback').textContent='톡! 라멘 위에 고명이 놓였어요.';$('action').disabled=false;skillSound(true);burst('✦',2)} };scene.addEventListener('pointerup',drop);scene.addEventListener('pointercancel',drop)}
function setMeter(left,width,label='여기!'){meterLeft=left;meterWidth=width;$('meter').hidden=false;$('meter').style.setProperty('--meter-left',left+'%');$('meter').style.setProperty('--meter-width',width+'%');$('sweetspot').style.left=left+'%';$('sweetspot').style.width=width+'%';document.querySelector('.meter-label').textContent=label}
function setAction(html){$('action').hidden=false;$('action').disabled=false;$('action').innerHTML=html}
function clearAdvance(){clearTimeout(advanceTimer);advanceTimer=null}
function rankFor(points){return ranks.find(rank=>points>=rank.min)}
function ingredientIcon(recipe,index){return recipe.ingredients[index%recipe.ingredients.length].split(' ')[0]}
function cookingScene(recipe,info){
  const utensil=['🥄','🥢','🥄','🥄','🥄','🥢','🥄','🥢','🥢'][selected]||'🥄';
  const vessel=[0,1,3,6].includes(selected)?'🍳':'🍲';
  const mode=info.motion.action==='flip'?'pancake-flip':info.motion.action==='toss'?'tossing':'stirring';
  return `<div class="active-cook-scene recipe-cook-${selected} ${mode}" style="--cook-progress:0">
    <div class="heat-glow"><i></i><i></i><i></i></div>
    <div class="steam-streams"><i></i><i></i><i></i></div>
    <span class="cook-utensil" aria-hidden="true">${utensil}</span>
    <div class="cook-vessel">
      <span class="vessel-emoji" aria-hidden="true">${vessel}</span>
      <span class="toss-shadow" aria-hidden="true"></span>
      <span class="cook-pieces cut-pieces-${selected}" role="img" aria-label="팬 안에서 잘린 재료를 조리 중인 ${recipe.name}"></span>
      <span class="cook-preview dish-art dish-${selected}" role="img" aria-label="조리되며 색과 윤기가 살아나는 ${recipe.name}"></span>
      <span class="cook-morsel morsel-a">${ingredientIcon(recipe,0)}</span>
      <span class="cook-morsel morsel-b">${ingredientIcon(recipe,1)}</span>
      <span class="cook-morsel morsel-c">${ingredientIcon(recipe,2)}</span><span class="cook-morsel morsel-d">${ingredientIcon(recipe,3)}</span>
      <span class="sizzle-dot dot-a"></span><span class="sizzle-dot dot-b"></span><span class="sizzle-dot dot-c"></span>
      <span class="landing-ring" aria-hidden="true"></span>
    </div>
    <span class="action-caption">${info.label} 중</span>
  </div>`
}
function heatScene(recipe,info){const surface=selected===4?`<span class="heat-liquid" role="img" aria-label="${info.label} 중인 ${recipe.name}"><i></i><i></i><i></i><b></b><b></b></span>`:`<span class="heat-surface dish-art dish-${selected}" role="img" aria-label="${info.label} 중인 ${recipe.name}"></span>`;const vessel=[1,7].includes(selected)?'<span class="heat-pot heat-pan-illustration" aria-hidden="true"></span>':'<span class="heat-pot" aria-hidden="true">🍲</span>';return `<div class="heat-scene ${selected===4?'curry-heat-scene':''}">
  <div class="heat-flames"><i></i><i></i><i></i></div>
  ${vessel}
  ${surface}
  <div class="boil-bubbles"><i></i><i></i><i></i><i></i></div>
  <div class="heat-steam"><i></i><i></i><i></i></div>
</div>`}
function noodleHeatScene(recipe,info){return `<div class="heat-scene noodle-heat-scene">
  <div class="heat-flames"><i></i><i></i><i></i></div><span class="heat-pot" aria-hidden="true">🍲</span>
  <img class="raw-noodles" src="raw-noodles-v1.png" alt="냄비 속에서 삶아지는 생면"><div class="boil-bubbles"><i></i><i></i><i></i><i></i></div><div class="heat-steam"><i></i><i></i><i></i></div><span class="action-caption">${info.label}</span>
</div>`}
function ingredientActionScene(recipe,info){const target=selected===6?'🥞':ingredientIcon(recipe,0);return `<div class="ingredient-action-scene action-${info.motion.action}" role="img" aria-label="${recipe.name} ${info.label} 과정"><div class="action-pan"><span class="action-target">${target}</span></div><span class="action-source">${info.motion.visual}</span><span class="action-stream" aria-hidden="true"><i>●</i><i>●</i><i>●</i></span><span class="action-caption">${info.label}</span></div>`}
function waterScene(recipe,info){return `<div class="water-scene">
  <div class="water-pot"><span class="water-pot-emoji" aria-hidden="true">🍲</span><span class="water-fill"></span><span class="water-surface"></span></div>
  <span class="water-pour" aria-hidden="true">💧</span><span class="water-pour water-pour-two" aria-hidden="true">💧</span>
  <div class="water-gauge"><span>물 높이</span><i></i><b>초록 구간</b></div><span class="action-caption">${info.label}</span>
</div>`}
function brothScene(){return `<div class="broth-scene" role="img" aria-label="냄비 안에서 우동 육수를 천천히 우리는 과정"><div class="broth-pot"><span class="broth-liquid"></span><span class="broth-scallion">● ● ●</span><span class="broth-ladle">🥄</span><i class="broth-steam s1"></i><i class="broth-steam s2"></i><i class="broth-steam s3"></i></div><span class="action-caption">육수 우리기</span></div>`}
function stageOneScene(recipe,info){const scene=info.motion.scene;if(scene==='broth')return brothScene();if(scene==='water')return waterScene(recipe,info);if(scene==='action')return ingredientActionScene(recipe,info);return `<div class="flip-scene recipe-motion-${selected}"><span class="toss-shadow" aria-hidden="true"></span><div class="flying-food food-${selected}" role="img" aria-label="팬에서 움직이는 ${recipe.name}">${info.visual}</div><span class="flight-bit flight-bit-a" aria-hidden="true"></span><span class="flight-bit flight-bit-b" aria-hidden="true"></span><span class="flight-bit flight-bit-c" aria-hidden="true"></span><span class="flight-bit flight-bit-d" aria-hidden="true"></span><div class="pan-food"><span>${recipe.ingredients[0].split(' ')[0]}</span><span>${recipe.ingredients[1].split(' ')[0]}</span><span>${recipe.ingredients[2].split(' ')[0]}</span></div><span class="landing-ring" aria-hidden="true"></span><div class="pan pan-illustration" aria-hidden="true"></div><span class="steam">〰</span></div>`}

function setStage(next){
  if(next===resultStage()){finish();return}
  if(next===0&&selected===0)riceCookingState={pieces:[],pan:null,pending:[],riceBase:false,pendingToss:false,flipCount:0};
  if(next===0&&selected===6)pancakeCookingState={};
  if(next===0&&selected===5)ramenCookingState={boneAdded:false,bonesAdded:false,boneCount:0,soyAdded:false,pepperAdded:false,brothPrepared:false,soySauceAmount:0,pepperCount:0,boilingLevel:0,noodlesAdded:false,noodleStirCount:0,brothPourAmount:0,toppings:[]};
  if(selected===5&&next===garnishStage())cookingInteraction?.videoScene?.stopRamenAmbient?.();clearAdvance();cookingInteraction?.dispose();cookingInteraction=null;stage=next;stageScoreStart=score;
  document.body.classList.add('game-active');document.body.classList.toggle('timing-active',next<cookingStepCount());$('app-shell').scrollTop=0;
    round=0;combo=0;mistakes=0;retryStage=-1;phase=0;last=0;pos=0;playing=false;drawn=0;drawing=false;drawingPointerId=null;videoPointerId=null;
  $('combo').textContent='✦';$('counter').hidden=false;$('gesture').hidden=false;$('feedback').hidden=false;$('hint').hidden=false;$('meter').hidden=true;$('meter').classList.remove('pour-gauge','free-pour-gauge','pour-timing-gauge','timing-gauge','steak-timing-gauge','stir-rhythm-gauge','ramen-pour-gauge');$('meter').style.setProperty('--pour-progress','0%');$('counter').classList.remove('pour-progress-counter');document.body.classList.remove('curry-gauge-visible','pasta-cooking','ramen-cooking','ramen-pepper-timing','ramen-action-no-meter','tonkatsu-seasoning');document.body.classList.remove('tteok-stir-game');document.body.classList.toggle('pasta-cooking',selected===3);document.body.classList.toggle('steak-cooking',selected===1);document.body.classList.toggle('steak-seasoning',selected===1&&next===0);document.body.classList.toggle('ramen-cooking',selected===5);$('sauce').hidden=true;$('restart').hidden=false;$('drawing').hidden=true;$('action').classList.remove('is-holding');$('board').className='board';$('scene').classList.remove('stage-failed');lockRecipes(true);updateSteps(next);stageHeader(next);
  if(next<cookingStepCount()){
    const plan=window.CookingPlans[selected],step=plan.steps[next],width={easy:24,normal:17,hard:11}[difficultyLevel]||24;
    const tteokStir=selected===2&&step.interaction==='VIDEO_STIR_TIMING',pastaStep=selected===3&&step.pastaMode,ramenStep=selected===5&&step.ramenMode,stirVideo=step.interaction==='STIR'&&step.video&&!step.stirPlayback;const videoTiming=step.interaction==='COOK_TIMING'&&step.video,videoHold=['VIDEO_HOLD','VIDEO_PASTA_HOLD'].includes(step.interaction),amountGauge=!!step.amountRange,pourGauge=videoHold||amountGauge||ramenStep&&step.ramenModeType==='hold',pourTimingGauge=step.action==='POUR'&&!pourGauge,tteokCutTiming=selected===2&&step.action==='CUT'&&!!step.subActions,tteokCutVideo=selected===2&&step.action==='CUT'&&!!step.cutVideoSequence;playing=true;setMeter(videoTiming?step.perfectStartFraction*100:amountGauge?step.amountRange.min*100:videoHold?0:(100-width)/2,videoTiming?(step.burnStartFraction-step.perfectStartFraction)*100:amountGauge?(step.amountRange.max-step.amountRange.min)*100:videoHold?100:width,videoTiming?'적정 타이밍':amountGauge?'목표량':videoHold?'부은 양':pourTimingGauge?'적정량':tteokCutTiming?'칼질 타이밍':'조리 진행');$('meter').hidden=false;$('meter').classList.toggle('pour-gauge',pourGauge);$('meter').classList.remove('stir-rhythm-gauge');$('meter').classList.toggle('free-pour-gauge',(videoHold||ramenStep&&step.ramenModeType==='hold')&&!amountGauge);$('meter').classList.toggle('pour-timing-gauge',pourTimingGauge);$('counter').classList.toggle('pour-progress-counter',pourGauge);$('meter').classList.toggle('timing-gauge',videoTiming&&selected===4||ramenStep&&step.ramenModeType==='timing');$('meter').classList.toggle('steak-timing-gauge',videoTiming&&selected===1);document.body.classList.toggle('curry-gauge-visible',selected===4&&(videoTiming||amountGauge));document.body.classList.toggle('tteok-stir-game',tteokStir);document.body.classList.toggle('tonkatsu-seasoning',selected===7&&step.playerActionSequence);$('meter').setAttribute('aria-label',amountGauge?`목표량 구간 ${Math.round(step.amountRange.min*100)}에서 ${Math.round(step.amountRange.max*100)}퍼센트`:videoHold||pourGauge?'부은 양 진행률':pourTimingGauge?'적정량 구간을 확인하세요':'조리 진행 상태');$('needle').style.left='calc(0% - 3px)';$('meter').style.setProperty('--pour-progress','0%');$('meter').style.setProperty('--stir-progress','0%');
    document.body.classList.toggle('ramen-stir-continuous',selected===5&&step.ramenModeType==='continuous');if(selected===5&&step.ramenModeType==='timing')$('meter').classList.remove('timing-gauge');if(selected===5&&step.ramenModeType==='continuous'){$('meter').hidden=true;$('counter').textContent='면 익힘 0%';$('gesture').textContent='SPACE 한 번으로 면을 모아 올려요';$('feedback').textContent='면을 세 번 저으면 익어요';setAction('면 저으며 삶기 <span>SPACE · 젓기</span>')}
    $('counter').textContent=`0 / ${step.goal}`;if(videoHold||step.manualTrigger||amountGauge||stirVideo)$('counter').textContent='0%';if(step.interaction==='VIDEO_SEASONING')$('counter').textContent=selected===7?(['후추 0/1 · 소금 0/1','고기 두드리기 대기','밀가루 → 계란물 → 튀김가루','기름 온도 맞추기','튀기기'][next]):'후추 ○○○  소금 ○○○';if(step.interaction==='VIDEO_TAP_SEQUENCE')$('counter').textContent='후추 ●●●●  소금 ○○○○';if(step.subActions)$('counter').textContent='파 0/5 · 어묵 0/5';$('counter').hidden=tteokStir;$('board-label').textContent=step.label;
    $('gesture').textContent=ramenStep?(step.ramenSequence?'초록색에 marker가 오면 SPACE!':step.ramenAction==='brothPour'?'SPACE를 누르고 있는 동안 육수를 부어요':'초록색에 marker가 오면 SPACE!'):pastaStep?step.inputText:selected===1&&step.interaction==='VIDEO_SEASONING'?'원이 겹치는 순간 SPACE!':selected===1&&step.interaction==='VIDEO_TAP_SEQUENCE'?'후추를 톡톡 눌러 뿌려주세요!':selected===7&&step.interaction==='VIDEO_SEASONING'?`${step.label} <span>SPACE · 타이밍</span>`:tteokStir?'원이 겹칠 때 SPACE로 저어주세요!':tteokCutTiming?'바늘이 초록색일 때 SPACE · 터치':step.subActions?'재료를 가로질러 드래그해 썰어요':step.inputText||'바늘이 초록색일 때 SPACE · 터치';
    $('hint').textContent=ramenStep?'':tteokStir||pastaStep?'':step.inputText||'바늘이 초록색일 때 SPACE 또는 화면 터치!';
    $('feedback').textContent=ramenStep?(step.ramenSequence?'돼지뼈 두 번 → 후추 세 번 → 간장':'보글보글…'):step.ramenAction==='brothPour'?'적정량까지 천천히 부어주세요':videoHold?step.holdPrompt||step.label:step.instruction;if(videoHold)$('counter').textContent='0%';
    $('gesture').hidden=false;$('feedback').hidden=tteokStir;$('board').classList.add('interactive-mode');setAction(ramenStep?step.ramenAction==='brothPour'?'육수 붓기 <span>SPACE · 홀드</span>':'SPACE로 조리하기':amountGauge?`${step.label} · 적정량 구간에 맞추기 <span>SPACE · 홀드</span>`:videoHold?`${step.label} · 누르고 붓기 <span>SPACE · 홀드</span>`:tteokCutVideo?'재료 썰기 <span>SPACE · 한 번씩</span>':tteokStir?'톡! 톡! 탁! 젓기 <span>SPACE · 2세트</span>':tteokCutTiming?'초록 구간에서 칼질 <span>SPACE · 탭</span>':step.subActions?'재료 썰기 <span>마우스 · 터치 드래그</span>':step.interaction==='VIDEO_TAP_SEQUENCE'?'조금씩 뿌리기 <span>SPACE · 탭</span>':step.action==='FLIP'&&step.manualTrigger?'고기 뒤집기 <span>한 번 탭</span>':step.interaction==='COOK_TIMING'&&step.action==='ADD'&&step.video?'알맞은 타이밍에 넣기 <span>한 번 탭</span>':step.interaction==='HOLD_AMOUNT'?'누르는 동안 넣기 <span>SPACE · 터치</span>':step.interaction==='STIR'?'원을 그려 섞기 <span>드래그</span>':step.interaction==='POINTER_DRAW'?'누른 채 그리기 <span>드래그</span>':selected===1&&step.interaction==='COOK_TIMING'?'고기가 익는 순간 누르기 <span>SPACE · 터치</span>':'조작하기 <span>SPACE · 터치</span>');$('action').hidden=['STIR','POINTER_DRAW'].includes(step.interaction)||tteokStir||pastaStep||!!step.subActions||(selected===1&&!!(step.video||step.videoSequence));if(ramenStep)$('action').hidden=false;$('hint').hidden=selected===1||tteokStir||pastaStep||ramenStep;
    setCoach(`${step.label} 단계야!\n${ramenStep?(step.ramenSequence?'먼저 돼지뼈 두 번, 후추 세 번을 넣고 간장을 부어요!':step.ramenAction==='brothPour'?'필요한 만큼 육수를 부어줘!':'초록색에 marker가 오면 SPACE를 눌러줘!'):tteokCutVideo?'바늘이 초록색일 때 SPACE로 파를 썰어봐!':tteokStir?'원이 겹칠 때 SPACE로 저어봐!':step.inputText||'바늘이 초록색일 때 눌러봐.'}`);
    if(selected===5&&step.ramenModeType==='continuous'){$('counter').textContent='면 익힘 0%';$('gesture').textContent='SPACE 한 번으로 면을 모아 올려요';$('feedback').textContent='면을 세 번 저으면 익어요';setAction('면 저으며 삶기 <span>SPACE · 젓기</span>')}
    const tteokStirCombo={perfect:0};
    cookingInteraction=new window.CookingInteraction($('scene'),plan,step,(count,goal)=>{
      if(stage!==next)return;round=count;const meterProgress=Math.max(0,Math.min(100,count/Math.max(1,goal)*100));$('meter').style.setProperty('--pour-progress',`${meterProgress}%`);if(step.stirSets||step.stirLaps){const totalSets=step.stirSets||step.stirLaps,shown=step.interaction==='VIDEO_RHYTHM'?(cookingInteraction?.videoScene?.stirSuccessCount||0):count;$('counter').textContent=`${Array.from({length:totalSets},(_,i)=>i<shown?'●':'○').join(' ')}  ·  ${Math.min(shown+1,totalSets)}/${totalSets} 세트`;return}if(step.subActions){const per=goal/step.subActions.length,idx=Math.min(step.subActions.length-1,Math.floor(count/per)),first=Math.min(per,count),second=Math.max(0,count-per);cookingInteraction?.setSubAction(idx,idx===0?first:second);$('counter').textContent=`파 ${first}/${per} · 어묵 ${second}/${per}`;if(count===per){$('gesture').textContent=step.cutVideoSequence?'바늘이 초록색일 때 SPACE · 터치':'좋아요! 이제 어묵도 초록 구간에 맞춰 썰어요';$('feedback').textContent='파 썰기 완료! 이번엔 어묵!';setCoach('파 썰기 완료!\n이번엔 어묵을 썰어보자.')}else $('feedback').textContent=idx===0?`파를 썰고 있어요 · ${first}/${per}`:`어묵을 썰고 있어요 · ${second}/${per}`;}else $('counter').textContent=`${count} / ${goal}`;
    },result=>{
      if(stage!==next)return;playing=false;const keepSteakCookingMotion=selected===1&&step.interaction==='COOK_TIMING'&&step.action==='COOK_TIMING',keepTteokStirResponse=selected===2&&step.interaction==='VIDEO_STIR_TIMING',keepTteokCutMotion=selected===2&&step.cutVideoSequence,keepPastaMotion=selected===3&&step.pastaMode,keepRamenMotion=selected===5&&step.ramenMode;if(!keepSteakCookingMotion&&!keepTteokStirResponse&&!keepTteokCutMotion&&!keepPastaMotion&&!keepRamenMotion)cookingInteraction?.videoScene?.pause();addScore(10);$('counter').textContent=step.stirSets?Array(step.stirSets).fill('●').join(' ')+'  ·  완성':step.stirLaps?Array(step.stirLaps).fill('●').join(' '):selected===0&&step.action==='TOSS'?`${step.goal} / ${step.goal}`:'완료';
      const burntMessage=result==='burnt'&&step.video?(selected===4?'카레가 너무 오래 끓었어요. 담기로 넘어가요.':selected===1?'너무 늦었어요. 다음 조리 단계로 넘어가요.':null):null;$('feedback').textContent=burntMessage||step.successMessage||`${step.label} 성공! 다음 조리 과정으로 넘어가요.`;if(step.successMessage&&!burntMessage)setCoach(`${step.successMessage}\n${selected===1?'계속 맛있게 요리해보자!':selected===2&&step.interaction==='VIDEO_STIR_TIMING'?'다음 단계로 넘어가요!':'계속 맛있게 구워보자!'}`);rewardSound();
      const stirFinishWait=keepTteokStirResponse?Math.max(900,((cookingInteraction?.videoScene?.video.duration||4)-(cookingInteraction?.videoScene?.video.currentTime||0))*1000+160):0;const cutFinishWait=selected===2&&step.cutVideoSequence?Math.max(1600,(cookingInteraction?.videoScene?.cutPendingSeconds?.()||0)*1000+1000):0;const linger=keepRamenMotion?550:keepTteokStirResponse?650:keepSteakCookingMotion?800:keepPastaMotion?540:selected===2&&step.cutVideoSequence?cutFinishWait:step.successMessage?1900:(['TOSS','FLIP'].includes(step.action)||(step.action==='CUT'&&[0,4].includes(selected)))?1900:step.action==='ADD'?1000:650;
      const moveNext=()=>{if(stage!==next)return;if(selected===2&&step.cutVideoSequence&&!cookingInteraction?.videoScene?.cutSequenceFinished){advanceTimer=setTimeout(moveNext,100);return}setStage(next+1)};advanceTimer=setTimeout(moveNext,linger);
    },{onTap:timedCookingTap,cookingState:selected===5?ramenCookingState:riceCookingState,sharedState:selected===6?pancakeCookingState:null,
      onRamenAction:detail=>{if(stage!==next)return;const {action,verdict}=detail;if(verdict==='too_little'||verdict==='too_much'){$('feedback').textContent=verdict==='too_little'?(detail.action==='soy'?'간장을 조금 더 부어주세요.':'육수를 조금 더 부어주세요.'):(detail.action==='soy'?'간장이 많아요. 다시 맞춰주세요.':'육수가 넘쳤어요. 적정량으로 다시 부어주세요.');$('combo').textContent=verdict==='too_little'?'조금 더':'조금 많아요';skillSound(false);return}if(verdict==='miss'){ $('feedback').textContent='MISS · 게이지가 다시 초록색에 올 때 눌러요';$('combo').textContent='MISS';combo=0;skillSound(false);return 0}const points=verdict==='perfect'?12:verdict==='good'?8:6;addScore(points);if(action==='bone')$('feedback').textContent='풍덩! 돼지뼈가 냄비에 들어갔어요!';else if(action==='soy')$('feedback').textContent='주르륵! 간장이 육수에 잘 섞였어요!';else if(action==='pepper')$('feedback').textContent=verdict==='miss'?'다음 신호에 후추를 뿌려요':`톡톡! 후추 ${detail.count}/${detail.total}`;else if(action==='boil')$('feedback').textContent=verdict==='miss'?'조금 더 끓인 뒤 눌러주세요':'보글보글! 육수가 팔팔 끓어요!';else if(action==='noodleAdd')$('feedback').textContent=verdict==='miss'?'면을 넣기 좋은 순간을 다시 봐요':'풍덩! 면이 육수에 들어갔어요!';else if(action==='noodleStir')$('feedback').textContent=verdict==='miss'?'다음 원이 겹칠 때 저어요':'촤악! 면과 육수가 함께 움직여요!';else if(action==='pour')$('feedback').textContent='주르륵! 적당한 양의 육수를 부었어요!';$('combo').textContent=verdict==='perfect'?'✨ PERFECT!':verdict==='good'?'○ GOOD!':action==='bone'?'풍덩!':'탁!';if(verdict==='perfect')combo++;else if(verdict==='miss')combo=0;if(action!=='bone'&&action!=='pepper'||verdict==='miss')skillSound(verdict!=='miss');if(verdict==='perfect')burst('✦',3);return points},onRamenSubAction:(action,index,total)=>{if(stage!==next)return;const prompts={bone:'초록색에 맞춰 SPACE로 돼지뼈를 넣어요!',pepper:'초록색에 맞춰 SPACE로 후추를 뿌려요!',soy:'SPACE를 누른 동안 간장이 흘러요'};$('gesture').textContent=prompts[action]||'';$('feedback').textContent=action==='bone'?'초록 구간에서 성공하면 돼지뼈 하나가 들어가요':action==='pepper'?'초록 구간에서 성공하면 후추가 뿌려져요 · '+(ramenCookingState?.pepperCount||0)+'/3':'누르는 동안 간장 흐름과 게이지가 함께 늘어요';$('counter').hidden=action==='bone';if(action!=='bone')$('counter').textContent=action==='pepper'?'후추 '+(ramenCookingState?.pepperCount||0)+'/3':'간장 0%';if(action==='pepper')setCoach('초록색에 marker가 왔을 때 SPACE로 후추를 뿌려줘.');else if(action==='soy')setCoach('후추를 넣었어! SPACE를 누르고 있는 만큼 간장을 넣어보자.');else setCoach('초록색에 marker가 왔을 때 SPACE로 돼지뼈를 넣자!')},onRamenProgress:detail=>{if(stage!==next)return;if(detail.action==='bone')$('counter').textContent='돼지뼈 '+(detail.count||0)+'/'+(detail.total||2);else if(detail.action==='soy'||detail.action==='brothPour'){$('counter').textContent=`${Math.round((detail.amount||0)*100)}%`;if(detail.action==='brothPour')$('feedback').textContent=(detail.amount||0)<.36?'육수를 조금 더 부어주세요':(detail.amount||0)>.76?'조금 많아요 · 놓고 다시 맞춰요':'좋아요! 이 양이면 딱 맞아요';else $('feedback').textContent=`간장 ${Math.round((detail.amount||0)*100)}% · 누르는 동안 흘러요`}else if(detail.action==='pepper')$('counter').textContent='후추 '+(ramenCookingState?.pepperCount||0)+'/3';else if(detail.count!==undefined&&detail.total>1)$('counter').textContent=(detail.action==='noodleStir'?'면 젓기':detail.action==='boil'?'육수 끓이기':detail.action)+' '+detail.count+'/'+detail.total},onPastaAction:(verdict,detail)=>{if(stage!==next)return 0;const points=verdict==='perfect'?12:verdict==='good'?6:0;if(points)addScore(points);$('counter').textContent=Array.from({length:detail.total},(_,i)=>i<detail.count?'●':'○').join(' ')+'  '+detail.count+'/'+detail.total;skillSound(verdict!=='miss');$('feedback').textContent=verdict==='perfect'?({boil:'보글보글! 물이 팔팔 끓어요!',add:'풍덩! 면을 넣었어요!',cook:'면이 탱글하게 익었어요!',stir:'휘익! 소스가 면에 골고루 묻어요!'})[detail.action]:verdict==='good'?'좋아요! 조리가 잘 되고 있어요.':'조금 더 기다려요!';$('combo').textContent=verdict==='perfect'&&detail.combo>1?'✨ PERFECT ×'+detail.combo:verdict==='perfect'?'✨ PERFECT':verdict==='good'?'○ GOOD':'조금 더!';const board=$('board');board.classList.remove('seasoning-pop');void board.offsetWidth;board.classList.add('seasoning-pop');setTimeout(()=>board.classList.remove('seasoning-pop'),190);return points},onSeasoningHit:(verdict,index,detail)=>{if(stage!==next)return 0;if(selected===7){const label=cookingInteraction?.videoScene?.sequence?.[index]?.label||step.label;const points=verdict==='perfect'?12:verdict==='good'?6:-2;if(verdict==='miss'){addScore(points);skillSound(false);$('combo').textContent='MISS · 초록 구간을 기다려요';$('feedback').textContent='괜찮아요. 다시 초록 구간을 맞춰봐요.';return points}addScore(points);seasoningSound(false,verdict==='perfect');$('combo').textContent=verdict==='perfect'?'✨ PERFECT':'○ GOOD';$('feedback').textContent=`좋은 타이밍! ${label} 동작을 시작해요.`;const board=$('board');board.classList.remove('seasoning-pop');void board.offsetWidth;board.classList.add('seasoning-pop');setTimeout(()=>board.classList.remove('seasoning-pop'),190);return points}if(selected===2){$('gesture').textContent='';if(detail.count===0)setCoach(verdict==='miss'?'괜찮아! 다음 신호를 기다려봐.':'찰박! 잘 저었어!');const points=verdict==='perfect'?12:verdict==='good'?6:-2;if(verdict==='perfect'){addScore(points);skillSound(true);$('combo').textContent=`✨ PERFECT${detail.combo>1?` ×${detail.combo}`:''}`}else if(verdict==='good'){addScore(points);skillSound(true);$('combo').textContent='○ GOOD'}else{addScore(points);skillSound(false);$('combo').textContent='MISS · 다음 타이밍!'}if(verdict!=='miss'){const board=$('board');board.classList.remove('seasoning-pop');void board.offsetWidth;board.classList.add('seasoning-pop');setTimeout(()=>board.classList.remove('seasoning-pop'),190);if(detail.count===1)$('gesture').textContent='';if(detail.count===detail.total)setCoach('찰박! 맛있게 완성!')}return points}const salt=index===1,points=verdict==='perfect'?12:verdict==='good'?6:-2;if(verdict==='perfect'){addScore(points);seasoningSound(salt,true);$('combo').textContent=`✨ PERFECT${detail.combo>1?` ×${detail.combo}`:''}`}else if(verdict==='good'){addScore(points);seasoningSound(salt,false);$('combo').textContent=`○ GOOD${detail.combo?` · PERFECT ×${detail.combo}`:''}`}else{addScore(points);skillSound(false);$('combo').textContent='MISS · 다음 타이밍!'}const board=$('board');if(verdict!=='miss'){board.classList.remove('seasoning-pop');void board.offsetWidth;board.classList.add('seasoning-pop');setTimeout(()=>board.classList.remove('seasoning-pop'),190)}$('feedback').textContent=verdict==='perfect'?(detail.count===detail.total?(!salt?`후추 완료${detail.combo>=3?' · PERFECT ×3':''}! 좋아요! 이번엔 소금!`:detail.combo>=3?'완벽한 밑간!':'소금 완료! 밑간 완료!'):`PERFECT! ${salt?'소금':'후추'}가 알맞게 뿌려졌어요`):verdict==='good'?`GOOD! 조금 더 뿌려졌어요 · ${salt?'소금':'후추'} ${detail.count}/${detail.total}`:'MISS · 다음 원이 겹칠 때 다시 눌러요';return points},
      onStirRhythm:(verdict,count,total)=>{if(stage!==next)return;skillSound(true);addScore(10);if(count===total){$('combo').textContent='✨';setCoach('맛있게 완성!\n다음 요리 단계로 가자!')}},onStirLap:(count,total,direction)=>{if(stage!==next)return;const video=cookingInteraction?.videoScene,verdict=video?.stirTimingVerdict?.()||'good';const points=verdict==='perfect'?100:verdict==='good'?50:20;addScore(points);skillSound(verdict!=='ok');$('counter').textContent=Array.from({length:total},(_,i)=>i<count?'●':'○').join(' ');$('gesture').textContent=count?'리듬에 맞춰 SPACE!':'원이 겹치는 순간 SPACE!';$('combo').textContent=verdict==='perfect'?'✨ PERFECT STIR':'○ GOOD';$('feedback').textContent=verdict==='perfect'?'PERFECT STIR! +100':verdict==='good'?'GOOD! +50':'OK! +20'},onCutAction:(count,total)=>{if(stage!==next)return;addScore(10);$('combo').textContent='착! +10';$('feedback').textContent=count===total?'재료 썰기 완료!':'칼질 완료! 다음 동작을 준비해요.'},onSequenceProgress:(index,count,total,sequence,amount,verdict)=>{if(stage!==next)return;if(selected===7){const label=sequence[index]?.label||step.label;$('counter').textContent=total>1?`${label} ${count}/${total}`:`${label} ✓`;$('feedback').textContent=index+1<sequence.length?`${label} 완료! 다음은 ${sequence[index+1].label}이에요.`:`${label} 완료!`;$('gesture').textContent=step.inputText||'초록 구간에서 SPACE!';return}const dots=(n,max)=>'●'.repeat(n)+'○'.repeat(max-n),pepper=sequence[0].hits||3,salt=sequence[1].hits||3;$('counter').textContent=`후추 ${dots(index===0?count:pepper,pepper)}  소금 ${dots(index===1?count:0,salt)}`;$('gesture').textContent=index===0?'후추 · 원이 겹칠 때 SPACE!':'소금 · 조금 빠른 리듬에 맞춰 SPACE!';if(verdict===null&&index===1&&count===0)$('feedback').textContent='좋아요! 이번엔 소금!';if(count===total&&index===0)$('feedback').textContent='후추 완료! 좋아요! 이번엔 소금!';if(count===total&&index===1){const allPerfect=cookingInteraction?.videoScene?.sequenceAmounts?.every(value=>value>=.99);$('feedback').textContent=allPerfect&&cookingInteraction?.videoScene?.perfectCombo>=3?'완벽한 밑간!':'밑간 완료!'}},
      onVideoDuration:(duration,videoStep)=>{setMeter(videoStep.perfectStart/duration*100,(videoStep.burnStart-videoStep.perfectStart)/duration*100,videoStep.manualTrigger?'적정 타이밍':'지금!')},onFeedback:message=>{$('feedback').textContent=message},onHoldChange:held=>{$('action').classList.toggle('is-holding',held)},onVideoAmountResult:result=>failVideoAmount(result),onPastaPourResult:amount=>{skillSound(false);$('feedback').textContent=amount<step.amountRange.min?'조금 더 부어주세요. 초록 구간에서 놓으면 성공!':'앗, 적정량을 넘겼어요. 다시 맞춰봐요!';$('combo').textContent=amount<step.amountRange.min?'조금만 더':'조금 많아요'},
      onVideoProgress:(percent,held)=>{const steakCook=selected===1&&videoTiming&&!step.manualTrigger;if(stage!==next)return;if(!videoHold&&!step.manualTrigger&&!steakCook&&!stirVideo)return;if(stirVideo){$('counter').textContent=`${percent}%`;$('feedback').textContent=held?'빙글빙글! 양념을 저어요.':'원을 그려 양념을 저어요';return}if(!steakCook)$('counter').textContent=`${percent}%`;if(videoHold){$('meter').style.setProperty('--pour-progress',`${percent}%`);if(step.amountRange){const p=percent/100,isServe=step.label==='카레 담기',pastaPour=step.interaction==='VIDEO_PASTA_HOLD',foodText=isServe?'카레를':pastaPour?'소스를':'물을';$('feedback').textContent=percent===0?`${step.holdPrompt||step.label}`:p<step.amountRange.min?`${foodText} 조금 더 ${isServe?'담아':'부어'}주세요`:p>step.amountRange.max?`너무 많이 ${isServe?'담았어요':'부었어요'} · 놓으면 다시 시도`:'적정량이에요 · 놓으면 성공!'}else $('feedback').textContent=`${step.holdPrompt||step.label}${held?' · 붓는 중…':' · 놓으면 멈춰요'}`}else if(steakCook){const ripe=percent>=Math.round(step.perfectStartFraction*100)&&percent<Math.round(step.burnStartFraction*100);$('feedback').textContent=ripe?'지금! 고기 표면이 알맞게 익었어요':'지글지글… 고기의 색과 표면을 살펴봐요';$('combo').textContent=ripe?'지금!':'✦'}else if(step.manualTrigger){const range=percent>=Math.round(step.perfectStartFraction*100)&&percent<=Math.round(step.burnStartFraction*100);$('feedback').textContent=range?(selected===1?'SPACE! 지금 뒤집어요':'초록 구간에서 눌러 카레를 넣으세요'):(selected===1?'지금 뒤집을 순간을 기다려요':'초록 구간에서 눌러 카레를 넣으세요')}}});
    if(step.ramenGameAnimation)$('counter').textContent='면 익힘 '+Math.round((ramenCookingState?.noodleStirProgress||0)*100)+'%';
    syncBubbles();return;
  }
  if(selected===5&&next===garnishStage()){setupRamenPlating();setCoach('마지막은 네가 원하는 라멘으로 꾸며보자!\n고명을 그릇 안에 끌어다 놓으면 돼.');return}const garnishInfo=finishings[selected];$('board').classList.add('drawing-mode');$('counter').textContent='FREE';$('board-label').textContent=garnishInfo.name;$('scene').innerHTML='<div class="finish-kitchen" aria-hidden="true"><img class="finish-background" src="assets/frying-prototype/kitchen-background.png"></div>';$('scene').insertAdjacentHTML('beforeend',`<span class="finish-food dish-art dish-${selected}" role="img" aria-label="주방 배경 위 완성된 ${recipes[selected].name}"></span>`);$('drawing').hidden=false;$('drawing').setAttribute('aria-label',garnishInfo.gesture);$('sauce').hidden=false;$('sauce').textContent=garnishInfo.button;$('gesture').textContent=garnishInfo.gesture;$('feedback').textContent=garnishInfo.feedback;setAction('요리 완성! <span>★</span>');setCoach(`${garnishInfo.name}로 마무리하자!\n음식에 맞게 예쁘게 올려봐.`);prepareCanvas();syncBubbles();
}

function timingResult(){
  const target=(meterLeft+meterWidth/2)/100,distance=Math.abs(pos-target),difficulty=recipeDifficulty[selected]||DIFFICULTY;
  const perfect=Math.max(.045,meterWidth/200/difficulty);
  return{good:distance<=perfect,near:distance<=perfect*2,early:pos<target};
}
function failVideoAmount(result){
  if(stage<0||stage>=cookingStepCount())return;
  const step=window.CookingPlans[selected].steps[stage],isServe=step.label==='카레 담기';
  playing=false;retryStage=stage;cookingInteraction?.videoScene?.pause();cookingInteraction?.sharedInteraction?.heldSources.clear();if(cookingInteraction?.videoScene)cookingInteraction.videoScene.isHeld=false;
  $('scene').classList.add('stage-failed');$('counter').textContent=result==='too_little'?'부족해요':'넘쳤어요';$('feedback').textContent=result==='too_little'?`${isServe?'카레를 조금':'물을 조금'} ${isServe?'담았어요':'부었어요'}. 적정량을 맞춰 다시 해보세요.`:`${isServe?'카레를 너무 많이 담았어요':'물을 너무 많이 부었어요'}. 적정량을 맞춰 다시 해보세요.`;
  $('hint').textContent='SPACE 또는 화면을 눌러 다시 도전해요';setAction(`${isServe?'다시 담기':'다시 붓기'} <span>↻</span>`);
}
function failStage(){
  cookingInteraction?.videoScene?.pause();
  playing=false;retryStage=stage;combo=0;addScore(stageScoreStart-score-8);$('scene').classList.add('stage-failed');
  $('counter').textContent='다시 도전';$('combo').textContent='💥';
  $('feedback').textContent='다섯 번 빗나갔어요. 화면을 누르거나 SPACE로 다시 시작해요.';
  setAction('이 단계 다시하기 <span>↻</span>');skillSound(false);
}
function timedCookingTap(){
  if(retryStage>=0){setStage(retryStage);return}
  if(!playing||stage<0||stage>=cookingStepCount()||!cookingInteraction)return;
  if(cookingInteraction.videoActionTriggered)return;
  const {good,near,early}=timingResult(),step=cookingInteraction.step;
  if(step.interaction==='VIDEO_TAP_SEQUENCE'){cookingInteraction.videoScene?.advanceTapChunk();return}
  if(step.interaction==='VIDEO_RAMEN'){
    const scene=cookingInteraction.videoScene,mode=scene?.ramenCurrentMode();
    if(mode==='timing'&&['bone','pepper'].includes(scene?.ramenCurrentAction)&&scene?.ramenCanAcceptTimingInput?.()===false)return;
    if(mode==='continuous'){scene.ramenInput('press');return}
    if(mode==='timing'){
      const result=timingResult();
      if(result.good||result.near){combo=result.good?combo+1:0;$('combo').textContent=result.good?'✨ PERFECT':'○ GOOD';$('feedback').textContent=scene.ramenCurrentAction==='bone'?'퐁당! 돼지뼈가 들어가요':scene.ramenCurrentAction==='pepper'?'톡! 후추를 뿌려요':'조리 중…';skillSound(true);scene.ramenTimingHit({verdict:result.good?'perfect':'good',...result})}
      else{combo=0;mistakes++;$('combo').textContent='MISS';$('feedback').textContent=`${result.early?'조금 일러요':'조금 늦었어요'} · 초록 구간에서 눌러요`;scene.ramenTimingHit({verdict:'miss',...result})}
      return;
    }
    cookingInteraction.sharedInteraction?.inputEvent({type:'pressStart',source:'keyboard',point:null,time:performance.now()});return;
  }
  if(['VIDEO_SEASONING','VIDEO_STIR_TIMING','VIDEO_PASTA_TIMING','VIDEO_PASTA_ACTION'].includes(step.interaction)){cookingInteraction.sharedInteraction?.inputEvent({type:'pressStart',source:'keyboard',point:null,time:performance.now()});return}
  if(selected===0&&step.action==='TOSS'&&!cookingInteraction.riceScene?.canFlip)return;
  if(step.interaction==='HOLD_AMOUNT'||step.interaction==='STIR'||step.interaction==='FLIP'||step.interaction==='POINTER_DRAW'||['VIDEO_HOLD','VIDEO_PASTA_HOLD'].includes(step.interaction))return;
  if(step.interaction==='COOK_TIMING'){
    if(!step.manualTrigger)cookingInteraction.videoScene?.sync();
    const phase=cookingInteraction.sharedInteraction.cookPhase();
    if(phase==='perfect'){$('combo').textContent=step.action==='FLIP'&&selected===1?'✨ PERFECT · 휙!':'✨ PERFECT';$('feedback').textContent=step.manualTrigger?(selected===1?(step.action==='FLIP'?'SPACE! 고기를 뒤집어요!':'고기를 뒤집어요!'):'카레를 넣어요!'):`${step.label} 완벽해요!`;addScore(12);if(step.action==='FLIP'&&selected===1){flipSound(true);const board=$('board');board.classList.remove('seasoning-pop');void board.offsetWidth;board.classList.add('seasoning-pop');setTimeout(()=>board.classList.remove('seasoning-pop'),340)}else rewardSound();if(step.manualTrigger){cookingInteraction.videoActionTriggered=true;cookingInteraction.videoScene?.playFromStart()}else cookingInteraction.applyTimedHit()}
    else if(step.action==='ADD'&&phase==='burnt'){$('combo').textContent='조금 늦었어요';$('feedback').textContent='다음 카레 조각이 들어올 때 한 번 탭해요.'}
    else{mistakes++;addScore(-2);$('combo').textContent=`${phase==='burnt'?(selected===1?'너무 늦어요':'탔어요'):'조금 더 기다려요'} · ${mistakes}/5`;$('feedback').textContent=step.action==='ADD'?'카레 조각이 냄비에 떨어질 때 한 번 탭해요.':step.video?(phase==='burnt'?(selected===1?'고기가 많이 익었어요.':'카레가 너무 오래 끓었어요.'):(selected===1?'고기가 익을 때까지 기다려요.':'카레가 조금 더 끓을 때까지 기다려요.')):phase==='raw'?'아직 생반죽이에요. 조금 기다려요.':phase==='burnt'?'타버렸어요. 그래도 다음 단계로 갈 수 있어요.':'완벽한 초록 구간을 기다려요.';if(phase==='burnt'){$('combo').textContent=selected===1?'🔥 너무 늦었어요':'🔥 탔어요';cookingInteraction.applyTimedHit();return}if(mistakes>=5)failStage()}
    return;
  }
  if(good||near){
    combo=good?combo+1:0;addScore(good?12:6);
    if(good&&combo%3===0){addScore(5);burst('✦',4)}
    $('combo').textContent=good?`✨ PERFECT${combo>1?' ×'+combo:''}`:'○ GOOD';
    $('feedback').textContent=good?`${step.label} 완벽해요!`:`${step.label} 성공!`;
    if(['TOSS','FLIP'].includes(step.action))flipSound(good);else skillSound(good);
    cookingInteraction.applyTimedHit();
    phase=(phase+.18)%1;pos=(Math.sin(phase*Math.PI*2-Math.PI/2)+1)/2;
    $('needle').style.left=`calc(${pos*100}% - 3px)`;
  }else{
    combo=0;mistakes++;addScore(-2);$('combo').textContent=`앗! ${mistakes}/5`;
    $('feedback').textContent=`${early?'조금 일러요':'조금 늦었어요'} · 초록 구간을 다시 노려요.`;
    cookingInteraction.applyTimedMiss();skillSound(false);if(mistakes>=5)failStage();
  }
}

function drawDishOnCanvas(){const canvas=$('drawing'),ctx=canvas.getContext('2d'),photo=dishImages[selected];ctx.save();ctx.beginPath();ctx.arc(400,165,158,0,Math.PI*2);ctx.clip();if(photo?.complete&&photo.naturalWidth){ctx.drawImage(photo,242,7,316,316)}else{const sprite=selected>=8?newFoodSprite:foodSprite,columns=selected>=8?3:4,rows=selected>=8?1:2,index=selected>=8?selected-8:selected,col=index%columns,row=Math.floor(index/columns),cellW=sprite.naturalWidth/columns,cellH=sprite.naturalHeight/rows;ctx.drawImage(sprite,col*cellW,row*cellH,cellW,cellH,242,7,316,316)}ctx.restore()}
function prepareCanvas(){const canvas=$('drawing'),ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height)}
function canvasPoint(event){const rect=$('drawing').getBoundingClientRect();return{x:(event.clientX-rect.left)*800/rect.width,y:(event.clientY-rect.top)*400/rect.height}}
function garnishIndex(){return selected===0||selected===2?0:selected===3?1:2}
function stampGarnish(x,y,scale=.5){const ctx=$('drawing').getContext('2d');if(!garnishSprite.complete||!garnishSprite.naturalWidth)return false;const sw=garnishSprite.naturalWidth/3,sh=garnishSprite.naturalHeight,w=118*scale,h=82*scale;ctx.drawImage(garnishSprite,garnishIndex()*sw,0,sw,sh,x-w/2,y-h/2,w,h);return true}
function drawLine(from,to){const ctx=$('drawing').getContext('2d'),finish=finishings[selected];if(finish.mode==='sprinkle'){const distance=Math.hypot(to.x-from.x,to.y-from.y),steps=Math.max(1,Math.min(3,Math.ceil(distance/70)));for(let i=0;i<=steps;i++){const t=i/steps,x=from.x+(to.x-from.x)*t+(Math.random()-.5)*14,y=from.y+(to.y-from.y)*t+(Math.random()-.5)*14;if(!stampGarnish(x,y,.34)){ctx.fillStyle=finish.colors[i%finish.colors.length];ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill()}}return}ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);if(selected===0){ctx.strokeStyle='#86241e';ctx.globalAlpha=.24;ctx.lineWidth=19;ctx.stroke();ctx.strokeStyle=finish.colors[0];ctx.globalAlpha=1;ctx.lineWidth=13;ctx.stroke();ctx.strokeStyle='#ff9180';ctx.globalAlpha=.68;ctx.lineWidth=2.5;ctx.stroke()}else{ctx.strokeStyle=finish.colors[0];ctx.globalAlpha=finish.mode==='ladle'?.86:1;ctx.lineWidth=finish.mode==='ladle'?30:16;ctx.stroke()}ctx.globalAlpha=1}
function addFinishTouch(){if(stage!==garnishStage())return;const finish=finishings[selected],offset=drawn%4;if(finish.mode==='sprinkle'){for(let i=0;i<5;i++){const x=305+Math.random()*190,y=135+Math.random()*150;if(!stampGarnish(x,y,.55))drawLine({x,y},{x:x+1,y:y+1})}}else if(finish.mode==='ladle'){const y=210+offset*19;drawLine({x:285,y},{x:505,y:y+30})}else{const y=195+offset*35;drawLine({x:275,y},{x:525,y:y+18})}drawn+=12;CookingMotion.play($('board'),recipes[selected].flow[garnishStage()].motion);$('feedback').textContent=`${finish.name} 마무리가 더해졌어요. 직접 이어서 꾸며도 좋아요.`}
function finish(){
  const tonkatsuSauce=selected===7&&stage===garnishStage()&&!$('drawing').hidden?$('drawing').toDataURL('image/png'):'';
  cookingInteraction?.videoScene?.stopRamenAmbient?.();cookingInteraction?.dispose();cookingInteraction=null;stage=resultStage();playing=false;
  $('board').classList.add('result-mode');syncBubbles();lockRecipes(false);updateSteps(stage);
  $('meter').hidden=true;$('drawing').hidden=true;$('sauce').hidden=true;$('restart').hidden=false;
  $('task-icon').textContent='🏆';$('stage-tag').textContent='요리 완성!';$('counter').textContent='FINISH';
  const recipe=recipes[selected],rank=rankFor(selected===0?score*.58:score);
  const stars=rank.grade==='S'||rank.grade==='A'?3:rank.grade==='B'?2:1;
  const key=`tiny-kitchen-best-${selected}`,previous=Number(localStorage.getItem(key)||0),best=Math.max(previous,score);
  localStorage.setItem(key,String(best));$('task-title').textContent=`${rank.grade} 랭크 · ${rank.title}`;
  const resultArt=selected===6?'<canvas class="result-art pancake-stack-art" width="720" height="420" role="img" aria-label="시럽과 과일을 얹은 팬케이크 세 장"></canvas>':selected===5?`<div class="result-art ramen-result-art" role="img" aria-label="직접 고명을 올려 완성한 ${recipe.name}">${ramenBowlMarkup(ramenCookingState?.toppings||[],true)}</div>`:selected===7?`<div class="result-art tonkatsu-finish-art" role="img" aria-label="직접 소스를 그려 완성한 돈가스"><img class="tonkatsu-finish-dish" src="assets/food/tonkatsu.webp" alt=""><img class="tonkatsu-finish-sauce" src="${tonkatsuSauce}" alt=""></div>`:`<div class="result-art dish-art dish-${selected}" role="img" aria-label="완성된 ${recipe.name}"></div>`;
  $('scene').innerHTML=`<div class="result-layout">${resultArt}<strong class="result-name">${recipe.full}</strong><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div><div class="rank-panel rank-${rank.grade.toLowerCase()}"><span class="rank-letter">${rank.grade}</span><div><strong>${rank.title}</strong><p>${rank.copy}</p><small>이번 점수 ${score} · 최고 ${best}</small></div></div><div class="rank-scale">${selected===0?"S 294+ · A 250+ · B 199+ · C":"S 170+ · A 145+ · B 115+ · C"}</div></div>`;
  if(selected===6)drawPancakeStack();
  $('board-label').textContent='루루의 랭킹 발표';$('feedback').textContent=`최종 ${score}점으로 ${rank.grade} 랭크! 다음에는 한 단계 위를 노려봐요.`;
  $('gesture').textContent='클릭 또는 SPACE로 다음 요리 시작';setAction('새 요리 만들기 <span>▶</span>');
  setCoach(`${rank.grade} 랭크야! 정말 멋져!\n다음엔 더 높은 랭크에 도전하자.`);rewardSound();
  for(let i=0;i<12;i++)setTimeout(()=>burst(['✦','★','✨'][i%3],3),i*45);
}
function drawPancakeStack(){
  const canvas=document.querySelector('.pancake-stack-art');if(!canvas)return;const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);
  const core=new Image();core.onload=()=>{if(stage!==resultStage()||selected!==6)return;c.clearRect(0,0,720,420);c.save();c.shadowColor='#60452a45';c.shadowBlur=24;c.shadowOffsetY=18;c.fillStyle='#fff5dc';c.beginPath();c.ellipse(360,346,262,54,0,0,Math.PI*2);c.fill();c.restore();c.fillStyle='#e6d1a7';c.beginPath();c.ellipse(360,340,260,50,0,0,Math.PI*2);c.fill();c.fillStyle='#fff8e5';c.beginPath();c.ellipse(360,330,247,43,0,0,Math.PI*2);c.fill();
    for(const [x,y,w,h,rot] of [[360,270,365,142,-.035],[360,207,365,142,.025],[360,144,365,142,-.018]]){c.save();c.translate(x,y);c.rotate(rot);c.shadowColor='#754c2c45';c.shadowBlur=10;c.shadowOffsetY=8;c.drawImage(core,-w/2,-h/2,w,h);c.restore()}
    c.save();c.translate(360,91);c.rotate(-.08);const butter=c.createLinearGradient(-25,-18,35,25);butter.addColorStop(0,'#fff2a4');butter.addColorStop(.55,'#ffd95a');butter.addColorStop(1,'#dcae38');c.fillStyle=butter;c.beginPath();c.roundRect(-30,-19,61,39,8);c.fill();c.restore();
    c.strokeStyle='#9d4d20';c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(244,109);c.bezierCurveTo(286,127,305,135,344,128);c.bezierCurveTo(385,120,425,103,466,116);c.stroke();c.strokeStyle='#e7a247';c.lineWidth=4;c.beginPath();c.moveTo(245,105);c.bezierCurveTo(286,123,305,131,344,124);c.bezierCurveTo(385,116,425,99,466,112);c.stroke();
    const berry=(x,y,r,color)=>{const g=c.createRadialGradient(x-r*.35,y-r*.4,1,x,y,r);g.addColorStop(0,'#ff9a79');g.addColorStop(1,color);c.fillStyle=g;c.beginPath();c.moveTo(x-r,y-r*.2);c.bezierCurveTo(x-r*1.2,y-r*1.3,x,y-r*1.5,x+r*.2,y-r*.7);c.bezierCurveTo(x+r*1.5,y-r*.9,x+r*1.1,y+r*.2,x,y+r);c.bezierCurveTo(x-r*.9,y+r*.3,x-r*1.2,y-r*.1,x-r,y-r*.2);c.fill();c.fillStyle='#f5d38a';for(let i=0;i<5;i++){c.beginPath();c.ellipse(x+Math.sin(i*2.4)*r*.42,y+Math.cos(i*2.4)*r*.52,1.8,2.5,.2,0,Math.PI*2);c.fill()}};
    berry(266,126,30,'#bd3340');berry(455,133,28,'#ca3540');c.fillStyle='#55934d';for(const [x,y] of [[262,98],[278,102],[450,104],[464,112]]){c.beginPath();c.ellipse(x,y,14,5,-.6,0,Math.PI*2);c.fill()}for(const [x,y] of [[307,94],[408,91],[490,152],[221,164],[345,82]]){c.fillStyle='#465b91';c.beginPath();c.arc(x,y,13,0,Math.PI*2);c.fill();c.fillStyle='#91a4d0';c.beginPath();c.arc(x-4,y-5,4,0,Math.PI*2);c.fill()}
  };core.onerror=()=>{c.fillStyle='#d9a45d';for(const y of [145,215,285]){c.beginPath();c.ellipse(360,y,175,57,0,0,Math.PI*2);c.fill()}};core.src='assets/frying-prototype/food/pancake-core.png';
}
function resetGame(){clearAdvance();cookingInteraction?.dispose();cookingInteraction=null;riceCookingState=null;pancakeCookingState=null;stage=-1;playing=false;score=0;addScore(0);syncBubbles();lockRecipes(false);updateSteps(-1);$('meter').hidden=true;$('drawing').hidden=true;$('sauce').hidden=true;$('restart').hidden=true;$('board').className='board';$('task-icon').textContent='👩‍🍳';$('stage-tag').textContent='메뉴를 골라주세요';$('task-title').textContent='오늘의 요리를 선택해요!';$('counter').textContent='READY';$('board-label').textContent='오늘의 메뉴판';$('combo').textContent='✦';$('gesture').textContent='메뉴를 고르고 요리를 시작해요';$('hint').textContent='바늘이 초록색일 때 SPACE 또는 화면 터치!';setAction('이 메뉴로 시작! <span>▶</span>');selectRecipe(selected)}
function action(){
  if(retryStage>=0){setStage(retryStage);return}
  if(stage===-1)openDifficulty();else if(stage>=0&&stage<cookingStepCount())timedCookingTap();
  else if(stage===garnishStage())finish();else if(stage===resultStage())resetGame();
}

document.querySelectorAll('.recipe-card').forEach(button=>button.addEventListener('click',()=>{selectRecipe(button.dataset.recipe);openDifficulty()}));
document.querySelectorAll('[data-difficulty]').forEach(button=>button.addEventListener('click',()=>{uiClick();selectDifficulty(button.dataset.difficulty)}));
document.querySelectorAll('[data-modal-difficulty]').forEach(button=>button.addEventListener('click',()=>{uiClick();selectDifficulty(button.dataset.modalDifficulty);closeDifficulty()}));
$('difficulty-close')?.addEventListener('click',()=>{uiClick();closeDifficulty()});
$('difficulty-begin')?.addEventListener('click',()=>{uiClick();closeDifficulty();if(!sound)setSound(true);score=0;addScore(0);setStage(0)});
$('action').onclick=event=>{if(stage>=0&&stage<cookingStepCount()){if(event.detail===0)timedCookingTap();return}action()};
$('action').addEventListener('pointerdown',event=>{if(retryStage>=0){event.preventDefault();setStage(retryStage);return}if(stage>=0&&stage<cookingStepCount()){event.preventDefault();const step=window.CookingPlans[selected].steps[stage];if(['VIDEO_HOLD','VIDEO_PASTA_HOLD'].includes(step.interaction)||step.interaction==='VIDEO_RAMEN'&&cookingInteraction?.videoScene?.ramenCurrentMode()==='hold'){try{event.currentTarget.setPointerCapture(event.pointerId)}catch{}cookingInteraction?.sharedInteraction?.setHeldSource('action-pointer',true)}else if(selected===6&&['HOLD_AMOUNT','FLIP'].includes(step.interaction))cookingInteraction?.keyboard(true);else timedCookingTap()}});
$('action').addEventListener('pointerup',()=>{if(stage>=0&&(['VIDEO_HOLD','VIDEO_PASTA_HOLD'].includes(window.CookingPlans[selected].steps[stage]?.interaction)||window.CookingPlans[selected].steps[stage]?.interaction==='VIDEO_RAMEN'&&cookingInteraction?.videoScene?.ramenCurrentMode()==='hold'))cookingInteraction?.sharedInteraction?.setHeldSource('action-pointer',false);if(selected===6)cookingInteraction?.keyboard(false)});
$('action').addEventListener('pointercancel',()=>{if(stage>=0&&(['VIDEO_HOLD','VIDEO_PASTA_HOLD'].includes(window.CookingPlans[selected].steps[stage]?.interaction)||window.CookingPlans[selected].steps[stage]?.interaction==='VIDEO_RAMEN'&&cookingInteraction?.videoScene?.ramenCurrentMode()==='hold'))cookingInteraction?.sharedInteraction?.setHeldSource('action-pointer',false);if(selected===6)cookingInteraction?.keyboard(false)});
$('meter').addEventListener('pointerdown',event=>{if(stage>=0&&stage<cookingStepCount()){event.preventDefault();timedCookingTap()}});
$('restart').onclick=resetGame;
$('sound').onclick=()=>{setSound(!sound);if(sound)rewardSound()};
document.addEventListener('click',event=>{if(event.target.closest('button'))uiClick()},true);
$('board').addEventListener('pointerdown',event=>{
  if(retryStage>=0){event.preventDefault();setStage(retryStage);return}
  if(stage>=0&&stage<cookingStepCount()){
    const step=window.CookingPlans[selected].steps[stage];
    if(['VIDEO_HOLD','VIDEO_PASTA_HOLD'].includes(step.interaction)||step.interaction==='VIDEO_RAMEN'&&cookingInteraction?.videoScene?.ramenCurrentMode()==='hold'){event.preventDefault();if(videoPointerId!==null)return;videoPointerId=event.pointerId;try{event.currentTarget.setPointerCapture(event.pointerId)}catch{}cookingInteraction?.sharedInteraction?.setHeldSource(`board-pointer-${event.pointerId}`,true);return}
    if(!event.target.closest('.cooking-interaction-canvas')){event.preventDefault();timedCookingTap()}
  }
});
$('board').addEventListener('pointerup',event=>{if(videoPointerId!==event.pointerId)return;cookingInteraction?.sharedInteraction?.setHeldSource(`board-pointer-${event.pointerId}`,false);videoPointerId=null});
$('board').addEventListener('pointercancel',event=>{if(videoPointerId!==event.pointerId)return;cookingInteraction?.sharedInteraction?.setHeldSource(`board-pointer-${event.pointerId}`,false);videoPointerId=null});
document.addEventListener('keydown',event=>{
  if(event.code!=='Space'||event.repeat||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;
  if(!$('settings-modal').hidden||!$('device-picker').hidden||!$('difficulty-modal').hidden||!$('intro').classList.contains('is-hidden'))return;
  if(retryStage>=0){event.preventDefault();setStage(retryStage);return}
  event.preventDefault();if(stage>=0&&stage<cookingStepCount()){const step=window.CookingPlans[selected].steps[stage];if(step.subActions&&!(selected===2&&step.action==='CUT'))return;if(['VIDEO_HOLD','VIDEO_PASTA_HOLD','VIDEO_RHYTHM','VIDEO_STIR_TIMING','VIDEO_RAMEN'].includes(step.interaction)||selected===6)cookingInteraction?.keyboard(true);else{if(selected===0&&step.action==='STIR')cookingInteraction?.riceScene?.playStirVideo();timedCookingTap()}}else if(stage===garnishStage())addFinishTouch();else action();
});
document.addEventListener('keyup',event=>{if(event.code==='Space'&&(selected===6||stage>=0&&['VIDEO_HOLD','VIDEO_PASTA_HOLD','VIDEO_RHYTHM','VIDEO_STIR_TIMING','VIDEO_RAMEN'].includes(window.CookingPlans[selected].steps[stage]?.interaction)))cookingInteraction?.keyboard(false)});

function closeIntro(){const intro=$('intro');if(!intro||intro.classList.contains('is-hidden'))return;intro.classList.add('is-hidden');if(!sound)setSound(true);uiClick()}
$('intro-start')?.addEventListener('click',closeIntro);$('intro-skip')?.addEventListener('click',closeIntro);
$('settings')?.addEventListener('click',()=>{$('settings-modal').hidden=false;$('settings-close')?.focus()});$('settings-close')?.addEventListener('click',()=>{$('settings-modal').hidden=true;$('settings')?.focus()});$('choose-device-again')?.addEventListener('click',showDevicePicker);document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>applyDeviceMode(button.dataset.device)));document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('settings-modal').hidden){$('settings-modal').hidden=true;$('settings')?.focus()}});
const canvas=$('drawing');
canvas.onpointerdown=event=>{if(stage!==garnishStage()||drawing)return;event.preventDefault();uiClick();drawing=true;drawingPointerId=event.pointerId;prev=canvasPoint(event);canvas.setPointerCapture(event.pointerId)};
canvas.onpointermove=event=>{if(!drawing||stage!==garnishStage()||event.pointerId!==drawingPointerId)return;event.preventDefault();const samples=event.getCoalescedEvents?.();for(const sample of samples?.length?samples:[event]){const point=canvasPoint(sample);drawLine(prev,point);prev=point;drawn++;if(drawn===12)$('feedback').textContent=`좋아요! ${finishings[selected].name}를 더하거나 바로 완성해도 돼요.`}};
canvas.onpointerup=canvas.onpointercancel=event=>{if(!drawing||event.pointerId!==drawingPointerId)return;if(stage===garnishStage())CookingMotion.play($('board'),recipes[selected].flow[garnishStage()].motion);drawing=false;drawingPointerId=null;prev=null;try{canvas.releasePointerCapture(event.pointerId)}catch{}};
$('sauce').onclick=addFinishTouch;

function tick(time){
  const ramenTiming=selected===5&&cookingInteraction?.step.ramenMode&&(cookingInteraction.step.ramenModeType==='timing'||cookingInteraction.videoScene?.ramenCurrentMode?.()==='timing');
  if(playing&&ramenTiming&&cookingInteraction.videoScene?.ramenActionPlaying&&!cookingInteraction.videoScene?.ramenPepperSequenceActive){last=time;requestAnimationFrame(tick);return}
  if(playing&&cookingInteraction?.videoScene&&stage>=0&&stage<cookingStepCount()&&!cookingInteraction.step.cutVideoSequence&&!ramenTiming){
    const step=cookingInteraction.step;pos=step.manualTrigger?Math.min(1,cookingInteraction.sharedInteraction.cookElapsed/(step.burnStart||1)):cookingInteraction.videoScene.progress;$('needle').style.left=`calc(${pos*100}% - 3px)`;
    last=time;requestAnimationFrame(tick);return;
  }
  if(last&&playing&&stage>=0&&stage<cookingStepCount()&&cookingInteraction&&document.visibilityState==='visible'&&$('settings-modal').hidden&&$('device-picker').hidden){
    const difficultySpeed={easy:1,normal:.9,hard:.72}[difficultyLevel]||1;
    const action=window.CookingPlans[selected].steps[stage].action;
    const stageSpeed=[0,4].includes(selected)?({CUT:1250,ADD:1120,STIR:1000,TOSS:850}[action]||1000):[1250,1150,1000,850][stage]||1000;
    phase=(phase+Math.min(time-last,50)/(stageSpeed*GAUGE_PERIOD_SCALE*difficultySpeed))%1;
    pos=(Math.sin(phase*Math.PI*2-Math.PI/2)+1)/2;
    $('needle').style.left=`calc(${pos*100}% - 3px)`;
  }
  last=time;requestAnimationFrame(tick);
}
document.addEventListener('keydown',event=>{if(event.code!=='Space'||event.repeat||selected!==5||!playing||stage<0||stage>=cookingStepCount()||!cookingInteraction?.videoScene||cookingInteraction.videoScene.ramenCurrentMode()!=='timing')return;if(!$('settings-modal').hidden||!$('device-picker').hidden||!$('intro').classList.contains('is-hidden'))return;event.preventDefault();event.stopImmediatePropagation();timedCookingTap()},true);
initDeviceMode();requestAnimationFrame(tick);resetGame();

// Ramen plating uses crops of the real source illustration rather than emoji controls.
const ramenSourceObjects=[
  {id:'nori',name:'김',stock:3,box:[38,252,235,171],hit:[[0,10],[88,0],[100,64],[58,100],[0,76]]},
  {id:'meat',name:'고기',stock:3,box:[393,330,157,139],hit:[[17,12],[47,0],[83,12],[100,48],[82,88],[46,100],[7,74],[0,42]]},
  {id:'scallion',name:'파',stock:4,box:[0,431,259,176],hit:[[0,22],[25,0],[95,3],[100,82],[71,100],[5,93]]},
  {id:'gungchae',name:'궁채',stock:3,box:[301,472,225,91],hit:[[0,54],[30,0],[100,25],[91,68],[26,100]]},
  {id:'egg',name:'계란',stock:2,box:[56,635,122,148],hit:[[18,1],[66,0],[100,25],[90,75],[55,100],[18,89],[0,48]]},
  {id:'fishcake',name:'어묵',stock:3,box:[190,607,106,130],hit:[[40,0],[76,7],[100,34],[94,72],[69,100],[28,93],[0,61],[4,25]]}
];
const ramenSpriteCache=Object.create(null);
function ramenSprite(type){
  if(ramenSpriteCache[type.id])return ramenSpriteCache[type.id];
  const img=document.querySelector('.ramen-plating-backdrop');if(!img?.complete||!img.naturalWidth)return '';
  const [x,y,w,h]=type.box,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.save();ctx.beginPath();type.hit.forEach(([px,py],i)=>{const xx=px/100*w,yy=py/100*h;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)});ctx.closePath();ctx.clip();ctx.drawImage(img,x,y,w,h,0,0,w,h);ctx.restore();return ramenSpriteCache[type.id]=canvas.toDataURL('image/png');
}
function ramenBowlMarkup(toppings=ramenCookingState?.toppings||[],isResult=false){
  const items=toppings.map(item=>{const type=ramenSourceObjects.find(x=>x.id===item.type)||ramenSourceObjects[0],src=item.src||ramenSprite(type);return `<img class="ramen-placed-topping topping-${type.id}" data-id="${item.id}" data-topping="${item.type}" src="${src}" alt="${type.name}" draggable="false" style="--tx:${item.x*100}%;--ty:${item.y*100}%;--trot:${item.rotation||0}deg;--tscale:${item.scale||1}">`}).join('');
  return `<div class="ramen-bowl-scene${isResult?' ramen-result-bowl':''}"><img class="ramen-plating-backdrop" src="assets/ramen/고명올리기.png" alt="고명 트레이와 라멘 그릇"><div class="ramen-free-topping-layer">${items}</div>${isResult?'':'<p class="ramen-plating-tip">왼쪽 트레이의 고명을 끌어 그릇에 놓아요</p>'}</div>`;
}
function setupRamenPlating(){
  document.body.classList.add('ramen-cooking');$('board').className='board ramen-plating-board';$('board-label').textContent='고명 자유롭게 올리기';$('counter').textContent=`고명 ${ramenCookingState.toppings.length}개`;$('gesture').textContent='트레이에서 고명을 끌어 원하는 곳에 놓아요';$('feedback').textContent='고명은 그릇 안에 자유롭게 놓고 다시 옮길 수 있어요.';$('hint').hidden=true;$('meter').hidden=true;$('drawing').hidden=true;$('sauce').hidden=true;setAction('요리 완성! <span>★</span>');$('action').disabled=!ramenCookingState.toppings.length;
  const sources=ramenSourceObjects.map(type=>{const [x,y,w,h]=type.box,poly=type.hit.map(([px,py])=>`${px}% ${py}%`).join(',');return `<button class="ramen-source-hit" type="button" data-source="${type.id}" aria-label="${type.name} 집기" style="left:${x/15.62}%;top:${y/10.24}%;width:${w/15.62}%;height:${h/10.24}%;clip-path:polygon(${poly})"><span>${type.name}</span><small data-stock="${type.id}">${type.stock}</small></button>`}).join('');
  $('scene').innerHTML=`${ramenBowlMarkup()}<div class="ramen-source-hit-layer">${sources}</div><div class="ramen-drag-ghost" hidden></div>`;const scene=$('scene'),backdrop=scene.querySelector('.ramen-plating-backdrop');const prepare=()=>ramenSourceObjects.forEach(type=>ramenSprite(type));if(backdrop.complete)prepare();else backdrop.addEventListener('load',prepare,{once:true});
  scene.addEventListener('pointerdown',event=>{const placed=event.target.closest('.ramen-placed-topping'),source=event.target.closest('.ramen-source-hit');if(!placed&&!source)return;event.preventDefault();const id=placed?.dataset.topping||source.dataset.source,type=ramenSourceObjects.find(x=>x.id===id),recordId=placed?.dataset.id||null,stock=scene.querySelector(`[data-stock="${id}"]`);if(!recordId&&(!stock||Number(stock.textContent)<=0))return;const src=recordId?ramenCookingState.toppings.find(x=>x.id===recordId)?.src||ramenSprite(type):ramenSprite(type);if(!src)return;ramenDrag={typeId:id,recordId,pointerId:event.pointerId,src};const ghost=scene.querySelector('.ramen-drag-ghost');ghost.innerHTML=`<img src="${src}" alt="">`;ghost.hidden=false;ghost.style.left=`${event.clientX}px`;ghost.style.top=`${event.clientY}px`;try{scene.setPointerCapture(event.pointerId)}catch{}});
  scene.addEventListener('pointermove',event=>{if(!ramenDrag||ramenDrag.pointerId!==event.pointerId)return;const ghost=scene.querySelector('.ramen-drag-ghost');ghost.style.left=`${event.clientX}px`;ghost.style.top=`${event.clientY}px`});
  const drop=event=>{if(!ramenDrag||ramenDrag.pointerId!==event.pointerId)return;const drag=ramenDrag;ramenDrag=null;scene.querySelector('.ramen-drag-ghost').hidden=true;const bounds=scene.getBoundingClientRect(),x=(event.clientX-bounds.left)/bounds.width,y=(event.clientY-bounds.top)/bounds.height;const dx=(x-.665)/.258,dy=(y-.55)/.29,inside=dx*dx+dy*dy<=1;let changed=false;if(inside){if(drag.recordId){const item=ramenCookingState.toppings.find(e=>e.id===drag.recordId);if(item){item.x=x;item.y=y;changed=true}}else{const item={id:`ramen-top-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type:drag.typeId,x,y,rotation:(Math.random()*12-6),scale:1,src:drag.src};ramenCookingState.toppings.push(item);const stock=scene.querySelector(`[data-stock="${drag.typeId}"]`);stock.textContent=String(Math.max(0,Number(stock.textContent)-1));changed=true}}if(changed){scene.querySelector('.ramen-bowl-scene').outerHTML=ramenBowlMarkup();$('counter').textContent=`고명 ${ramenCookingState.toppings.length}개`;$('feedback').textContent='톡! 고명이 라멘 위에 놓였어요.';$('action').disabled=false;skillSound(true);burst('✦',2)}};
  scene.addEventListener('pointerup',drop);scene.addEventListener('pointercancel',drop);
}

if(document.modelContext?.registerTool){try{document.modelContext.registerTool({name:'start_cooking_game',title:'요리 게임 시작',description:'선택한 요리의 조리 단계를 시작합니다.',inputSchema:{type:'object',properties:{recipe:{type:'integer',minimum:0,maximum:recipes.length-1}},required:['recipe'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!Number.isInteger(input?.recipe)||input.recipe<0||input.recipe>=recipes.length)throw Error(`recipe must be an integer from 0 to ${recipes.length-1}`);if(stage>=0&&stage<resultStage())throw Error('game in progress');selectRecipe(input.recipe);score=0;addScore(0);setStage(0);return{recipe:recipes[selected].name,stage:'chopping',score}}})}catch{}}
