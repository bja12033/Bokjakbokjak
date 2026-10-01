/* Shared interaction and drawing system. Recipes supply actions and food colors; motion stays here. */
const COOKING_PLANS=[
  {food:'rice',vessel:'pan',steps:[
    ['CUT','당근 썰기','초록 구간에 맞춰 당근을 썰어요','carrot'],
    ['CUT','양파 썰기','초록 구간에 맞춰 양파를 썰어요','onion'],
    ['CUT','피망 썰기','초록 구간에 맞춰 피망을 썰어요','pepper'],
    ['ADD','당근 넣기','초록 구간에 맞춰 당근을 넣어요','carrot'],
    ['ADD','양파 넣기','초록 구간에 맞춰 양파를 넣어요','onion'],
    ['ADD','피망 넣기','초록 구간에 맞춰 피망을 넣어요','pepper'],
    ['ADD','고기 넣기','초록 구간에 맞춰 고기를 넣어요','meat'],
    ['STIR','주걱으로 볶기','초록 구간에 맞춰 주걱으로 볶아요',null,{stirVideo:'assets/videos/fried-rice-stir.mp4'}],
    ['TOSS','팬 뒤집기','팬을 세 번 뒤집어 볶음밥을 골고루 섞어요',null,{goal:3,requiredFlips:3,inputText:'팬을 뒤집어 주세요! 초록 구간에 맞춰 눌러요.'}]
  ]},
  {food:'steak',vessel:'pan',hasFreeGarnish:false,steps:[
    ['SEASON','고기 밑간하기','후추와 소금을 알맞은 순간에 뿌려요',null,{interaction:'VIDEO_SEASONING',inputText:'원이 겹치는 순간 SPACE!',successMessage:'밑간이 끝났어요. 앞면을 구워볼까요?',videoSequence:[{label:'후추',video:'assets/videos/steak-pepper.mp4',hits:3,periodMs:1800},{label:'소금',video:'assets/videos/steak-salt.mp4',hits:3,periodMs:1520}]}],
    ['COOK_TIMING','고기 앞면 굽기','고기의 색과 표면을 보고 알맞게 익었을 때 눌러요',null,{interaction:'COOK_TIMING',inputText:'지글지글… 고기 색과 표면을 보고 익었을 때 SPACE',successMessage:'앞면이 알맞게 익었어요. 이제 뒤집어요!',video:'assets/videos/steak-front.mp4',loop:true,rawDuration:0,perfectStartFraction:.62,burnStartFraction:.84}],
    ['FLIP','고기 뒤집기','초록 구간에서 SPACE를 누르면 한 번 뒤집어요',null,{interaction:'COOK_TIMING',inputText:'초록 구간에서 한 번 눌러 고기를 뒤집어요',successMessage:'고기가 잘 뒤집혔어요. 뒷면도 구워볼까요?',video:'assets/videos/steak-flip.mp4',manualTrigger:true,completeOnEnded:true,rawDuration:.65,perfectStartFraction:.50,burnStartFraction:.85}],
    ['COOK_TIMING','고기 뒷면 굽기','고기 색과 표면을 보고 알맞게 익었을 때 눌러요',null,{interaction:'COOK_TIMING',inputText:'지글지글… 고기 색과 표면을 보고 익었을 때 SPACE',successMessage:'뒷면까지 잘 익었어요. 소스를 부어 마무리해요!',video:'assets/videos/steak-back.mp4',loop:true,rawDuration:0,perfectStartFraction:.61,burnStartFraction:.83}],
    ['POUR','소스 붓기','누르고 있는 동안 소스가 부어지고 놓으면 멈춰요',null,{interaction:'VIDEO_HOLD',goal:1,inputText:'SPACE를 누르고 있는 동안 소스를 부어요 · 놓으면 멈춰요',holdPrompt:'소스를 부어주세요',successMessage:'소스가 잘 뿌려졌어요!',video:'assets/videos/steak-sauce.mp4'}]
  ]},
  {food:'tteok',vessel:'pot',steps:[
    ['CUT','재료 썰기','초록 구간에 맞춰 파와 어묵을 차례로 썰어요','scallion',{goal:10,cutVideoSequence:true,subActions:[{label:'파 썰기'},{label:'어묵 썰기'}],inputText:'바늘이 초록색일 때 SPACE · 터치',videoSequence:[{video:'assets/videos/tteok-scallion-cut.mp4',taps:5},{video:'assets/videos/tteok-fishcake-cut.mp4',taps:5}]}],
    ['POUR','양념 넣기','누르고 있는 동안 양념을 부어요. 놓으면 멈춰요','sauce',{interaction:'VIDEO_HOLD',goal:1,inputText:'SPACE를 누르고 양념을 부어요 · 놓으면 멈춰요',holdPrompt:'양념을 넣어주세요',successMessage:'양념을 넣었어요!',video:'assets/videos/tteok-sauce.mp4'}],
    ['STIR','끓이며 젓기','원이 겹칠 때 SPACE로 저어주세요',null,{interaction:'VIDEO_STIR_TIMING',goal:3,stirTimingRounds:3,stirPeriodsMs:[2400,2050,1750],inputText:'원이 겹칠 때 SPACE로 저어주세요!',successMessage:'맛있게 완성!',video:'assets/videos/tteok-stir.mp4'}]
  ]},
  {food:'pasta',vessel:'pot',hasFreeGarnish:false,steps:[
    ['BOIL','물 끓이기','물이 보글보글 끓을 때 SPACE를 눌러요',null,{interaction:'VIDEO_PASTA_TIMING',pastaMode:true,pastaAction:'boil',pastaTarget:1,goal:1,pastaPeriodMs:3200,inputText:'물이 충분히 끓을 때 SPACE!',successMessage:'물이 팔팔 끓어요. 면을 넣어볼까요?',video:'assets/videos/pasta-boil.mp4',loop:true}],
    ['PLACE','면 넣기','SPACE를 눌러 면을 넣어요',null,{interaction:'VIDEO_PASTA_ACTION',pastaMode:true,pastaAction:'add',pastaTarget:1,goal:1,inputText:'SPACE를 눌러 면을 넣어요!',successMessage:'풍덩! 면이 물에 들어갔어요.',video:'assets/videos/pasta-add.mp4',loop:true}],
    ['BOIL','면 삶기','면이 부드럽게 익을 때 SPACE로 확인해요',null,{interaction:'VIDEO_PASTA_TIMING',pastaMode:true,pastaAction:'cook',pastaTarget:2,goal:1,pastaPeriodMs:3400,inputText:'면이 부드럽게 익으면 SPACE!',successMessage:'면이 알맞게 익었어요.',video:'assets/videos/pasta-cook.mp4',loop:true}],
    ['POUR','토마토 소스 붓기','SPACE를 누르고 적정량에서 놓아요',null,{interaction:'VIDEO_PASTA_HOLD',pastaMode:true,pastaAction:'pour',goal:1,rate:.24,amountRange:{min:.42,max:.76},inputText:'SPACE를 누르고 토마토 소스를 부어요 · 적정량에서 놓기',holdPrompt:'토마토 소스를 부어주세요',successMessage:'소스가 알맞게 들어갔어요!',video:'assets/videos/pasta-sauce-pour.mp4',loop:true}],
    ['STIR','소스 섞기','원이 겹칠 때 SPACE로 면과 소스를 섞어요',null,{interaction:'VIDEO_PASTA_TIMING',pastaMode:true,pastaAction:'stir',pastaTarget:3,goal:1,pastaPeriodMs:1850,inputText:'원이 겹칠 때 SPACE로 섞어요!',successMessage:'토마토 소스가 면에 잘 배었어요!',video:'assets/videos/pasta-sauce-mix.mp4',loop:true}]
  ]},
  {food:'curry',vessel:'pot',hasFreeGarnish:false,steps:[['CUT','당근 썰기','초록 구간에 맞춰 당근을 썰어요','carrot'],['CUT','양파 썰기','초록 구간에 맞춰 양파를 썰어요','onion'],['CUT','감자 썰기','초록 구간에 맞춰 감자를 썰어요','potato'],['ADD','카레 넣기','알맞은 순간에 눌러야 카레가 들어가요','curry',{interaction:'COOK_TIMING',inputText:'알맞은 순간에 한 번 눌러 카레를 넣어요 · SPACE / 터치',video:'assets/videos/curry-add.mp4',manualTrigger:true,completeOnEnded:true,rawDuration:.4,perfectStartFraction:.50,burnStartFraction:.84}],['POUR','물 붓기','적정량에서 놓으면 성공해요',null,{interaction:'VIDEO_HOLD',goal:1,inputText:'SPACE를 누르고 적정량에서 놓으세요 · 목표 구간은 초록색이에요',holdPrompt:'물을 부어주세요',amountRange:{min:.45,max:.80},video:'assets/videos/curry-water.mp4'}],['COOK_TIMING','저으며 끓이기','카레가 알맞게 끓을 때 눌러요',null,{interaction:'COOK_TIMING',inputText:'알맞게 끓을 때 SPACE · 탭',successMessage:'카레가 알맞게 끓었어요. 담아볼까요?',video:'assets/videos/curry-simmer.mp4',stateKey:'currySimmered',rawDuration:.4,perfectStart:2.6,burnStart:3.35,perfectStartFraction:.65,burnStartFraction:.8375}],['POUR','카레 담기','적정량에서 놓으면 성공해요',null,{interaction:'VIDEO_HOLD',goal:1,inputText:'SPACE를 누르고 적정량에서 놓으세요 · 목표 구간은 초록색이에요',holdPrompt:'카레를 담아주세요',amountRange:{min:.55,max:.85},video:'assets/videos/curry-serve.mp4'}]]},
  {food:'ramen',vessel:'pot',steps:[
    ['ADD','육수 만들기','초록색에 맞춰 돼지뼈를 한 번 넣고, 후추는 세 번 톡톡 뿌려요','porkBone',{interaction:'VIDEO_RAMEN',ramenMode:true,ramenSequence:[{action:'bone',label:'돼지뼈 넣기',inputText:'초록 구간에서 SPACE로 돼지뼈를 넣어요!',referenceVideo:'assets/videos/ramen-bone.mp4',target:1},{action:'pepper',label:'후추 뿌리기',inputText:'초록 구간에서 SPACE로 후추를 톡톡 뿌려요!',referenceVideo:'assets/videos/ramen-pepper.mp4',target:3},{action:'soy',label:'간장 넣기',inputText:'SPACE를 누르고 적정량의 간장을 부어요',referenceVideo:'assets/videos/ramen-soy.mp4',amountRange:{min:.34,max:.72},rate:.38}],video:'assets/videos/ramen-bone.mp4',loop:true,goal:1,successMessage:'깊은 육수가 준비됐어요!'}],
    ['BOIL','육수 끓이기','육수가 보글보글 끓어오를 때 SPACE!', 'broth',{interaction:'VIDEO_RAMEN',ramenMode:true,ramenAction:'boil',ramenModeType:'timing',ramenTarget:1,ramenPeriodMs:2500,referenceVideo:'assets/videos/ramen-broth.mp4',video:'assets/videos/ramen-broth.mp4',loop:true,goal:1,successMessage:'육수가 팔팔 끓어요!'}],
    ['PLACE','면 넣기','초록색에 맞춰 SPACE로 면을 넣어요','noodles',{interaction:'VIDEO_RAMEN',ramenMode:true,ramenAction:'noodleAdd',ramenModeType:'timing',ramenTarget:1,ramenPeriodMs:2400,actionEndFraction:.84,referenceVideo:'assets/videos/ramen-noodle-add.mp4',video:'assets/videos/ramen-noodle-add.mp4',loop:true,goal:1,successMessage:'면이 육수에 들어갔어요!'}],
    ['BOIL','면 저으며 삶기','SPACE를 톡톡 눌러 면을 계속 저어요','noodles',{interaction:'VIDEO_RAMEN',ramenMode:true,ramenAction:'noodleStir',ramenModeType:'continuous',ramenGameAnimation:true,ramenBackground:'assets/ramen/noodle-stir-background.png',ramenHandSprite:'assets/ramen/noodle-stir-hand.png',ramenNoodleSprite:'assets/ramen/noodle-stir-noodles.png',referenceVideo:'assets/videos/ramen-noodle-cook.mp4',video:'assets/videos/ramen-noodle-cook.mp4',loop:true,goal:1,successMessage:'면이 탱글하게 익었어요!'}],
    ['POUR','육수 붓기','SPACE를 누르고 원하는 만큼 육수를 부어요','broth',{interaction:'VIDEO_RAMEN',ramenMode:true,ramenAction:'brothPour',ramenModeType:'hold',amountRange:{min:.36,max:.76},rate:.29,referenceVideo:'assets/videos/ramen-broth-pour.mp4',video:'assets/videos/ramen-broth-pour.mp4',loop:true,goal:1,successMessage:'따끈한 육수가 그릇에 담겼어요!'}]
  ]},
  {food:'pancake',vessel:'pan',steps:[['POUR','반죽 붓기','아래로 드래그해 반죽을 부어요'],['GRILL','첫 면 굽기','누르고 유지해 가장자리를 익혀요'],['FLIP','팬케이크 뒤집기','빠르게 위로 밀어 팬케이크를 뒤집어요'],['GRILL','반대 면 굽기','누르고 유지해 노릇하게 구워요']]},
  {food:'tonkatsu',vessel:'pan',hasFreeGarnish:true,steps:[
    ['SEASON','고기 밑간하기','후추를 뿌린 뒤 소금을 뿌려요',null,{interaction:'VIDEO_SEASONING',playerActionSequence:true,goal:1,inputText:'게이지가 초록색일 때 SPACE!',successMessage:'밑간이 끝났어요!',videoSequence:[{label:'후추',video:'assets/videos/tonkatsu/pepper.mp4',hits:1,periodMs:1850},{label:'소금',video:'assets/videos/tonkatsu/salt.mp4',hits:1,periodMs:1700}]}],
    ['COAT','고기 두드리기','초록 구간에 SPACE를 눌러 고기를 두드려요',null,{interaction:'VIDEO_SEASONING',playerActionSequence:true,goal:1,inputText:'초록 구간에서 SPACE!',successMessage:'고기가 부드러워졌어요!',videoSequence:[{label:'고기 두드리기',video:'assets/videos/tonkatsu/tenderize.mp4',hits:1,periodMs:1850}]}],
    ['COAT','옷 입히기','밀가루 → 계란물 → 튀김가루 순서로 입혀요',null,{interaction:'VIDEO_SEASONING',playerActionSequence:true,goal:1,inputText:'초록 구간에서 SPACE!',successMessage:'돈까스 옷을 입혔어요!',videoSequence:[{label:'밀가루',video:'assets/videos/tonkatsu/flour.mp4',hits:1,periodMs:1850},{label:'계란물',video:'assets/videos/tonkatsu/egg.mp4',hits:1,periodMs:1850},{label:'튀김가루',video:'assets/videos/tonkatsu/crumbs.mp4',hits:1,periodMs:1850}]}],
    ['COOK_TIMING','기름 온도 맞추기','기름 표면을 보며 초록 구간에 맞춰요',null,{interaction:'VIDEO_SEASONING',playerActionSequence:true,goal:1,inputText:'기름이 준비되면 초록 구간에서 SPACE!',successMessage:'기름 온도가 알맞아요!',videoSequence:[{label:'기름 온도',video:'assets/videos/tonkatsu/oil.mp4',hits:1,periodMs:1900}]}],
    ['FRY','튀기기','초록 구간에 SPACE를 눌러 돈까스를 튀겨요',null,{interaction:'VIDEO_SEASONING',playerActionSequence:true,goal:1,inputText:'초록 구간에서 SPACE로 튀겨요!',successMessage:'바삭한 돈까스가 완성됐어요!',videoSequence:[{label:'튀기기',video:'assets/videos/tonkatsu/fry.mp4',hits:1,periodMs:1900}] }]
  ]},
  {food:'udon',vessel:'pot',steps:[['POUR','육수 붓기','아래로 드래그해 육수를 부어요'],['BOIL','육수 끓이기','누르고 유지해 육수를 끓여요'],['PLACE','우동면 넣기','냄비를 눌러 우동면을 넣어요'],['STIR','면 풀기','원을 그려 면발을 풀어요']]}
].map(plan=>({...plan,steps:plan.steps.map(([action,label,instruction,ingredient,options])=>({action,label,instruction,ingredient,goal:({CUT:5,ADD:1,PLACE:4,STIR:5,COOK_TIMING:1,TOSS:1,FLIP:1,SEASON:1,POUR:5,GRILL:5,BOIL:5,FRY:5,COAT:5,TOPPING:5,BAKE:5})[action],...options}))}));

const COOKING_PALETTES={
  rice:['#f6df9f','#edbd62','#e98541','#91b962'],steak:['#8e3e2b','#bc7147','#ebbd77','#657b37'],
  tteok:['#e96335','#f4a159','#f9c481','#69a452'],pasta:['#dd9b41','#edc974','#c75637','#53924f'],
  curry:['#ad6928','#db9c3b','#f1c361','#e78b4c'],ramen:['#d4a357','#e9c77d','#8c5836','#65a15a'],
  pancake:['#d99642','#e9bb6e','#f5d790','#ba6c36'],tonkatsu:['#af6b2a','#e4a642','#f0c768','#91572a'],
  udon:['#ede1bc','#f8edcf','#ba8b55','#6ba85d']
};
const COOKING_CORE_STAGE={rice:1,steak:0,tteok:1,pasta:2,curry:4,ramen:2,pancake:0,tonkatsu:0,udon:2};
const COOKING_PARTICLE_COUNT={rice:130,steak:12,tteok:30,pasta:24,curry:25,ramen:26,pancake:12,tonkatsu:36,udon:24};

class CookingInteraction{
  constructor(scene,plan,step,onProgress,onComplete,options={}){
    this.scene=scene;this.plan=plan;this.step=step;this.onProgress=onProgress;this.onComplete=onComplete;this.onTap=options.onTap||null;this.onCutAction=options.onCutAction||null;this.timingMode=!!this.onTap&&(!step.subActions||(plan.food==='tteok'&&step.action==='CUT'));
    this.canvas=document.createElement('canvas');this.canvas.width=document.body.classList.contains('device-mobile')?960:1280;this.canvas.height=this.canvas.width*720/1280;this.canvas.className='cooking-interaction-canvas';
    if(step.interaction){this.canvas.style.height='auto';this.canvas.style.maxHeight='100%';this.canvas.style.aspectRatio='16 / 9'}
    this.canvas.setAttribute('aria-label',step.interaction?`${step.label}: ${step.inputText||step.instruction}`:this.timingMode?`${step.label}: 게이지의 초록 구간에서 누르세요`:`${step.label}: ${step.instruction}`);
    if(step.subActions&&!step.cutVideoSequence){scene.replaceChildren();this.cutVisual=document.createElement('div');this.cutVisual.className='tteok-cutting-visual';this.cutVisualImages=step.subActions.map((action,index)=>{const image=new Image();image.className='tteok-cut-photo'+(index===0?' is-active':'');image.alt=action.label;image.src=action.image;this.cutVisual.append(image);return image});this.cutImpact=document.createElement('span');this.cutImpact.className='tteok-cut-impact';this.cutImpact.setAttribute('aria-hidden','true');this.cutVisual.append(this.cutImpact);this.cutMarks=document.createElement('span');this.cutMarks.className='tteok-cut-marks';this.cutMarks.setAttribute('aria-hidden','true');for(let i=0;i<5;i++)this.cutMarks.append(document.createElement('i'));this.cutVisual.append(this.cutMarks);this.canvas.style.cssText+=';position:absolute;inset:0;z-index:3;width:100%;height:100%;max-width:none;max-height:none;opacity:0';scene.append(this.cutVisual,this.canvas)}else scene.replaceChildren(this.canvas);
    this.ctx=this.canvas.getContext('2d',{alpha:false});this.ctx.setTransform(this.canvas.width/1280,0,0,this.canvas.height/720,0,0);this.food=plan.food;this.colors=COOKING_PALETTES[this.food];this.stageIndex=plan.steps.indexOf(step);
    this.cuttingScene=step.action==='CUT'&&!step.subActions?new window.CuttingScene(this.ctx,this.food,step.ingredient):null;
    this.riceScene=this.food==='rice'&&step.action!=='CUT'?new window.FriedRicePanScene(this.canvas,step,options.cookingState):null;
    if(this.riceScene&&step.action==='TOSS')this.riceScene.onFlipComplete=()=>{if(!this.finished)this.advanceProgress({x:640,y:418})};
    this.potScene=this.food==='curry'&&(['FRY','POUR'].includes(step.action)||step.video)?new window.PotScene(window.POT_SCENE_PRESETS.curry):null;
    this.progress=0;this.time=0;this.active=false;this.activePointerId=null;this.keyActive=false;this.last=null;this.path=0;this.angle=0;this.pan={x:0,y:0,vx:0,vy:0};
    this.flip={z:0,vz:0,rotation:0,spin:0,air:false};this.liquid=0;this.heat=0;this.browned=0;this.stir=0;this.pour=0;this.tossPull=false;
    const pieceCount=this.cuttingScene||this.riceScene||this.potScene?0:COOKING_PARTICLE_COUNT[this.food];
    this.pieces=Array.from({length:pieceCount},(_,i)=>{const a=i*2.39996,r=Math.sqrt((i+.5)/pieceCount);return{x:Math.cos(a)*r*165,y:Math.sin(a)*r*67,z:0,vx:0,vy:0,vz:0,rotation:a%6.28,airRotation:0,spin:0,bounced:false,size:7+(i%5)*2,kind:i%4}});
    const paths=this.cuttingScene||this.riceScene?{}:{background:'assets/frying-prototype/kitchen-background.png',pan:'assets/frying-prototype/empty-red-pan.png',rightHand:'assets/frying-prototype/right-hand.png',leftHand:'assets/frying-prototype/left-hand.png',rice:'assets/frying-prototype/food/fried-rice-mound.png'};
    if(!this.cuttingScene&&!this.riceScene&&!this.potScene&&this.food!=='rice')paths.core=`assets/frying-prototype/food/${this.food}-core.png`;
    this.assets={};Object.entries(paths).forEach(([key,path])=>{const image=new Image();image.onload=()=>{if(!this.disposed)this.render()};image.src=path;this.assets[key]=image});
    if(this.food==='rice'&&step.action==='TOSS'&&!this.riceScene)this.initRiceEngine();
    this.sharedInteraction=step.interaction?new window.CookingInteractionSystem(this.canvas,step,options.sharedState,{onTap:this.onTap,onRamenInput:(type,event)=>this.videoScene?.ramenInput?.(type,event),onVideoTap:()=>{if(step.interaction==='VIDEO_RHYTHM')this.videoScene?.tryStirRhythm?.();else if(step.pastaMode)this.videoScene?.tryPastaAction?.();else this.videoScene?.advanceTapChunk?.()},onSeasoningHit:()=>this.videoScene?.trySeasoningHit?.(),onCutActionComplete:(count,total)=>{if(!this.finished){this.onCutAction?.(count,total);this.advanceProgress({x:640,y:418})}},onStirLap:(count,total,direction)=>{this.videoScene?.playStirAction?.(direction);options.onStirLap?.(count,total,direction)},onStirRhythm:(verdict,count,total,combo,beat,setIndex)=>options.onStirRhythm?.(verdict,count,total,combo,beat,setIndex),onStirPlaybackComplete:()=>this.videoScene?.completeStirAfterAction?.(),onComplete:value=>this.advanceProgress({x:640,y:418},value),onFeedback:options.onFeedback,onHoldChange:held=>{options.onHoldChange?.(held);if(this.videoScene?.holdToPlay){if(held)this.videoScene.play();else this.videoScene.pause()}},onHoldEnd:()=>{if(step.interaction==='VIDEO_PASTA_HOLD'){const amount=this.sharedInteraction?.amount||0;this.sharedInteraction.state.pastaSauceAmount=amount;if(!step.amountRange||amount>=step.amountRange.min&&amount<=step.amountRange.max)this.sharedInteraction.complete(true);else{this.sharedInteraction.amount=0;this.sharedInteraction.state.pastaSauceAmount=0;options.onPastaPourResult?.(amount<step.amountRange.min?'too_little':'too_much')}}else if(!step.amountRange||this.finished)return;else{const amount=this.videoScene?.progress||0;if(amount<step.amountRange.min)options.onVideoAmountResult?.('too_little',amount);else if(amount>step.amountRange.max)options.onVideoAmountResult?.('too_much',amount);else this.sharedInteraction.complete(true)}}}):null;
    this.videoScene=step.video||step.videoSequence?new window.VideoCookingScene(scene,step,this.sharedInteraction,options.onVideoDuration,{onSequenceTap:options.onSequenceTap,onSequenceProgress:options.onSequenceProgress,onSeasoningHit:options.onSeasoningHit,onPastaAction:options.onPastaAction,onStirTimingSuccess:(count,total)=>{if(!this.finished)this.advanceProgress({x:640,y:418},true,true)},onStirRhythm:(verdict,count,total,combo,beat,setIndex)=>this.sharedInteraction?.options.onStirRhythm?.(verdict,count,total,combo,beat,setIndex),ramenState:options.cookingState,onRamenAction:detail=>this.sharedInteraction?.options.onRamenAction?.(detail),onRamenSubAction:(action,index,total)=>this.sharedInteraction?.options.onRamenSubAction?.(action,index,total),onRamenProgress:detail=>this.sharedInteraction?.options.onRamenProgress?.(detail)}):null;
    if(this.videoScene){if(step.interaction==='STIR'||step.cutVideoSequence){this.canvas.hidden=false;this.canvas.style.cssText+=';position:absolute;inset:0;z-index:3;width:100%;height:100%;max-width:none;max-height:none;opacity:0;pointer-events:none'}else this.canvas.hidden=true}
    this.onVideoProgress=options.onVideoProgress;this.lastVideoPercent=-1;this.lastVideoHeld=null;
    this.down=e=>this.pointerDown(e);this.move=e=>this.pointerMove(e);this.up=e=>this.pointerUp(e);this.preventTouchScroll=e=>e.preventDefault();
    if(!this.sharedInteraction){this.canvas.addEventListener('pointerdown',this.down);this.canvas.addEventListener('pointermove',this.move);this.canvas.addEventListener('pointerup',this.up);this.canvas.addEventListener('pointercancel',this.up);this.canvas.addEventListener('touchmove',this.preventTouchScroll,{passive:false})}
    this.previous=performance.now();this.frame=requestAnimationFrame(t=>this.tick(t));
  }
  dispose(){this.disposed=true;this.videoScene?.dispose();this.riceScene?.dispose();this.sharedInteraction?.dispose();cancelAnimationFrame(this.frame);this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.up);this.canvas.removeEventListener('touchmove',this.preventTouchScroll)}
  setSubAction(index,count=0){this.cutVisualImages?.forEach((image,i)=>image.classList.toggle('is-active',i===index));if(this.cutVisual)this.cutVisual.dataset.cuts=String(count);this.cutMarks?.querySelectorAll('i').forEach((mark,i)=>mark.classList.toggle('is-cut',i<count))}
  showSubActionCut(){if(!this.cutVisual)return;this.cutVisual.classList.remove('is-cutting');void this.cutVisual.offsetWidth;this.cutVisual.classList.add('is-cutting');setTimeout(()=>this.cutVisual?.classList.remove('is-cutting'),260)}
  setDisplayMode(mode){const width=mode==='mobile'?960:1280;if(this.canvas.width===width)return;this.canvas.width=width;this.canvas.height=width*720/1280;this.ctx.setTransform(width/1280,0,0,width/1280,0,0);this.render()}
  async initRiceEngine(){
    const [{FryingEngine},{FRYING_RECIPES,INGREDIENT_MATERIALS,FOOD_IMAGES}]=await Promise.all([import('./frying-engine.js'),import('./frying-content.js')]);
    const image=path=>new Promise((resolve,reject)=>{const item=new Image();item.onload=()=>resolve(item);item.onerror=reject;item.src=path});
    const food=FOOD_IMAGES.friedRice;
    const [background,pan,rightHand,leftHand,mound,ingredients]=await Promise.all([
      image('assets/frying-prototype/kitchen-background.png'),image('assets/frying-prototype/empty-red-pan.png'),
      image('assets/frying-prototype/right-hand.png'),image('assets/frying-prototype/left-hand.png'),image(food.mound),
      Promise.all(Object.entries(food.ingredients).map(async([key,path])=>[key,await image(path)]))
    ]);
    if(this.disposed)return;
    this.riceEngine=new FryingEngine(this.canvas,{background,pan,rightHand,leftHand,foodImages:{mound,ingredients:Object.fromEntries(ingredients)}},FRYING_RECIPES.friedRice,{materials:INGREDIENT_MATERIALS});
    this.riceEngine.onToss=()=>this.hit({x:640,y:418});
  }
  point(e){const rect=this.canvas.getBoundingClientRect();return{x:(e.clientX-rect.left)*1280/rect.width,y:(e.clientY-rect.top)*720/rect.height}}
  pointerDown(e){if(this.disposed||this.finished||this.active||this.riceScene?.step.action==='TOSS'&&!this.riceScene.canFlip)return;e.preventDefault();this.canvas.setPointerCapture(e.pointerId);this.active=true;this.activePointerId=e.pointerId;this.last=this.point(e);this.path=0;this.angle=0;this.tossPull=false;this.cutGestureUsed=false;if(!this.step.subActions||this.timingMode)this.onTap?.(e);if(this.finished||this.disposed)return;if(this.riceScene){if(this.step.action==='TOSS')this.riceScene.beginDrag(this.last,e.timeStamp);return}if(this.riceEngine){this.riceEngine.beginDrag(this.last.x,this.last.y,e.timeStamp);return}if(['PLACE','TOPPING'].includes(this.step.action))this.hit(this.last);}
  pointerMove(e){if(!this.active||this.finished||e.pointerId!==this.activePointerId)return;const samples=e.getCoalescedEvents?.();for(const sample of samples?.length?samples:[e])this.moveSample(sample)}
  moveSample(e){const p=this.point(e),old=this.last;if(!old)return;if(this.cuttingScene){this.cuttingScene.movePointer(p);this.last=p;return}if(this.riceScene){this.riceScene.movePointer(p);if(this.step.action==='STIR')this.riceScene.stirDrag(p.x-old.x,p.y-old.y);if(this.step.action==='TOSS')this.riceScene.moveDrag(p,e.timeStamp);this.last=p;return}if(this.riceEngine){this.riceEngine.moveDrag(p.x,p.y,e.timeStamp);this.last=p;return}const dx=p.x-old.x,dy=p.y-old.y,distance=Math.hypot(dx,dy);this.path+=distance;
    const action=this.step.action;
    if(action==='CUT'||action==='COAT'){if(this.path>65&&(!this.step.cutVideoSequence||!this.cutGestureUsed)){this.impulse(dx,dy,1);this.hit(p);this.path=0;if(this.step.cutVideoSequence)this.cutGestureUsed=true}}
    if(action==='POUR'){this.pour=Math.min(1,this.pour+Math.max(0,dy)*.004+distance*.0009);if(this.path>75){this.hit(p);this.path=0}}
    if(action==='STIR'){this.potScene?.touch(p,old);const a=Math.atan2(p.y-418,p.x-640),b=Math.atan2(old.y-418,old.x-640);let delta=a-b;if(delta>Math.PI)delta-=Math.PI*2;if(delta< -Math.PI)delta+=Math.PI*2;this.angle+=Math.abs(delta);this.stir+=delta;this.impulse(-dy,dx,.45);if(this.angle>.9){this.hit(p);this.angle=0}}
    if(action==='FRY'||action==='TOSS'||action==='FLIP'){if(action==='FRY')this.potScene?.touch(p,old,.7);this.pan.vx+=dx*.38;this.pan.vy+=dy*.38;this.pan.x=Math.max(-64,Math.min(64,this.pan.x+dx*.34));this.pan.y=Math.max(-45,Math.min(55,this.pan.y+dy*.34));this.impulse(-dx,-dy,.18);if(action==='FRY'&&this.path>95){this.hit(p);this.path=0}if(dy>18)this.tossPull=true;if((action==='TOSS'||action==='FLIP')&&dy< -25&&this.tossPull&&this.path>85){this.launch();this.path=0;this.tossPull=false}}
    if(action==='PLACE'||action==='TOPPING'){if(this.path>42){this.hit(p);this.path=0}}
    this.last=p;
  }
  pointerUp(e){if(!this.active||e.pointerId!==this.activePointerId)return;this.active=false;this.activePointerId=null;this.last=null;this.riceEngine?.endDrag();this.riceScene?.endDrag();try{this.canvas.releasePointerCapture(e.pointerId)}catch{}}
  keyboard(down){if(this.sharedInteraction){this.sharedInteraction.keyboard(down);return}this.keyActive=down;if(!down||this.finished||this.timingMode)return;const action=this.step.action;if(this.riceEngine){this.riceEngine.launch(1.05,0,-1000);return}if(action==='TOSS'||action==='FLIP'){this.launch();return}if(['GRILL','BOIL','BAKE'].includes(action))return;if(action==='STIR')this.stir+=.7;if(action==='POUR')this.pour=Math.min(1,this.pour+.17);this.impulse(80,-35,.2);this.hit({x:640,y:420})}
  hit(p){if(this.finished||this.timingMode||this.step.cutVideoSequence)return;const cutCount=this.progress+1;this.advanceProgress(p);if(this.step.cutVideoSequence)this.onCutAction?.(cutCount,this.step.goal)}
  advanceProgress(p,result,fromVideo=false){if(this.finished)return;this.progress++;this.onProgress(this.progress,this.step.goal,p);if(this.progress>=this.step.goal){this.finished=true;this.active=false;this.activePointerId=null;this.keyActive=false;if(fromVideo&&this.sharedInteraction)this.sharedInteraction.done=true;this.onComplete(result)}}
  applyTimedHit(){if(this.finished)return;if(this.sharedInteraction){this.sharedInteraction.acceptTimedHit();return}const action=this.step.action;
    if(this.riceScene){if(action==='ADD')this.riceScene.addIngredient(this.step.ingredient);else if(action==='STIR')this.riceScene.stir();else if(action==='TOSS'){this.riceScene.toss();return}}
    else if(action==='CUT'&&this.step.cutVideoSequence)this.videoScene?.playCutAction?.();
    else if(action==='CUT'&&this.step.subActions&&this.food==='tteok')this.showSubActionCut();
    else if(action==='TOSS'&&this.riceEngine)this.riceEngine.launch(1.05,0,-1000);
    else if(action==='TOSS'||action==='FLIP')this.launch();
    else if(action==='CUT')this.cuttingScene.strike();
    else if(action==='COAT'){this.impulse(120,-55,.45)}
    else if(action==='STIR'){this.stir+=.7;this.potScene?.pulse();this.impulse(85,-45,.3)}
    else if(action==='POUR'){this.pour=Math.min(1,this.pour+1/this.step.goal);this.liquid=Math.min(1,this.liquid+.16)}
    else if(action==='FRY'){this.pan.vx+=80;this.pan.x=Math.min(60,this.pan.x+20);this.potScene?.pulse();this.impulse(85,-25,.35)}
    else if(['GRILL','BOIL','BAKE'].includes(action)){this.heat=Math.min(1,this.heat+1/this.step.goal);this.browned=Math.min(1,this.browned+1/this.step.goal)}
    else this.impulse(70,-35,.25);
    this.advanceProgress({x:640,y:418});
  }
  applyTimedMiss(){this.cuttingScene?.hesitate();this.riceScene?.hesitate()}
  launch(){if(this.flip.air||this.finished)return;this.flip={z:0,vz:this.step.action==='TOSS'?570:490,rotation:0,spin:this.step.action==='TOSS'?.55:5.3,air:true};this.pan.vy=-50;this.impulse(0,-130,.7);for(const piece of this.pieces){piece.vz=205+(piece.kind*29)+Math.random()*52;piece.spin=(Math.random()-.5)*7;piece.bounced=false}}
  impulse(x,y,scale){for(const piece of this.pieces){piece.vx+=x*scale*(.45+(piece.kind%3)*.2);piece.vy+=y*scale*(.45+(piece.kind%2)*.18)}}
  tick(now){if(this.disposed)return;const dt=Math.min(.04,(now-this.previous)/1000||0);this.previous=now;this.time+=dt;if(this.sharedInteraction){this.videoScene?.sync();this.sharedInteraction.update(dt);this.videoScene?.update();if(this.step.interaction==='VIDEO_PASTA_HOLD')this.videoScene?.setPastaPour(this.sharedInteraction.amount,this.sharedInteraction.heldSources.size>0);const steakTiming=this.food==='steak'&&this.step.interaction==='COOK_TIMING'&&this.videoScene&&!this.videoScene.manualTrigger,stirVideo=this.step.interaction==='STIR'&&this.videoScene&&!this.step.stirPlayback,pastaPour=this.step.interaction==='VIDEO_PASTA_HOLD',pastaAmount=pastaPour?Math.floor(Math.min(1,this.sharedInteraction.amount)*100):0,pastaHeld=pastaPour&&this.sharedInteraction.heldSources.size>0;if(pastaPour&&(pastaAmount!==this.lastVideoPercent||pastaHeld!==this.lastVideoHeld)){this.lastVideoPercent=pastaAmount;this.lastVideoHeld=pastaHeld;this.onVideoProgress?.(pastaAmount,pastaHeld)}if(this.videoScene?.holdToPlay||this.videoScene?.manualTrigger||steakTiming||stirVideo){const percent=stirVideo?Math.floor(Math.min(1,this.sharedInteraction.turn/(this.step.targetTurns*Math.PI*2))*100):this.videoScene.manualTrigger?Math.floor(Math.min(1,this.sharedInteraction.cookElapsed/(this.step.burnStart||1))*100):Math.floor(this.videoScene.progress*100),held=this.videoScene.isHeld;if(percent!==this.lastVideoPercent||held!==this.lastVideoHeld){this.lastVideoPercent=percent;this.lastVideoHeld=held;this.onVideoProgress?.(percent,held)}}if(!this.videoScene){this.sharedInteraction.render();this.frame=requestAnimationFrame(t=>this.tick(t));return}}if(this.cuttingScene){this.cuttingScene.update(dt);this.render();this.frame=requestAnimationFrame(t=>this.tick(t));return}if(this.riceScene){this.riceScene.update(dt);this.riceScene.render();this.frame=requestAnimationFrame(t=>this.tick(t));return}if(this.riceEngine){this.riceEngine.update(dt);this.riceEngine.render();this.frame=requestAnimationFrame(t=>this.tick(t));return}this.potScene?.update(dt);this.pan.x+=(0-this.pan.x)*Math.min(1,dt*4);this.pan.y+=(0-this.pan.y)*Math.min(1,dt*4);this.pan.vx*=Math.exp(-5*dt);this.pan.vy*=Math.exp(-5*dt);
    if(this.active||this.keyActive){if(['GRILL','BOIL','BAKE'].includes(this.step.action)){this.heat=Math.min(1,this.heat+dt*.22);if(!this.timingMode&&this.heat>this.progress/this.step.goal*.9+.08)this.hit({x:640,y:420})}}
    if(this.flip.air){this.flip.vz-=980*dt;this.flip.z+=this.flip.vz*dt;this.flip.rotation+=this.flip.spin*dt;if(this.flip.z<=0){this.flip.z=0;this.flip.air=false;this.flip.rotation=0;this.impulse(0,65,.18);this.hit({x:640,y:420})}}
    for(const piece of this.pieces){piece.x+=piece.vx*dt;piece.y+=piece.vy*dt;piece.vx*=Math.exp(-6*dt);piece.vy*=Math.exp(-6*dt);if(piece.z>0||piece.vz>0){piece.vz-=780*dt;piece.z+=piece.vz*dt;piece.airRotation+=piece.spin*dt;if(piece.z<=0){piece.z=0;if(!piece.bounced&&-piece.vz>145){piece.vz=-piece.vz*.19;piece.spin*=.35;piece.bounced=true}else{piece.vz=0;piece.spin=0}}}const r=Math.hypot(piece.x/175,piece.y/75);if(r>1){piece.x/=r;piece.y/=r;piece.vx*=-.25;piece.vy*=-.25}}
    this.render();this.frame=requestAnimationFrame(t=>this.tick(t))}
  ellipse(x,y,rx,ry,color){const c=this.ctx;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=color;c.fill()}
  render(){if(this.sharedInteraction&&!this.videoScene){this.sharedInteraction.render();return}if(this.cuttingScene){this.cuttingScene.render(this.progress/this.step.goal);return}if(this.riceScene){this.riceScene.render();return}const c=this.ctx;c.clearRect(0,0,1280,720);const a=this.assets;if(a.background?.complete&&a.background.naturalWidth)c.drawImage(a.background,0,0,1280,720);else{c.fillStyle='#e6c49b';c.fillRect(0,0,1280,720)}
    c.save();c.translate(this.pan.x,this.pan.y);this.ellipse(640,537,275,83,'#382f3270');
    if(this.plan.vessel==='pan'&&a.pan?.naturalWidth)c.drawImage(a.pan,175,160,970,546);
    else this.drawVessel();
    c.save();c.beginPath();if(this.potScene)c.ellipse(640,395,210,105,0,0,Math.PI*2);else c.ellipse(640,418,181,82,0,0,Math.PI*2);c.clip();if(!this.flip.air)this.drawFood();c.restore();c.restore();
    if(this.flip.air){c.save();c.translate(this.pan.x,this.pan.y);this.drawFood();c.restore()}
    this.drawEffects();
    if(this.potScene){this.potScene.drawSteam(c);this.potScene.drawSpoon(c)}
    if(a.rightHand?.naturalWidth)c.drawImage(a.rightHand,650+this.pan.x*.6,478+this.pan.y*.6,635,357);
    if(a.leftHand?.naturalWidth)c.drawImage(a.leftHand,385+this.pan.x*.12,590+this.pan.y*.1,382,215);
  }
  drawVessel(){const c=this.ctx;
    if(this.plan.vessel==='oven'){
      c.save();c.shadowColor='#31242199';c.shadowBlur=20;c.shadowOffsetY=15;c.fillStyle='#594b49';c.beginPath();c.roundRect(362,276,558,281,25);c.fill();c.restore();
      const glow=c.createRadialGradient(640,405,50,640,410,300);glow.addColorStop(0,'#c96635');glow.addColorStop(.65,'#7b3d2c');glow.addColorStop(1,'#2c292f');c.fillStyle=glow;c.beginPath();c.roundRect(381,290,518,240,16);c.fill();
      c.fillStyle='#35363c';c.beginPath();c.roundRect(425,330,430,165,15);c.fill();c.strokeStyle='#a6a1a0';c.lineWidth=10;c.stroke();return;
    }
    if(this.plan.vessel==='iron'){
      c.save();c.shadowColor='#302a2a99';c.shadowBlur=20;c.shadowOffsetY=13;c.fillStyle='#3e4147';c.beginPath();c.roundRect(386,272,508,300,50);c.fill();c.restore();
      const metal=c.createLinearGradient(0,300,0,550);metal.addColorStop(0,'#8b8784');metal.addColorStop(.35,'#515258');metal.addColorStop(1,'#292c33');c.fillStyle=metal;c.beginPath();c.roundRect(402,286,476,256,38);c.fill();c.strokeStyle='#b8ada1';c.lineWidth=10;c.stroke();
      this.ellipse(640,416,207,92,'#6c5140');c.strokeStyle='#a7754b';c.lineWidth=7;for(let i=-3;i<=3;i++){c.beginPath();c.moveTo(640+i*45,342);c.lineTo(640+i*45,493);c.stroke()}return;
    }
    const outer=c.createLinearGradient(0,265,0,550);outer.addColorStop(0,'#a4402e');outer.addColorStop(.5,'#d75036');outer.addColorStop(1,'#8f2e2b');this.ellipse(640,410,250,180,outer);this.ellipse(640,373,230,118,'#36353b');this.ellipse(640,412,190,86,'#a77545');c.strokeStyle='#f3c7a9';c.lineWidth=12;c.beginPath();c.ellipse(640,373,230,118,0,0,Math.PI*2);c.stroke();
  }
  drawFood(){const c=this.ctx,food=this.food,p=this.progress/this.step.goal,heat=this.heat,flip=this.flip;
    if(this.potScene){this.potScene.setPhase(this.step.action,p);this.potScene.draw(c);return}
    c.save();c.translate(640,418-flip.z);c.rotate(flip.rotation);c.translate(-640,-418);
    if(food==='rice'&&this.assets.rice?.naturalWidth){if(this.step.action!=='CUT'){c.globalAlpha=this.step.action==='PLACE'?.45+p*.55:1;c.drawImage(this.assets.rice,462,337,356,158);c.globalAlpha=1}}
    else if(this.step.action==='CUT'||(this.stageIndex===0&&this.stageIndex===COOKING_CORE_STAGE[food]&&p===0)){}
    else if(this.stageIndex>=COOKING_CORE_STAGE[food]&&this.assets.core?.naturalWidth){
      if(this.stageIndex===COOKING_CORE_STAGE[food]&&this.stageIndex>0&&p<1){
        if(['steak','tonkatsu','pancake'].includes(food))this.drawSolid(food,p,heat);
        else this.drawLiquid(food,p,heat);
      }
      c.globalAlpha=this.stageIndex===COOKING_CORE_STAGE[food]?Math.max(.08,p):1;
      if(['GRILL','FRY','BAKE'].includes(this.step.action))c.filter=`saturate(${.78+heat*.32}) brightness(${.87+heat*.18})`;
      c.drawImage(this.assets.core,450,334,380,168);c.filter='none';c.globalAlpha=1;
    }else if(['steak','tonkatsu','pancake'].includes(food)){
      if(this.step.action!=='PLACE'||p>0){c.globalAlpha=['PLACE','POUR'].includes(this.step.action)?Math.max(.12,p):1;this.drawSolid(food,p,heat);c.globalAlpha=1}
    }else this.drawLiquid(food,p,heat);
    const visible=this.step.action==='PLACE'?Math.max(10,Math.floor(this.pieces.length*p)):this.step.action==='CUT'?Math.max(8,Math.floor(this.pieces.length*(.25+p*.7))):this.pieces.length;
    for(let i=0;i<visible;i++)this.drawPiece(this.pieces[i]);
    c.restore()}
  drawSolid(food,p,heat){const c=this.ctx;let base={steak:'#8c4736',tonkatsu:'#bc813c',pancake:'#e6b76d'}[food];if(food==='steak'&&heat>.25)base='#93482e';if(food==='tonkatsu'&&heat>.3)base='#c88932';
    c.save();c.shadowColor='#30231c88';c.shadowBlur=15;c.shadowOffsetY=9;const g=c.createRadialGradient(614,380,22,640,420,171);g.addColorStop(0,heat>.5?'#f2c77b':'#f8d596');g.addColorStop(.35,base);g.addColorStop(1,'#7d432b');this.ellipse(640,418,food==='steak'?142:food==='tonkatsu'?145:158,food==='steak'?67:71,g);c.restore();
    if(food==='pancake'){this.ellipse(640,410,149,63,heat>.45?'#db9343':'#f2d69c');this.ellipse(640,404,131,53,'#f0c982')}
    if(food==='steak'){c.strokeStyle='#d59665';c.lineWidth=8;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(550+i*20,383);c.lineTo(565+i*20,444);c.stroke()}}
    if(food==='tonkatsu'){c.fillStyle='#f4cc74';for(let i=0;i<100;i++){const a=i*2.399,r=Math.sqrt((i+.5)/100);c.fillRect(640+Math.cos(a)*r*137,418+Math.sin(a)*r*62,3,3)}}}
  drawLiquid(food,p,heat){const early=this.stageIndex<COOKING_CORE_STAGE[food]||(this.stageIndex===COOKING_CORE_STAGE[food]&&p<1);const base=early?{tteok:'#9b7962',pasta:'#aa8d62',curry:'#634f3e',ramen:'#b8894e',udon:'#a88a61'}[food]:{tteok:'#d65331',pasta:'#ad4d35',curry:'#ae722b',ramen:'#b8894e',udon:'#a88a61'}[food];this.ellipse(640,418,175,72,base);this.ellipse(630,400,132,46,early?'#d8bb88':{tteok:'#e46b39',pasta:'#cf6842',curry:'#d49941',ramen:'#d6ab68',udon:'#ddc99b'}[food]);const c=this.ctx;if(food==='pasta'||(food==='ramen'&&this.stageIndex>=2)||(food==='udon'&&this.stageIndex>=2)){c.strokeStyle=food==='udon'?'#f8ebc7':'#f1d37d';c.lineWidth=food==='udon'?9:5;c.lineCap='round';for(let i=0;i<16;i++){const x=555+i*11,y=390+(i%4)*13;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+32,y-28,x-20,y+39,x+40,y+14);c.stroke()}}if(food==='curry')for(let i=0;i<11;i++)this.ellipse(548+i*17,405+(i%3)*19,11,8,i%3?'#e0ae5b':'#e78b48');if(food==='tteok')for(let i=0;i<17;i++){c.save();c.translate(535+i*12,390+(i%4)*14);c.rotate((i%5-2)*.3);c.fillStyle=early?'#f5d6a8':i%4?'#f39a62':'#f8bd7a';c.roundRect(-13,-5,26,10,5);c.fill();c.restore()}}
  drawPiece(piece){const c=this.ctx,food=this.food,x=640+piece.x,y=418+piece.y-piece.z,col=this.colors[piece.kind];c.save();c.translate(x,y);c.rotate(piece.rotation+piece.airRotation+this.stir*.015);c.shadowColor='#4a2c2466';c.shadowBlur=3;c.shadowOffsetY=2;c.fillStyle=col;if(['pasta','ramen','udon'].includes(food)){c.beginPath();c.ellipse(0,0,piece.size*1.5,3,0,0,Math.PI*2);c.fill()}else if(food==='rice'){c.beginPath();c.ellipse(0,0,piece.size*.8,3.2,0,0,Math.PI*2);c.fill()}else{c.beginPath();c.roundRect(-piece.size/2,-piece.size/3,piece.size,piece.size*.67,3);c.fill()}c.restore()}
  drawEffects(){const c=this.ctx,action=this.step.action,t=this.time;if(!this.potScene&&['BOIL','FRY','GRILL','BAKE'].includes(action)){const amount=action==='BOIL'?16:9;for(let i=0;i<amount;i++){const a=i*2.399,r=Math.sqrt((i+.3)/amount),x=640+this.pan.x+Math.cos(a)*r*160,y=418+this.pan.y+Math.sin(a)*r*61;const rise=(t*35+i*23)%42;c.globalAlpha=.12+this.heat*.35;c.strokeStyle='#fff5d6';c.lineWidth=2;c.beginPath();c.arc(x,y-rise,3+(i%3)*2,0,Math.PI*2);c.stroke()}c.globalAlpha=1}
    if(action==='POUR'&&(this.active||this.keyActive)){const x=this.last?.x||650,y=this.last?.y||270;c.strokeStyle=this.food==='tteok'||this.food==='pasta'?'#d95535':'#ead69c';c.lineWidth=12;c.lineCap='round';c.beginPath();c.moveTo(x,Math.max(150,y-120));c.quadraticCurveTo(x+22,y-5,650,394);c.stroke()}
    if(action==='CUT'||action==='COAT'){c.save();c.translate(this.last?.x||540,this.last?.y||325);c.rotate(-.35);c.fillStyle='#d8dce0';c.beginPath();c.moveTo(-11,-80);c.lineTo(7,-80);c.lineTo(17,37);c.lineTo(0,57);c.closePath();c.fill();c.fillStyle='#805b40';c.fillRect(-8,-112,15,38);c.restore()}
  }
}
window.CookingPlans=COOKING_PLANS;
window.CookingInteraction=CookingInteraction;
