/* A recipe can opt into native video while the shared interaction owns timing and input. */
class VideoCookingScene{
  constructor(scene,step,interaction,onDuration,options={}){
    this.scene=scene;this.step=step;this.interaction=interaction;this.onDuration=onDuration;
    this.options=options;this.ramenMode=!!step.ramenMode;this.ramenSequence=step.ramenSequence||null;this.ramenCurrentAction=this.ramenSequence?.[0]?.action||step.ramenAction||null;this.ramenSequenceIndex=0;this.ramenAmount=0;this.ramenCount=0;this.ramenCombo=0;this.ramenLocked=false;this.ramenPhaseOrigin=performance.now();this.ramenActionTimer=null;this.ramenPressTime=0;this.ramenHeld=false;this.ramenActionActive=false;this.pastaMode=!!step.pastaMode;this.pastaTiming=step.interaction==='VIDEO_PASTA_TIMING';this.pastaActionCount=0;this.pastaPerfectCombo=0;this.pastaActionLocked=false;this.pastaResponseTimer=null;this.holdToPlay=step.interaction==='VIDEO_HOLD';this.stirActionPlayback=step.interaction==='STIR'&&step.stirPlayback==='on-lap'||step.interaction==='VIDEO_RHYTHM';this.rhythmMode=step.interaction==='VIDEO_RHYTHM';this.cutActionSequence=!!step.cutVideoSequence;this.stirToPlay=step.interaction==='STIR'&&!this.stirActionPlayback;this.stirCueEpoch=performance.now();this.stirPerfectCombo=0;this.stirSuccessCount=0;this.stirSetIndex=0;this.stirBeat=0;this.stirTargetAt=0;this.stirLastInputAt=0;this.stirActionIndex=0;this.pendingStirDirection=null;this.stirActionQueue=[];this.stirActionActive=false;this.stirCompleteRequested=false;this.stirCueReady=false;this.stirCueTimer=null;this.stirPromptShown=false;this.stirTiming=step.interaction==='VIDEO_STIR_TIMING';this.stirTimingCount=0;this.stirResponseTimer=null;this.cutActionActive=false;this.cutActionQueued=false;this.manualTrigger=!!step.manualTrigger;this.timingSeasoning=step.interaction==='VIDEO_SEASONING';this.isTimingGame=this.timingSeasoning||this.stirTiming||this.pastaTiming;this.isHeld=false;
    this.ramenGameAnimation=!!step.ramenGameAnimation;this.sequence=step.videoSequence||null;this.sequenceVisualOnly=!!step.cutVideoSequence;this.playerActionSequence=!!step.playerActionSequence;this.pendingActionVerdict=null;this.sequenceIndex=0;this.sequenceCounts=(this.sequence||[]).map(()=>0);this.segmentEnd=0;this.segmentActive=false;this.sequenceReady=false;this.sequenceTapQueued=false;this.sequenceTransitioning=false;this.transitionTimer=null;this.sequencePreloaders=[];
    this.sequenceAmounts=(this.sequence||[]).map(()=>0);this.perfectCombo=0;this.seasoningCycleOrigin=0;this.seasoningLastAttemptCycle=-1;this.finishSeasoningTimer=null;
    this.previousPosition=scene.style.position;scene.style.position='relative';this.ramenVisualHideTimer=null;this.ramenPreloaders=[];
    // Every stage owns its video element. Reusing a globally retained element allowed
    // the previous broth clip to survive transitions and surface in later stages.
    const reusableRamenVideo=null;const video=document.createElement('video');this.video=video;this.keepRamenVideo=false;
    video.className='video-cooking-scene';video.setAttribute('aria-label',`${step.label} 조리 장면`);
    video.muted=true;video.defaultMuted=true;video.autoplay=this.ramenMode||this.isTimingGame&&!this.playerActionSequence||(!this.sequence&&!this.holdToPlay&&!this.stirToPlay&&!this.stirActionPlayback&&!this.manualTrigger);video.playsInline=true;video.setAttribute('playsinline','');
    video.preload='auto';video.loop=this.ramenMode||this.isTimingGame&&!this.playerActionSequence||this.stirToPlay||(!this.stirActionPlayback&&!!step.loop);video.controls=false;if(this.ramenMode){video.poster=step.ramenSequence?'assets/ramen/돼지뼈.png':'assets/ramen/육수끓이기.png';video.autoplay=true;video.muted=true;}
    Object.assign(video.style,{position:'absolute',inset:'0',zIndex:'1',width:'100%',height:'100%',objectFit:'contain',opacity:'0',pointerEvents:'none'});
    this.metadata=()=>{
      const duration=video.duration;if(!Number.isFinite(duration)||duration<=0)return;
      if(step.perfectStartFraction!==undefined)step.perfectStart=duration*step.perfectStartFraction;
      if(step.burnStartFraction!==undefined)step.burnStart=duration*step.burnStartFraction;
      if(step.perfectStart!==undefined&&step.burnStart!==undefined)this.onDuration?.(duration,step);
    };
    this.ready=()=>{video.style.opacity='1';if(this.ramenMode){if(this.ramenIsAmbient())video.play().catch(()=>{});else{video.pause();try{video.currentTime=0}catch{}}return}if(this.sequence){if(!this.sequenceReady){this.sequenceReady=true;if(this.timingSeasoning){this.seasoningCycleOrigin=performance.now();if(this.playerActionSequence){video.pause();try{video.currentTime=0}catch{};if(this.seasoningIndicator)this.seasoningIndicator.style.opacity='1'}else this.play()}else{video.pause();video.currentTime=0;if(this.sequenceTapQueued){this.sequenceTapQueued=false;this.advanceTapChunk(true)}if(this.cutActionQueued){this.cutActionQueued--;this.playCutAction()}}}return}if(this.stirTiming||this.pastaTiming)this.seasoningCycleOrigin=performance.now();if(this.holdToPlay||this.stirToPlay||this.stirActionPlayback||this.manualTrigger){video.pause();video.currentTime=0;if(this.rhythmMode){this.stirCueEpoch=performance.now();this.scheduleStirCue(500)}if(this.stirActionPlayback)this.startNextStirAction()}else this.play()};
    this.syncTime=()=>this.sync();
    this.ramenActionProgress=()=>this.trackRamenAction();
    this.sequenceTime=()=>{if(!this.sequence||this.timingSeasoning&&!this.playerActionSequence||!this.segmentActive||video.seeking)return;if(video.currentTime>=this.segmentEnd-.035||video.ended){if(this.playerActionSequence)this.finishPlayerActionSequence();else if(this.cutActionSequence)this.finishCutAction();else this.finishTapChunk()}};
    this.finish=()=>{if(this.ramenMode){this.finishRamenAction();return}if(this.playerActionSequence){this.finishPlayerActionSequence();return}if(this.timingSeasoning)return;if(this.sequence){if(this.cutActionSequence)this.finishCutAction();else this.sequenceTime();return}this.sync();if(this.stirActionPlayback){this.stirActionActive=false;this.scene.classList.remove('tteok-stir-active');if(this.stirActionQueue.length){this.startNextStirAction();return}if(this.stirCompleteRequested){this.interaction.complete(true);return}if(this.rhythmMode)this.scheduleStirCue(this.step.stirNextCueDelay||400);return}if(this.holdToPlay&&!step.amountRange||step.completeOnEnded)this.interaction.complete(true)};
    video.addEventListener('loadedmetadata',this.metadata);
    video.addEventListener('loadeddata',this.ready);
    video.addEventListener('timeupdate',this.syncTime);
    video.addEventListener('timeupdate',this.sequenceTime);
    video.addEventListener('timeupdate',this.ramenActionProgress);
    video.addEventListener('ended',this.finish);
    if(this.ramenMode){const activeSrc=this.ramenEntry()?.referenceVideo||step.video||step.referenceVideo;if(this.ramenGameAnimation){video.removeAttribute('src');video.dataset.motionReference=step.referenceVideo;video.autoplay=false;video.loop=false;video.style.opacity='0';scene.classList.add('ramen-noodle-stir-game-scene')}else{video.poster=this.ramenPosterForAsset(activeSrc);video.src=activeSrc;video.dataset.ramenRole=this.ramenSequence?'sub-action':'cooking';this.watchRamenSource(activeSrc);video.autoplay=false;video.loop=this.ramenIsAmbient()}scene.append(video);this.preloadRamenAssets()}else{video.src=this.sequence?this.sequence[0].video:step.video;scene.append(video);}if(this.sequenceVisualOnly){for(const entry of this.sequence.slice(1)){const preload=document.createElement('video');preload.muted=true;preload.preload='auto';preload.setAttribute('aria-hidden','true');preload.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none';preload.src=entry.video;scene.append(preload);preload.load();this.sequencePreloaders.push(preload)}}
    if(this.isTimingGame){const indicator=document.createElement('div');indicator.className=`seasoning-indicator${this.pastaMode?' pasta-timing-indicator':''}`;indicator.setAttribute('aria-hidden','true');indicator.innerHTML='<span class="seasoning-grains"><i></i><i></i><i></i><i></i><i></i></span><span class="seasoning-ring seasoning-ring-pulse"></span><span class="seasoning-ring seasoning-ring-target"></span><b class="seasoning-verdict"></b><small class="seasoning-score"></small>';scene.append(indicator);this.seasoningIndicator=indicator;this.seasoningPulse=indicator.querySelector('.seasoning-ring-pulse');this.seasoningVerdict=indicator.querySelector('.seasoning-verdict');this.seasoningScore=indicator.querySelector('.seasoning-score');this.seasoningGrains=[...indicator.querySelectorAll('.seasoning-grains i')]}
    if(this.ramenMode){const poster=document.createElement('img');poster.className='ramen-idle-poster';poster.alt='';poster.setAttribute('aria-hidden','true');poster.src=this.ramenGameAnimation?step.ramenBackground:this.ramenPosterForAsset(this.ramenEntry()?.referenceVideo||step.video||step.referenceVideo);poster.style.opacity=this.ramenGameAnimation||this.ramenCurrentMode()==='hold'?'1':'0';scene.append(poster);this.ramenIdlePoster=poster;const world=document.createElement('div');world.className='ramen-world';world.setAttribute('aria-hidden','true');world.innerHTML=this.ramenGameAnimation?'<div class="ramen-stir-ambient"><i></i><i></i><i></i><i></i><span></span></div><img class="ramen-stir-noodles" src="'+step.ramenNoodleSprite+'" alt=""><img class="ramen-stir-hand" src="'+step.ramenHandSprite+'" alt=""><div class="ramen-pot-reaction"><i class="ramen-broth-ripple"></i></div>':'<div class="ramen-pot-reaction"><i class="ramen-broth-ripple"></i></div>';scene.append(world);this.ramenWorld=world;this.ramenPot=world.querySelector('.ramen-pot-reaction');this.ramenStirHand=world.querySelector('.ramen-stir-hand');this.ramenStirNoodles=world.querySelector('.ramen-stir-noodles');this.ramenCurrentAction=this.ramenSequence?this.ramenSequence[0].action:step.ramenAction;this.ramenAmount=options.ramenState?.brothPourAmount||0;this.ramenTarget=this.ramenGameAnimation?3:(step.ramenTarget||this.ramenSequence?.[0]?.target||1);this.ramenSequenceAmounts=this.ramenSequence?.map(()=>0)||[];this.ramenState=options.ramenState||{};this.ramenState.boneCount=this.ramenState.boneCount||0;this.ramenCount=this.ramenGameAnimation?(this.ramenState.noodleStirCount||0):this.ramenCount;this.ramenState.noodleStirCount=this.ramenCount;this.ramenState.noodleStirProgress=this.ramenCount/this.ramenTarget;this.ramenStirQueue=0;this.ramenStirFrame=0;this.ramenPhase='WAITING';this.ramenActionPlaying=false;this.ramenInputSuccess=false;this.ramenVisualActionComplete=false;this.ramenWorld.classList.toggle('ramen-bone-added',!!this.ramenState.bonesAdded);this.ramenWorld.classList.toggle('ramen-soy-added',!!this.ramenState.soySauceAmount);this.ramenWorld.classList.toggle('ramen-pepper-added',!!this.ramenState.pepperCount);this.ramenWorld.classList.toggle('ramen-noodles-added',!!this.ramenState.noodlesAdded);if(this.ramenSequence)this.updateRamenSubAction();else this.updateRamenCue(true);if(this.ramenGameAnimation)this.options.onRamenProgress?.({action:'noodleStir',count:this.ramenCount,total:this.ramenTarget,phase:this.ramenPhase});}
    if(this.pastaMode){const fx=document.createElement('div');fx.className='pasta-action-fx';fx.setAttribute('aria-hidden','true');fx.innerHTML='<i></i><i></i><i></i><i></i><i></i><i></i><b></b><small></small>';scene.append(fx);this.pastaFx=fx;this.pastaFxVerdict=fx.querySelector('b');this.pastaFxScore=fx.querySelector('small');const stream=document.createElement('div');stream.className='pasta-sauce-stream';stream.setAttribute('aria-hidden','true');stream.innerHTML='<i></i><i></i><i></i>';scene.append(stream);this.pastaPourStream=stream}
    if(this.stirActionPlayback||this.stirTiming){this.stirAmbient=document.createElement('div');this.stirAmbient.className='tteok-stir-ambient';this.stirAmbient.setAttribute('aria-hidden','true');for(let i=0;i<7;i++)this.stirAmbient.append(document.createElement('i'));scene.append(this.stirAmbient);if(this.stirActionPlayback){this.stirCue=document.createElement('div');this.stirCue.className='tteok-stir-cue';this.stirCue.setAttribute('aria-hidden','true');this.stirCue.innerHTML='<small class="tteok-cue-caption"></small><b class="tteok-space-prompt">SPACE!</b>';this.stirCaption=this.stirCue.querySelector('.tteok-cue-caption');this.stirSpacePrompt=this.stirCue.querySelector('.tteok-space-prompt');this.stirFeedback=document.createElement('div');this.stirFeedback.className='tteok-stir-feedback';this.stirFeedback.setAttribute('aria-hidden','true');scene.append(this.stirCue,this.stirFeedback)}if(this.stirTiming){this.stirSplash=document.createElement('div');this.stirSplash.className='tteok-stir-splash';this.stirSplash.setAttribute('aria-hidden','true');this.stirSplash.innerHTML='<i></i><i></i><i></i><i></i>';scene.append(this.stirSplash)}}
    if(video.getAttribute('src'))video.load();
    if(this.playerActionSequence){for(const entry of this.sequence.slice(1)){const preload=document.createElement('video');preload.muted=true;preload.preload='auto';preload.setAttribute('aria-hidden','true');preload.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none';preload.src=entry.video;scene.append(preload);preload.load();this.sequencePreloaders.push(preload)}}
  }
  trySeasoningHit(){
    if(this.pastaTiming)return this.tryPastaTimingHit();
    if(this.stirTiming)return this.tryStirTimingHit();
    if(this.playerActionSequence)return this.tryPlayerActionSequenceHit();
    if(this.disposed||!this.timingSeasoning||!this.sequence||!this.sequenceReady||this.video.readyState<2||this.interaction.done||this.sequenceTransitioning)return false;
    const entry=this.sequence[this.sequenceIndex],period=(entry?.periodMs||1800),elapsed=(performance.now()-this.seasoningCycleOrigin)/1000,cycle=Math.floor(elapsed/(period/1000));
    if(cycle===this.seasoningLastAttemptCycle)return false;this.seasoningLastAttemptCycle=cycle;
    const phase=(elapsed%(period/1000))/(period/1000),distance=Math.abs(phase-.78),verdict=distance<=.075?'perfect':distance<=.205?'good':'miss';
    if(verdict==='perfect')this.perfectCombo++;else if(verdict==='miss')this.perfectCombo=0;
    const index=this.sequenceIndex,total=entry.hits||3;if(verdict!=='miss')this.sequenceCounts[index]++;
    this.sequenceAmounts[index]=Math.min(1,this.sequenceAmounts[index]+(verdict==='perfect' ? .36 : verdict==='good' ? .32 : .02));
    this.interaction.state.steakSeasoningAmounts=[...this.sequenceAmounts];this.interaction.state.steakPerfectCombo=this.perfectCombo;
    const detail={count:this.sequenceCounts[index],total,amount:this.sequenceAmounts[index],combo:this.perfectCombo,cycle,phase};
    const points=this.options.onSeasoningHit?.(verdict,index,detail)??0;this.options.onSequenceProgress?.(index,detail.count,total,this.sequence,this.sequenceAmounts[index],verdict,this.perfectCombo);
    this.showTimingHitFeedback(verdict,points,index===1?'salt':'pepper');
    if(detail.count>=total){
      if(index+1<this.sequence.length){this.sequenceTransitioning=true;this.transitionTimer=setTimeout(()=>{if(this.disposed)return;this.sequenceIndex=index+1;this.sequenceReady=false;this.sequenceTransitioning=false;this.seasoningLastAttemptCycle=-1;this.perfectCombo=0;this.interaction.state.steakPerfectCombo=0;this.seasoningCycleOrigin=performance.now();this.video.style.opacity='0';this.video.src=this.sequence[this.sequenceIndex].video;this.video.load();this.options.onSequenceProgress?.(this.sequenceIndex,0,this.sequence[this.sequenceIndex].hits||3,this.sequence,this.sequenceAmounts[this.sequenceIndex],null,this.perfectCombo)},560)}
      else{this.sequenceTransitioning=true;this.finishSeasoningTimer=setTimeout(()=>{if(!this.disposed)this.interaction.complete({amounts:[...this.sequenceAmounts],perfectCombo:this.perfectCombo})},480)}
    }
    return true;
  }
  tryPlayerActionSequenceHit(){
    if(this.disposed||!this.timingSeasoning||!this.sequence||!this.sequenceReady||this.video.readyState<2||this.interaction?.done||this.sequenceTransitioning||this.segmentActive)return false;
    const entry=this.sequence[this.sequenceIndex],period=entry?.periodMs||1800,elapsed=(performance.now()-this.seasoningCycleOrigin)/1000,cycle=Math.floor(elapsed/(period/1000));
    if(cycle===this.seasoningLastAttemptCycle)return false;this.seasoningLastAttemptCycle=cycle;
    const phase=(elapsed%(period/1000))/(period/1000),distance=Math.abs(phase-.78),verdict=distance<=.075?'perfect':distance<=.205?'good':'miss',index=this.sequenceIndex,total=entry.hits||1;
    if(verdict==='perfect')this.perfectCombo++;else if(verdict==='miss')this.perfectCombo=0;
    const count=this.sequenceCounts[index]+(verdict==='miss'?0:1),detail={count,total,amount:verdict==='miss'?0:1,combo:this.perfectCombo,cycle,phase,label:entry.label};
    const points=this.options.onSeasoningHit?.(verdict,index,detail)??0;this.showTimingHitFeedback(verdict,points,index===1?'salt':'pepper');
    if(verdict==='miss')return true;
    this.pendingActionVerdict=verdict;this.segmentActive=true;this.sequenceTransitioning=true;this.segmentEnd=this.video.duration-.035;this.video.loop=false;
    if(this.seasoningIndicator)this.seasoningIndicator.style.opacity='0';
    if(this.video.currentTime>.04){this.video.pause();this.video.currentTime=0}
    this.video.play().catch(()=>{this.segmentActive=false;this.sequenceTransitioning=false;if(this.seasoningIndicator)this.seasoningIndicator.style.opacity='1';this.options.onFeedback?.('영상을 불러오지 못했어요. 다시 눌러주세요.')});
    return true;
  }
  finishPlayerActionSequence(){
    if(!this.playerActionSequence||!this.segmentActive||this.disposed)return;
    this.segmentActive=false;this.video.pause();const index=this.sequenceIndex,entry=this.sequence[index],total=entry.hits||1;
    this.sequenceCounts[index]++;this.sequenceAmounts[index]=1;
    this.interaction.state.tonkatsuSequenceCounts=[...this.sequenceCounts];
    this.options.onSequenceProgress?.(index,this.sequenceCounts[index],total,this.sequence,this.sequenceAmounts[index],this.pendingActionVerdict,this.perfectCombo);
    this.pendingActionVerdict=null;
    if(index+1<this.sequence.length){
      this.sequenceTransitioning=true;this.sequenceReady=false;if(this.seasoningIndicator)this.seasoningIndicator.style.opacity='0';
      this.transitionTimer=setTimeout(()=>{if(this.disposed)return;const next=this.sequence[index+1];this.sequenceIndex=index+1;this.sequenceTransitioning=false;this.seasoningLastAttemptCycle=-1;this.video.src=next.video;this.video.load();},160);
      return;
    }
    this.sequenceTransitioning=true;this.finishSeasoningTimer=setTimeout(()=>{if(!this.disposed)this.interaction.complete({sequenceCounts:[...this.sequenceCounts],perfectCombo:this.perfectCombo})},360);
  }
  tryPastaAction(){
    if(!this.pastaMode||this.disposed||this.interaction?.done||this.pastaActionLocked)return false;
    if(this.pastaTiming)return this.tryPastaTimingHit();
    const total=this.step.pastaTarget||1;this.pastaActionCount++;this.pastaActionLocked=true;this.interaction.state.pastaActionCount=this.pastaActionCount;if(this.step.pastaAction==='boil')this.interaction.state.boilingLevel=1;if(this.step.pastaAction==='add')this.interaction.state.pastaAdded=true;
    const detail={count:this.pastaActionCount,total,action:this.step.pastaAction,verdict:'good',combo:0};this.triggerPastaAction('good',detail);this.options.onPastaAction?.('good',detail);
    this.pastaResponseTimer=setTimeout(()=>{if(this.disposed)return;this.pastaActionLocked=false;if(this.pastaActionCount>=total)this.interaction.complete(true)},440);return true;
  }
  tryPastaTimingHit(){
    if(!this.pastaTiming||this.disposed||this.video.readyState<2||this.interaction?.done||this.pastaTimingLocked||this.pastaActionLocked)return false;this.pastaTimingLocked=true;clearTimeout(this.pastaUnlockTimer);this.pastaUnlockTimer=setTimeout(()=>{this.pastaTimingLocked=false},420);
    const period=this.step.pastaPeriodMs||2000,elapsed=performance.now()-this.seasoningCycleOrigin,phase=(elapsed%period)/period,distance=Math.abs(phase-.70),verdict=distance<=.085?'perfect':distance<=.245?'good':'miss';
    if(verdict==='perfect')this.pastaPerfectCombo++;else this.pastaPerfectCombo=0;if(verdict!=='miss')this.pastaActionCount++;
    if(verdict!=='miss'&&this.step.pastaAction==='boil')this.interaction.state.boilingLevel=1;
    if(verdict!=='miss'&&this.step.pastaAction==='cook')this.interaction.state.pastaCookLevel=Math.min(1,this.pastaActionCount/(this.step.pastaTarget||1));
    if(verdict!=='miss'&&this.step.pastaAction==='stir')this.interaction.state.mixAmount=Math.min(1,this.pastaActionCount/(this.step.pastaTarget||1));
    const detail={count:this.pastaActionCount,total:this.step.pastaTarget||1,action:this.step.pastaAction,verdict,combo:this.pastaPerfectCombo,phase};this.interaction.state.pastaActionCount=this.pastaActionCount;this.interaction.state.pastaPerfectCombo=this.pastaPerfectCombo;
    this.triggerPastaAction(verdict,detail);this.options.onPastaAction?.(verdict,detail);if(verdict!=='miss')this.seasoningCycleOrigin=performance.now()-period*.48;
    if(this.pastaActionCount>=detail.total){this.pastaActionLocked=true;this.pastaResponseTimer=setTimeout(()=>{if(!this.disposed)this.interaction.complete(true)},520)}return true;
  }
  triggerPastaAction(verdict,detail){if(!this.pastaFx)return;clearTimeout(this.pastaResponseTimer);this.scene.dataset.pastaAction=this.step.pastaAction||'cook';this.scene.dataset.pastaVerdict=verdict;this.scene.classList.remove('pasta-action-active');void this.scene.offsetWidth;this.scene.classList.add('pasta-action-active');this.pastaFxVerdict.textContent=verdict==='perfect'?(detail.combo>1?`PERFECT ×${detail.combo}`:'PERFECT!'):verdict==='good'?'GOOD!':'계속 끓여요';this.pastaFxScore.textContent=verdict==='perfect'?'+100':verdict==='good'?'+50':'';this.pastaFx.dataset.count=String(detail.count||0);this.pastaFx.dataset.total=String(detail.total||1);this.pastaResponseTimer=setTimeout(()=>{this.scene.classList.remove('pasta-action-active');this.pastaFxVerdict.textContent=''},verdict==='miss'?620:900)}
  setPastaPour(amount,held){if(!this.pastaPourStream)return;this.pastaPourStream.style.setProperty('--pasta-pour-amount',String(Math.min(1,Math.max(0,amount))));this.scene.classList.toggle('pasta-pouring',held&&amount>0)}
  ramenAssetMap(){return ['assets/videos/ramen-bone.mp4','assets/videos/ramen-soy.mp4','assets/videos/ramen-pepper.mp4','assets/videos/ramen-broth.mp4','assets/videos/ramen-noodle-add.mp4','assets/videos/ramen-noodle-cook.mp4','assets/videos/ramen-broth-pour.mp4']}
  preloadRamenAssets(){if(!this.ramenMode||window.ramenAssetPreloadPool)return;window.ramenAssetPreloadPool=[];for(const src of this.ramenAssetMap()){const preload=document.createElement('video');preload.muted=true;preload.preload='auto';preload.src=src;preload.setAttribute('aria-hidden','true');preload.style.cssText='position:absolute;width:1px;height:1px;opacity:0;pointer-events:none';preload.addEventListener('error',()=>console.error('[Ramen asset load failed]',{asset:src,step:this.step.label,subAction:this.ramenSubActionForAsset(src)||this.ramenEntry()?.label||this.step.ramenAction||'action'}),{once:true});document.body.append(preload);preload.load();window.ramenAssetPreloadPool.push(preload)}}
  ramenSubActionForAsset(src){return ({'assets/videos/ramen-bone.mp4':'돼지뼈 넣기','assets/videos/ramen-soy.mp4':'간장 넣기','assets/videos/ramen-pepper.mp4':'후추 뿌리기','assets/videos/ramen-broth.mp4':'육수 끓이기','assets/videos/ramen-noodle-add.mp4':'면 넣기','assets/videos/ramen-noodle-cook.mp4':'면 저으며 삶기','assets/videos/ramen-broth-pour.mp4':'육수 붓기'})[src]||'ambient'}
  ramenPosterForAsset(src){return ({'assets/videos/ramen-bone.mp4':'assets/ramen/돼지뼈.png','assets/videos/ramen-soy.mp4':'assets/ramen/간장넣기.png','assets/videos/ramen-pepper.mp4':'assets/ramen/후추.png','assets/videos/ramen-broth.mp4':'assets/ramen/육수끓이기.png','assets/videos/ramen-noodle-add.mp4':'assets/ramen/면넣기.png','assets/videos/ramen-noodle-cook.mp4':'assets/ramen/면끓이기.png','assets/videos/ramen-broth-pour.mp4':'assets/ramen/육수넣기.png'})[src]||''}
  watchRamenSource(src){const video=this.video;if(!video||!src)return;video.dataset.asset=src;if(this.ramenSourceErrorListener)video.removeEventListener('error',this.ramenSourceErrorListener);this.ramenSourceErrorListener=()=>console.error('[Ramen asset load failed]',{asset:src,step:this.step.label,subAction:this.ramenSubActionForAsset(src)||this.ramenEntry()?.label||this.step.ramenAction||'action'});video.addEventListener('error',this.ramenSourceErrorListener,{once:true})}
  ramenIsAmbient(){return this.ramenCurrentAction==='boil'}
  setRamenVisualSource(src){
    if(!this.ramenMode||!src)return;
    const video=this.video,current=video.dataset.asset||video.getAttribute('src')||'',action=this.ramenEntry()?.action;
    const keepOriginalFrame=action==='bone'||action==='pepper';
    if(this.ramenIdlePoster){this.ramenIdlePoster.src=this.ramenPosterForAsset(src);this.ramenIdlePoster.style.opacity=keepOriginalFrame?'0':'1'}
    if(current!==src){video.pause();video.removeAttribute('src');video.load();video.poster=this.ramenPosterForAsset(src);video.src=src;video.load()}
    video.dataset.ramenRole=this.ramenIsAmbient()?'ambient':'motion-reference';
    this.watchRamenSource(src);video.autoplay=false;video.loop=this.ramenIsAmbient();
    if(this.ramenIsAmbient()&&video.readyState>=2){video.style.opacity='1';video.play().catch(()=>{})}
    else{video.pause();video.style.opacity=keepOriginalFrame?'1':'0';if(this.ramenIdlePoster)this.ramenIdlePoster.style.opacity=keepOriginalFrame?'0':'1';this.scene.classList.toggle('ramen-source-bone',action==='bone');this.scene.classList.toggle('ramen-source-pepper',action==='pepper');document.body.classList.toggle('ramen-bone-mode',action==='bone')}
  }
  showRamenActionVisual(held=false){if(!this.ramenActionVideo)return;this.ramenActionVisible=true;if(this.ramenActionVideo.readyState>=2)this.ramenActionVideo.style.opacity='1';this.ramenActionVideo.classList.toggle('is-holding',held);clearTimeout(this.ramenVisualHideTimer);if(!held)this.ramenVisualHideTimer=setTimeout(()=>{this.ramenActionVisible=false;if(this.ramenActionVideo)this.ramenActionVideo.style.opacity='0'},1050)}
  ramenEntry(){return this.ramenSequence?.[this.ramenSequenceIndex]||null}
  ramenCurrentMode(){const action=this.ramenSequence?this.ramenEntry()?.action:this.step.ramenAction;if(this.step.ramenModeType==='continuous'||action==='noodleStir')return'continuous';return action==='soy'||action==='brothPour'?'hold':'timing'}
  updateRamenSubAction(){const e=this.ramenEntry();if(!e)return;this.ramenCurrentAction=e.action;this.ramenTarget=e.target||1;this.ramenCount=e.action==='bone'?(this.ramenState.boneCount||0):e.action==='pepper'?(this.ramenState.pepperCount||0):0;this.ramenAmount=e.action==='soy'?(this.ramenState.soySauceAmount||0):0;this.ramenPhaseOrigin=performance.now();this.ramenLastAttempt=-1;this.ramenCombo=0;this.ramenLocked=false;this.ramenActionPlaying=false;this.ramenInputSuccess=false;this.ramenVisualActionComplete=false;this.ramenPhase='WAITING';this.scene.dataset.ramenAction=e.action;if(this.ramenWorld)this.ramenWorld.dataset.action=e.action;this.setRamenVisualSource(e.referenceVideo);const g=document.getElementById('meter'),hold=e.action==='soy',range=e.amountRange||{min:.34,max:.72};if(this.ramenIdlePoster)this.ramenIdlePoster.style.opacity=hold?'1':'0';if(hold)this.video.style.opacity='0';g?.classList.toggle('pour-gauge',hold);g?.classList.toggle('free-pour-gauge',hold);g?.classList.toggle('timing-gauge',!hold&&!['bone','pepper'].includes(e.action));g?.classList.remove('pour-timing-gauge');if(g&&hold){g.style.setProperty('--meter-left',range.min*100+'%');g.style.setProperty('--meter-width',(range.max-range.min)*100+'%');const sweet=g.querySelector('.sweetspot');if(sweet){sweet.style.left=range.min*100+'%';sweet.style.width=(range.max-range.min)*100+'%'}}g?.style.setProperty('--pour-progress',String(Math.round(this.ramenAmount*100))+'%');g?.removeAttribute('aria-hidden');document.body.classList.remove('ramen-action-no-meter');if(this.ramenPepperCue)this.ramenPepperCue.hidden=true;const needle=document.getElementById('needle');if(needle)needle.style.left='0%';const label=g?.querySelector('.meter-label');if(label)label.textContent=hold?'간장 양':e.action==='bone'?'돼지뼈 타이밍':e.action==='pepper'?'후추 타이밍':'조리 타이밍';this.options.onRamenSubAction?.(e.action,this.ramenSequenceIndex,this.ramenSequence.length);this.options.onRamenProgress?.({action:e.action,count:this.ramenCount,total:this.ramenTarget,amount:this.ramenAmount,subIndex:this.ramenSequenceIndex,subTotal:this.ramenSequence.length,phase:this.ramenPhase});const c=document.getElementById('counter');if(c){c.hidden=e.action==='bone';c.textContent=e.action==='bone'?'돼지뼈 '+this.ramenCount+'/'+this.ramenTarget:e.action==='pepper'?'후추 '+this.ramenCount+'/'+this.ramenTarget:Math.round(this.ramenAmount*100)+'%'}}
  startRamenAction(action,verdict,detail={}){
    if(this.ramenActionPlaying||this.disposed)return false;
    this.ramenCurrentAction=action;this.ramenActionPlaying=true;this.ramenInputSuccess=true;this.ramenVisualActionComplete=false;this.ramenPhase='ACTION';this.ramenLocked=true;this.ramenPendingAction={action,verdict,detail};this.scene.dataset.ramenAction=action;this.scene.dataset.ramenVerdict=verdict;
    if(action==='bone'||action==='pepper'){
      const video=this.video;
      if(video.readyState<2){this.ramenActionPlaying=false;this.ramenLocked=false;this.ramenPhase='WAITING';return false}
      this.ramenWorld?.classList.remove('ramen-action-active','ramen-bone-drop','ramen-pepper-shake');
      if(this.ramenIdlePoster)this.ramenIdlePoster.style.opacity='0';
      video.style.opacity='1';video.loop=false;video.playbackRate=1;
      if(action==='bone'){
        video.pause();try{video.currentTime=0}catch{}
        video.play().catch(error=>{console.error('[Ramen bone video failed]',{asset:video.dataset.asset,step:this.step.label,error});this.ramenActionPlaying=false;this.ramenLocked=false;this.ramenPhase='WAITING'});
        return true;
      }
      this.ramenPepperSequenceActive=true;this.ramenPepperHitsComplete=false;this.ramenPepperBeatReadyAt=0;this.ramenActionEnd=Infinity;
      video.pause();try{video.currentTime=0}catch{}
      this.registerRamenPepperBeat(verdict,detail);
      video.play().catch(error=>{console.error('[Ramen pepper video failed]',{asset:video.dataset.asset,step:this.step.label,error});this.ramenActionPlaying=false;this.ramenPepperSequenceActive=false;this.ramenLocked=false;this.ramenPhase='WAITING'});
      return true;
    }
    this.ramenWorld?.classList.add('ramen-action-active');
    if(action==='boil'){this.options.onRamenAction?.({action,verdict,...detail});this.ramenActionTimer=setTimeout(()=>this.finishRamenAction(),720);return true}
    if(this.ramenGameAnimation&&action==='noodleStir')return this.startRamenStirMotion(verdict,detail);
    const video=this.video;if(video.readyState<2){this.ramenActionPlaying=false;this.ramenLocked=false;return false}
    const entry=this.ramenEntry(),fraction=entry?.actionEndFraction||this.step.actionEndFraction||.8;
    this.ramenActionEnd=Math.max(.12,(video.duration||4)*fraction);if(this.ramenIdlePoster)this.ramenIdlePoster.style.opacity='0';video.style.opacity='1';video.loop=false;video.pause();try{video.currentTime=0}catch{}video.playbackRate=1;
    video.play().then(()=>{clearTimeout(this.ramenActionTimer);this.ramenActionTimer=setTimeout(()=>this.finishRamenAction(),Math.max(250,this.ramenActionEnd/video.playbackRate*1000+180))}).catch(error=>{console.error('[Ramen action playback failed]',{asset:video.dataset.asset,step:this.step.label,subAction:action,error});this.ramenActionPlaying=false;this.ramenLocked=false;this.ramenWorld?.classList.remove('ramen-action-active','ramen-action-climax')});return true;
  }
  trackRamenAction(){if(this.ramenMode&&this.ramenActionPlaying&&this.ramenCurrentAction!=='boil'&&!this.ramenPepperSequenceActive&&this.video.currentTime>=(this.ramenActionEnd||Infinity))this.finishRamenAction()}
  finishRamenAction(){
    if(!this.ramenMode||!this.ramenActionPlaying)return;
    this.ramenActionPlaying=false;this.ramenVisualActionComplete=true;clearTimeout(this.ramenActionTimer);
    const {action,verdict}=this.ramenPendingAction||{};this.ramenPhase='RECOVERY';this.ramenWorld?.classList.remove('ramen-action-active','ramen-action-climax','ramen-stir-action','ramen-stir-hit');document.getElementById('meter')?.classList.remove('ramen-action-locked');
    if(action!=='boil'&&!this.ramenGameAnimation)this.video.pause();
    if(action==='bone'){
      this.ramenCount=(this.ramenState.boneCount||0)+1;this.ramenState.boneCount=this.ramenCount;this.ramenState.bonesAdded=this.ramenState.boneAdded=true;
      this.options.onRamenAction?.({action,verdict,count:this.ramenCount,total:this.ramenTarget});this.options.onRamenProgress?.({action,count:this.ramenCount,total:this.ramenTarget,phase:this.ramenPhase});this.advanceRamenSubAction();return;
    }
    if(action==='pepper'){
      this.ramenPepperSequenceActive=false;this.ramenLocked=true;
      if(this.ramenCount>=this.ramenTarget){this.ramenState.pepperAdded=true;this.options.onRamenProgress?.({action,count:this.ramenCount,total:this.ramenTarget,phase:'COMPLETE'});this.advanceRamenSubAction();return}
      try{this.video.currentTime=0}catch{}this.readyRamenRound();return;
    }
    if(action==='boil'){this.ramenState.boilingLevel=(this.ramenState.boilingLevel||0)+1;this.ramenCount=this.ramenState.boilingLevel;this.options.onRamenProgress?.({action,count:this.ramenCount,total:this.ramenTarget,phase:this.ramenPhase});if(this.ramenCount>=this.ramenTarget){this.ramenPhase='COMPLETE';this.interaction.complete(true)}else this.readyRamenRound();return}
    if(action==='noodleAdd'){this.ramenState.noodlesAdded=true;this.options.onRamenAction?.({action,verdict,count:1,total:1});this.ramenPhase='COMPLETE';this.interaction.complete(true);return}
    if(action==='noodleStir'){this.ramenCount=(this.ramenState.noodleStirCount||0)+1;this.ramenState.noodleStirCount=this.ramenCount;this.ramenState.noodleStirProgress=Math.min(1,this.ramenCount/this.ramenTarget);const percent=Math.floor(this.ramenState.noodleStirProgress*100);const counter=document.getElementById('counter');if(counter)counter.textContent=`면 익힘 ${percent}%`;this.options.onRamenAction?.({action,verdict,count:this.ramenCount,total:this.ramenTarget});this.options.onRamenProgress?.({action,count:this.ramenCount,total:this.ramenTarget,progress:this.ramenState.noodleStirProgress,verdict,phase:this.ramenPhase});if(this.ramenCount>=this.ramenTarget){this.ramenPhase='COMPLETE';this.interaction.complete(true);return}if(this.ramenStirQueue>0){this.ramenStirQueue--;this.ramenActionTimer=setTimeout(()=>this.startRamenAction('noodleStir',verdict,{queued:true}),90)}else{this.ramenPhase='WAITING';this.ramenLocked=false}}
  }
  readyRamenRound(){this.ramenPhase='RECOVERY';this.ramenLocked=true;this.ramenPhaseOrigin=performance.now();this.ramenLastAttempt=-1;const c=document.getElementById('counter');if(c)c.textContent=(this.ramenCurrentAction==='bone'?'돼지뼈':this.ramenCurrentAction==='pepper'?'후추':this.ramenCurrentAction==='noodleStir'?'면 젓기':'육수 끓이기')+' '+this.ramenCount+'/'+this.ramenTarget;this.ramenActionTimer=setTimeout(()=>{if(this.disposed)return;this.ramenPhase='WAITING';this.ramenLocked=false;this.ramenPhaseOrigin=performance.now()},260)}
  ramenInput(type){
    if(!this.ramenMode||this.disposed||this.interaction?.done)return false;
    const mode=this.ramenCurrentMode(),pepperLive=this.ramenCurrentAction==='pepper'&&this.ramenPepperSequenceActive;
    if(mode==='continuous'){if(type!=='press')return false;if(this.ramenActionPlaying){this.ramenStirQueue=Math.min(Math.max(0,this.ramenTarget-this.ramenCount),(this.ramenStirQueue||0)+1);return true}return this.startRamenAction('noodleStir','good',{input:'space'})}
    if(this.ramenActionPlaying&&!pepperLive)return false;
    if(mode==='hold'){const video=this.video,action=this.ramenCurrentAction,rate=this.ramenSequence?this.ramenEntry()?.rate||.38:this.step.rate||.29,range=this.ramenSequence?this.ramenEntry()?.amountRange||{min:.34,max:.72}:this.step.amountRange||{min:.36,max:.76};if(type==='press'){if(this.ramenHeld||this.ramenPhase==='COMPLETE')return false;this.ramenHeld=true;this.ramenPressTime=performance.now();this.ramenPressStartAmount=this.ramenAmount;this.ramenHeldRate=rate;this.ramenWorld?.classList.add('ramen-holding');if(this.ramenIdlePoster)this.ramenIdlePoster.style.opacity='0';video.style.opacity='1';video.loop=false;video.playbackRate=Math.max(.1,(video.duration||4)*rate);if(video.readyState>=2)video.play().catch(()=>{});return true}if(type==='release'&&this.ramenHeld){const now=performance.now();this.ramenAmount=Math.min(1,this.ramenPressStartAmount+(now-this.ramenPressTime)/1000*rate);if(this.ramenSequence)this.ramenState.soySauceAmount=this.ramenAmount;else this.ramenState.brothPourAmount=this.ramenState.ramenBowlLevel=this.ramenAmount;this.ramenHeld=false;this.ramenWorld?.classList.remove('ramen-holding');video.pause();video.style.opacity='0';if(this.ramenIdlePoster)this.ramenIdlePoster.style.opacity='1';this.setRamenHoldVisual();const amount=this.ramenAmount;if(amount<range.min){this.options.onRamenAction?.({action,verdict:'too_little',amount});return true}if(amount>range.max){this.options.onRamenAction?.({action,verdict:'too_much',amount});this.ramenAmount=0;if(action==='soy')this.ramenState.soySauceAmount=0;else this.ramenState.brothPourAmount=this.ramenState.ramenBowlLevel=0;try{video.currentTime=0}catch{}this.setRamenHoldVisual();return true}if(action==='soy'){this.ramenState.soyAdded=true;this.ramenState.soySauceAmount=amount;this.options.onRamenAction?.({action,verdict:'good',amount,count:1,total:1});this.advanceRamenSubAction()}else{this.ramenState.brothPourAmount=this.ramenState.ramenBowlLevel=amount;this.ramenPhase='COMPLETE';this.options.onRamenAction?.({action:'pour',verdict:'good',amount,count:1,total:1});this.interaction.complete(true)}return true}return false}
    if(type!=='press'||(!pepperLive&&(this.ramenLocked||this.ramenPhase==='RECOVERY'||this.ramenPhase==='COMPLETE'))||!this.ramenCanAcceptTimingInput())return false;
    return this.ramenTimingHit();
  }
  advanceRamenSubAction(){if(!this.ramenSequence)return;const previous=this.ramenEntry()?.action;this.ramenLocked=true;this.ramenPhase='RECOVERY';this.ramenActionTimer=setTimeout(()=>{if(this.disposed)return;if(this.ramenSequenceIndex+1<this.ramenSequence.length){this.ramenSequenceIndex++;this.ramenLocked=false;this.updateRamenSubAction()}else if(this.ramenState.bonesAdded&&this.ramenState.pepperAdded&&this.ramenState.soyAdded){this.ramenState.brothPrepared=true;this.ramenPhase='COMPLETE';this.interaction.complete(true)}else{this.ramenLocked=false;this.ramenPhase='WAITING'}},previous==='bone'?320:180)}
  ramenCanAcceptTimingInput(){
    if(this.ramenCurrentAction==='pepper'&&this.ramenPepperSequenceActive)return !this.ramenPepperHitsComplete&&performance.now()>=(this.ramenPepperBeatReadyAt||0);
    return !this.ramenActionPlaying&&!this.ramenLocked&&this.ramenPhase!=='RECOVERY'&&this.ramenPhase!=='COMPLETE';
  }
  registerRamenPepperBeat(verdict,detail={}){
    if(!this.ramenPepperSequenceActive||this.ramenPepperHitsComplete||performance.now()<(this.ramenPepperBeatReadyAt||0))return false;
    this.ramenCount=Math.min(this.ramenTarget,this.ramenCount+1);this.ramenPepperBeatReadyAt=performance.now()+560;this.ramenPepperHitsComplete=this.ramenCount>=this.ramenTarget;
    this.ramenState.pepperCount=this.ramenCount;this.ramenState.pepperAdded=false;this.ramenPhase='ACTION';
    const beat={action:'pepper',verdict,count:this.ramenCount,total:this.ramenTarget,combo:this.ramenCombo,marker:window.gameTimingPosition??0,...detail};
    this.options.onRamenAction?.(beat);this.options.onRamenProgress?.({...beat,phase:this.ramenPhase});return true;
  }
  ramenTimingHit(judgment={}){
    const action=this.ramenCurrentAction,pepperLive=action==='pepper'&&this.ramenPepperSequenceActive;
    if((this.ramenActionPlaying&&!pepperLive)||(this.ramenLocked&&!pepperLive)||(!pepperLive&&(this.ramenPhase==='RECOVERY'||this.ramenPhase==='COMPLETE')))return false;
    if(pepperLive&&!this.ramenCanAcceptTimingInput())return false;
    const verdict=judgment.verdict||'miss',detail={count:this.ramenCount,total:this.ramenTarget,combo:this.ramenCombo,marker:window.gameTimingPosition??0,...judgment};
    if(verdict==='miss'){if(!pepperLive)this.ramenPhase='WAITING';this.scene.dataset.ramenVerdict='miss';this.options.onRamenAction?.({action,verdict,...detail});this.options.onRamenProgress?.({action,count:this.ramenCount,total:this.ramenTarget,verdict,phase:this.ramenPhase});return true}
    if(pepperLive)return this.registerRamenPepperBeat(verdict,detail);
    return this.startRamenAction(action,verdict,detail);
  }
  ramenAction(action,verdict,detail={}){this.scene.dataset.ramenAction=action;this.scene.dataset.ramenVerdict=verdict;this.ramenPendingAction={action,verdict,detail};this.options.onRamenAction?.({action,verdict,...detail})}
  setRamenHoldVisual(){const g=document.getElementById('meter');g?.style.setProperty('--pour-progress',String(Math.round(this.ramenAmount*100))+'%');this.ramenWorld?.style.setProperty('--ramen-pour-amount',String(this.ramenAmount));this.options.onRamenProgress?.({action:this.ramenCurrentAction,amount:this.ramenAmount,count:0,total:1,held:this.ramenHeld})}
  updateRamenCue(){
    if(!this.ramenWorld)return;
    const mode=this.ramenCurrentMode(),action=this.ramenCurrentAction;
    if(mode==='timing'&&(action==='bone'||action==='pepper')){document.getElementById('meter')?.classList.remove('timing-gauge');return}
    if(mode==='timing'&&this.ramenPhase!=='ACTION'&&this.ramenPhase!=='RECOVERY'&&this.ramenPhase!=='COMPLETE'){
      const periods=this.step.ramenPeriodsMs,period=periods?.[Math.min(this.ramenCount,periods.length-1)]||this.ramenEntry()?.periodMs||this.step.ramenPeriodMs||2100,phase=(((performance.now()-this.ramenPhaseOrigin)%period)+period)%period/period,marker=phase<=.5?phase*2:2-phase*2,n=document.getElementById('needle'),g=document.getElementById('meter');
      if(n)n.style.left='calc('+marker*100+'% - 4px)';if(g){g.classList.add('timing-gauge');g.classList.remove('pour-gauge','free-pour-gauge');g.dataset.ramenCue=Math.abs(marker-.5)<=.15?'CUE':'WAITING'}
    }else if(mode==='hold')this.setRamenHoldVisual();
  }
  showTimingHitFeedback(verdict,points,spice='pepper'){
    if(this.seasoningVerdict){this.seasoningVerdict.textContent=verdict==='perfect'?(this.perfectCombo>1?`PERFECT ×${this.perfectCombo}`:'PERFECT!'):verdict==='good'?'GOOD!':'MISS';this.seasoningVerdict.dataset.result=verdict;this.seasoningVerdict.classList.remove('is-visible');void this.seasoningVerdict.offsetWidth;this.seasoningVerdict.classList.add('is-visible')}
    if(this.seasoningIndicator){this.seasoningIndicator.dataset.spice=spice;this.seasoningIndicator.dataset.grains=String(verdict==='perfect'?5:verdict==='good'?3:1);this.seasoningGrains?.forEach((grain,i)=>{grain.classList.toggle('is-visible',i<(verdict==='perfect'?5:verdict==='good'?3:1));grain.style.setProperty('--grain-x',`${[-16,15,-12,13,0][i]}px`);grain.style.setProperty('--grain-y',`${[-3,-4,12,14,20][i]}px`)});this.seasoningIndicator.classList.remove('grain-burst');void this.seasoningIndicator.offsetWidth;this.seasoningIndicator.classList.add('grain-burst')}
    if(this.seasoningScore){this.seasoningScore.textContent=points>0?`+${points}`:`${points}`;this.seasoningScore.classList.remove('is-visible');void this.seasoningScore.offsetWidth;this.seasoningScore.classList.add('is-visible')}
    if(verdict!=='miss'){this.seasoningIndicator?.classList.remove('seasoning-hit');void this.seasoningIndicator?.offsetWidth;this.seasoningIndicator?.classList.add('seasoning-hit')}
  }
  stirTimingPeriod(){const periods=this.step.stirPeriodsMs||[2400,2050,1750];return periods[Math.min(this.stirTimingCount,periods.length-1)]||1800}
  tryStirTimingHit(){
    if(this.disposed||!this.stirTiming||!this.seasoningIndicator||this.video.readyState<2||this.interaction?.done)return false;
    const period=this.stirTimingPeriod(),elapsed=performance.now()-this.seasoningCycleOrigin,cycle=Math.floor(elapsed/period);
    if(cycle===this.seasoningLastAttemptCycle)return false;this.seasoningLastAttemptCycle=cycle;
    const phase=(elapsed%period)/period,distance=Math.abs(phase-.78),verdict=distance<=.075?'perfect':distance<=.205?'good':'miss';
    if(verdict==='perfect')this.perfectCombo++;else if(verdict==='miss')this.perfectCombo=0;
    if(verdict!=='miss')this.stirTimingCount++;
    const total=this.step.stirTimingRounds||3,detail={count:this.stirTimingCount,total,combo:this.perfectCombo,cycle,phase,round:Math.min(total,this.stirTimingCount+1)};
    const points=this.options.onSeasoningHit?.(verdict,0,detail)??0;this.interaction.state.tteokStirTimingCount=this.stirTimingCount;this.interaction.state.tteokStirPerfectCombo=this.perfectCombo;
    this.showTimingHitFeedback(verdict,points,'tteok');
    if(verdict!=='miss'){this.scene.classList.toggle('tteok-stir-final-round',this.stirTimingCount===total-1);this.triggerStirResponse(this.stirTimingCount>=total);this.seasoningCycleOrigin=performance.now();this.seasoningLastAttemptCycle=-1;this.options.onStirTimingSuccess?.(this.stirTimingCount,total)}
    return true;
  }
  triggerStirResponse(climax=false){if(this.disposed)return;clearTimeout(this.stirResponseTimer);this.scene.classList.remove('tteok-stir-active','tteok-stir-climax');if(climax)this.scene.classList.remove('tteok-stir-final-round');void this.scene.offsetWidth;this.scene.classList.add('tteok-stir-active');this.scene.classList.toggle('tteok-stir-climax',climax);this.stirResponseTimer=setTimeout(()=>this.scene.classList.remove('tteok-stir-active','tteok-stir-climax'),climax?900:650)}
  advanceTapChunk(queued=false){
    if(this.disposed||!this.sequence||this.segmentActive||this.sequenceTransitioning||this.interaction?.done)return;
    const entry=this.sequence[this.sequenceIndex];if(!entry)return;
    if(this.video.readyState<2||!Number.isFinite(this.video.duration)||this.video.duration<=0){if(!queued&&!this.sequenceTapQueued){this.sequenceTapQueued=true;this.options.onSequenceTap?.(this.sequenceIndex,this.sequenceCounts[this.sequenceIndex]+1,entry.taps||5,entry)}return}
    const count=this.sequenceCounts[this.sequenceIndex],total=entry.taps||5;
    this.segmentEnd=Math.min(this.video.duration*(count+1)/total,this.video.duration-.025);this.segmentActive=true;
    if(!queued)this.options.onSequenceTap?.(this.sequenceIndex,count+1,total,entry);
    // Play only this tap's short seasoning motion. Seeking directly to the end
    // skipped the hand movement and showed only a still frame.
    this.video.play().catch(()=>{this.segmentActive=false});
  }
  finishTapChunk(){
    if(!this.sequence||!this.segmentActive)return;
    const video=this.video,entry=this.sequence[this.sequenceIndex],index=this.sequenceIndex;this.segmentActive=false;video.pause();
    this.sequenceCounts[index]++;if(!this.sequenceVisualOnly)this.options.onSequenceProgress?.(this.sequenceIndex,this.sequenceCounts[index],entry.taps||5,this.sequence);
    if(this.sequenceCounts[index]<(entry.taps||5))return;
    if(index+1<this.sequence.length){this.sequenceTransitioning=true;this.transitionTimer=setTimeout(()=>{if(this.disposed)return;this.sequenceIndex=index+1;this.sequenceReady=false;this.sequenceTransitioning=false;if(!this.sequenceVisualOnly)video.style.opacity='0';video.src=this.sequence[this.sequenceIndex].video;video.load();if(!this.sequenceVisualOnly)this.options.onSequenceProgress?.(this.sequenceIndex,0,this.sequence[this.sequenceIndex].taps||5,this.sequence)},this.sequenceVisualOnly?160:560);return}
    if(!this.sequenceVisualOnly)this.interaction.complete(true);
  }
  playCutAction(){
    if(!this.cutActionSequence||this.disposed||this.sequenceTransitioning||this.interaction?.done)return;
    if(this.cutActionActive){this.cutActionQueued=Math.min(this.step.goal,this.cutActionQueued+1);return}
    if(!this.sequenceReady||!Number.isFinite(this.video.duration)){this.cutActionQueued=Math.min(this.step.goal,this.cutActionQueued+1);return}
    const entry=this.sequence[this.sequenceIndex],total=entry?.taps||5,index=this.sequenceCounts[this.sequenceIndex];if(!entry||index>=total)return;
    this.segmentEnd=Math.min(this.video.duration*(index+1)/total,this.video.duration-.025);this.segmentActive=true;this.cutActionActive=true;this.video.loop=false;this.scene.classList.add('tteok-cut-action-active');this.options.onCutActionTrigger?.(this.sequenceIndex,index+1);
    this.video.play().catch(()=>{this.cutActionActive=false;this.scene.classList.remove('tteok-cut-action-active')});
  }
  cutPendingSeconds(){if(!this.cutActionSequence)return 0;const entry=this.sequence?.[this.sequenceIndex],segment=(this.video.duration||4)/(entry?.taps||5),active=this.cutActionActive?Math.max(0,this.segmentEnd-this.video.currentTime):0;return active+this.cutActionQueued*segment}
  finishCutAction(){
    if(!this.cutActionSequence||!this.cutActionActive)return;
    const video=this.video,index=this.sequenceIndex,entry=this.sequence[index],total=entry.taps||5;this.cutActionActive=false;this.segmentActive=false;this.scene.classList.remove('tteok-cut-action-active');video.pause();this.sequenceCounts[index]++;
    if(this.sequenceCounts[index]>=total&&index+1<this.sequence.length){this.sequenceTransitioning=true;this.transitionTimer=setTimeout(()=>{if(this.disposed)return;this.sequenceIndex=index+1;this.sequenceReady=false;this.sequenceTransitioning=false;this.video.style.opacity='0';this.video.src=this.sequence[this.sequenceIndex].video;this.video.load();},160);return}
    if(this.cutActionQueued){this.cutActionQueued--;this.playCutAction();return}
    if(index===this.sequence.length-1&&this.sequenceCounts[index]>=total)this.cutSequenceFinished=true;
  }
  play(){if(this.disposed||this.video.ended||this.holdToPlay&&this.video.readyState<2)return;this.video.play().catch(()=>{});}
  stirTimingVerdict(){if(!this.stirActionPlayback)return'good';const period=this.step.stirCuePeriod||2400,phase=(((performance.now()-this.stirCueEpoch)%period)+period)%period/period,d=Math.abs(phase-(this.rhythmMode?.72:.76)),distance=Math.min(d,1-d);return distance<=.055?'perfect':distance<=.19?'good':'ok'}
  showStirFeedback(verdict,combo,finalBeat=false){if(!this.stirFeedback)return;this.stirFeedback.textContent=finalBeat?'휘익! 찰박! 완성!':'휘익! 찰박!';this.stirFeedback.dataset.result='action';this.stirFeedback.classList.toggle('is-climax',finalBeat);this.stirFeedback.classList.remove('is-visible');void this.stirFeedback.offsetWidth;this.stirFeedback.classList.add('is-visible');this.stirCue?.classList.add('is-hit');setTimeout(()=>this.stirCue?.classList.remove('is-hit'),320)}
  playStirAction(direction,climax=false){if(!this.stirActionPlayback||this.disposed)return;this.stirActionQueue.push({direction,climax});if(this.video.readyState<2){this.pendingStirDirection=direction;return;}this.startNextStirAction()}
  scheduleStirCue(delay=400){if(!this.rhythmMode||this.disposed||this.stirCompleteRequested)return;clearTimeout(this.stirCueTimer);this.stirCueReady=false;this.stirCue?.classList.remove('is-ready','is-hit');this.stirCueTimer=setTimeout(()=>this.showStirCue(),delay)}
  showStirCue(){if(!this.rhythmMode||this.disposed||this.interaction?.done||this.stirActionActive||this.stirCompleteRequested)return;const total=this.step.stirActions||4,final=this.stirSuccessCount+1>=total;this.stirCueReady=true;this.stirCaption.textContent=final?'마지막!':this.stirPromptShown?'':'눌러서 저어주세요!';this.stirPromptShown=true;this.stirSpacePrompt.textContent=final?'SPACE!!':'SPACE!';this.stirCue.dataset.final=final?'true':'false';this.stirCue.classList.remove('is-ready');void this.stirCue.offsetWidth;this.stirCue.classList.add('is-ready')}
  tryStirRhythm(){if(!this.rhythmMode||this.disposed||this.interaction?.done||this.video.readyState<2||!this.stirCueReady||this.stirActionActive)return false;this.stirCueReady=false;this.stirCue.classList.remove('is-ready');this.stirSuccessCount++;const total=this.step.stirActions||4,final=this.stirSuccessCount>=total,direction=this.stirSuccessCount%2?-1:1;this.stirActionQueue.push({direction,climax:final});if(final)this.stirCompleteRequested=true;this.showStirFeedback('action',0,final);this.options.onStirRhythm?.('action',this.stirSuccessCount,total,0,0,0);this.startNextStirAction();return true}
  startNextStirAction(){if(!this.stirActionPlayback||this.disposed||this.stirActionActive||!this.stirActionQueue.length||this.video.readyState<2)return;const action=this.stirActionQueue.shift(),{direction,climax}=action;this.pendingStirDirection=this.stirActionQueue.length?this.stirActionQueue[this.stirActionQueue.length-1].direction:null;this.scene.dataset.stirDirection=direction<0?'counterclockwise':'clockwise';this.scene.classList.toggle('tteok-stir-climax',climax);this.scene.classList.add('tteok-stir-active');this.video.currentTime=0;this.video.playbackRate=this.step.stirActionPlaybackRate||1;this.stirActionActive=true;this.video.play().catch(()=>{this.stirActionActive=false;this.stirActionQueue.unshift(action);this.scene.classList.remove('tteok-stir-active','tteok-stir-climax')})}
  completeStirAfterAction(){if(!this.stirActionPlayback||this.disposed)return;this.stirCompleteRequested=true;if(!this.stirActionActive&&!this.stirActionQueue.length)this.interaction.complete(true)}
  playFromStart(){if(this.disposed)return;this.video.currentTime=0;this.video.play().catch(()=>{});}
  pause(){if(this.ramenMode)return;this.video.pause();this.sync()}
  stopRamenAmbient(){if(!this.ramenMode)return;this.keepRamenVideo=false;this.video.pause();this.video.removeAttribute('src');this.video.load();if(window.ramenAmbientVideo===this.video)window.ramenAmbientVideo=null}
  updateStirCue(){}
  update(){if(this.disposed)return;if(this.ramenMode){const now=performance.now();if(this.ramenHeld&&this.ramenCurrentMode()==='hold'){const rate=this.ramenHeldRate||.3;this.ramenAmount=Math.min(1,(this.ramenPressStartAmount||0)+(now-this.ramenPressTime)/1000*rate);if(this.ramenSequence){this.ramenSequenceAmounts[this.ramenSequenceIndex]=this.ramenAmount;this.ramenState.soySauceAmount=this.ramenAmount}else{this.ramenState.brothPourAmount=this.ramenAmount;this.ramenState.ramenBowlLevel=this.ramenAmount}this.setRamenHoldVisual()}this.updateRamenCue();return}if(this.timingSeasoning||this.stirTiming||this.pastaTiming){const entry=this.sequence?.[this.sequenceIndex],period=this.pastaTiming?(this.step.pastaPeriodMs||2000):this.stirTiming?this.stirTimingPeriod():entry?.periodMs||1800,phase=((((performance.now()-this.seasoningCycleOrigin)%period)+period)%period)/period,target=this.pastaTiming?.70:.78,distance=Math.abs(phase-target),scale=1.55-.93*Math.min(1,phase/target);this.seasoningIndicator?.style.setProperty('--ring-scale',String(scale));if(this.seasoningIndicator)this.seasoningIndicator.dataset.timing=distance<=(this.pastaTiming?.085:.075)?'perfect':distance<=(this.pastaTiming?.245:.205)?'good':'waiting'}if(this.stirActionPlayback)this.updateStirCue();if(!this.holdToPlay&&!this.stirToPlay)return;const held=this.holdToPlay?this.interaction.heldSources.size>0:!!this.interaction.dragging&&!this.interaction.done;this.isHeld=held;if(held&&!this.video.ended&&this.video.paused)this.play();else if(!held&&!this.video.paused)this.pause()}
  sync(){if(this.disposed||this.manualTrigger||!this.interaction)return;this.interaction.cookElapsed=this.video.ended?this.video.duration:this.video.currentTime||0}
  get progress(){return Number.isFinite(this.video.duration)&&this.video.duration>0?Math.min(1,this.video.currentTime/this.video.duration):0}
  dispose(){this.disposed=true;if(this.ramenStirFrame)cancelAnimationFrame(this.ramenStirFrame);clearTimeout(this.transitionTimer);clearTimeout(this.finishSeasoningTimer);clearTimeout(this.stirCueTimer);clearTimeout(this.stirResponseTimer);clearTimeout(this.stirTimingCompleteTimer);clearTimeout(this.pastaResponseTimer);clearTimeout(this.pastaUnlockTimer);clearTimeout(this.ramenActionTimer);clearTimeout(this.ramenVisualHideTimer);this.video.pause();if(this.ramenMode){this.video.removeAttribute('src');this.video.load()}this.video.remove();this.video.removeEventListener('loadedmetadata',this.metadata);this.video.removeEventListener('loadeddata',this.ready);this.video.removeEventListener('timeupdate',this.syncTime);this.video.removeEventListener('timeupdate',this.sequenceTime);this.video.removeEventListener('timeupdate',this.ramenActionProgress);this.video.removeEventListener('ended',this.finish);this.sequencePreloaders.forEach(video=>{video.pause();video.remove()});this.seasoningIndicator?.remove();this.pastaFx?.remove();this.pastaPourStream?.remove();this.scene.classList.remove('pasta-action-active','pasta-pouring');delete this.scene.dataset.pastaAction;delete this.scene.dataset.pastaVerdict;this.scene.classList.remove('ramen-noodle-stir-game-scene');this.ramenWorld?.remove();this.ramenIdlePoster?.remove();this.ramenActionVideo?.pause();this.ramenActionVideo?.remove();delete this.scene.dataset.ramenAction;delete this.scene.dataset.ramenVerdict;this.stirAmbient?.remove();this.stirSplash?.remove();this.stirCue?.remove();this.stirFeedback?.remove();this.scene.classList.remove('tteok-stir-active','tteok-stir-climax','tteok-stir-final-round');this.stirFeedback?.remove();delete this.scene.dataset.stirDirection;this.scene.style.position=this.previousPosition}
}
VideoCookingScene.prototype.startRamenStirMotion=function(verdict='good',detail={}){
  if(this.disposed||!this.ramenGameAnimation||this.ramenStirFrame)return false;
  const sceneRect=this.scene.getBoundingClientRect(),hand=this.ramenStirHand,noodles=this.ramenStirNoodles;
  if(!hand||!noodles){this.ramenActionPlaying=false;this.ramenLocked=false;this.ramenPhase='WAITING';return false}
  const started=performance.now(),duration=3520;
  // Timings follow the observed clip: diagonal dip (0.1–0.9s), gather (0.9–1.5s),
  // lift (1.5–2.5s), brief hold (2.5–2.9s), lower/settle (2.9–3.5s).
  const handPath=[[0,0,0],[.10,-.012,.018],[.26,-.042,.066],[.42,-.058,.092],[.69,-.030,.018],[.79,-.027,.016],[.90,-.052,.087],[.96,-.030,.048],[1,0,0]];
  const noodlePath=[[0,0,0,1,0],[.15,-.010,.002,.99,0],[.34,-.025,.012,.91,-3.5],[.48,-.032,.010,.88,-4],[.70,-.018,-.155,.89,3],[.80,-.016,-.160,.89,2],[.91,-.030,-.018,.96,-2],[.97,-.012,.008,1,0],[1,0,0,1,0]];
  const sample=(path,t)=>{let i=1;while(i<path.length&&path[i][0]<t)i++;const a=path[Math.max(0,i-1)],b=path[Math.min(i,path.length-1)],span=b[0]-a[0],u=span?Math.max(0,Math.min(1,(t-a[0])/span)):1,e=u*u*(3-2*u);return a.slice(1).map((v,n)=>v+(b[n+1]-v)*e)};
  const draw=now=>{
    if(this.disposed||!this.ramenActionPlaying){this.ramenStirFrame=0;return}
    const t=Math.min(1,(now-started)/duration),[hx,hy]=sample(handPath,t),[nx,ny,sx,skew]=sample(noodlePath,Math.max(0,t-.11));
    hand.style.transform=`translate3d(${sceneRect.width*hx}px,${sceneRect.height*hy}px,0)`;
    noodles.style.transform=`translate3d(${noodles.clientWidth*nx}px,${noodles.clientHeight*ny}px,0) scaleX(${sx}) skewX(${skew}deg)`;
    const ripple=t>.34&&t<.94?Math.sin(Math.PI*(t-.34)/.60):0,surface=this.ramenWorld?.querySelector('.ramen-stir-ambient span');
    if(surface){surface.style.transform=`scaleY(${1+ripple*.045})`;surface.style.opacity=String(.45+ripple*.3)}
    if(t<1){this.ramenStirFrame=requestAnimationFrame(draw);return}
    this.ramenStirFrame=0;hand.style.transform='';noodles.style.transform='';if(surface){surface.style.transform='';surface.style.opacity=''}this.finishRamenAction();
  };
  this.ramenWorld?.classList.add('ramen-stir-action');this.ramenWorld?.classList.remove('ramen-stir-hit');void this.ramenWorld?.offsetWidth;this.ramenWorld?.classList.add('ramen-stir-hit');this.ramenStirFrame=requestAnimationFrame(draw);return true;
};
VideoCookingScene.prototype.updateRamenStirFrame=function(){};
VideoCookingScene.prototype.updateRamenCue=function(){if(!this.ramenWorld)return;const mode=this.ramenCurrentMode();if(mode==='hold')this.setRamenHoldVisual()};
window.VideoCookingScene=VideoCookingScene;
