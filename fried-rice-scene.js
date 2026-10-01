/* One persistent pan simulation for adding, stirring and tossing fried-rice ingredients. */
let friedRiceAssetsPromise;
function loadFriedRiceAssets(){
  if(friedRiceAssetsPromise)return friedRiceAssetsPromise;
  const image=path=>new Promise((resolve,reject)=>{const item=new Image();item.onload=()=>resolve(item);item.onerror=reject;item.src=path});
  friedRiceAssetsPromise=Promise.all([
    import('./frying-engine.js?v=6'),import('./frying-content.js?v=2'),
    image('assets/frying-prototype/kitchen-background.png'),
    image('assets/frying-prototype/empty-red-pan.png'),
    image('assets/frying-prototype/left-hand.png'),
    image('assets/frying-prototype/food/fried-rice-mound.png'),
    image('assets/frying-prototype/food/rice.png'),
    image('assets/frying-prototype/pouring-hand-bowl.png'),
    image('assets/frying-prototype/food/fried-rice-ingredients-v2.png'),
    image('assets/frying-prototype/wooden-spatula.png')
  ]).then(([engineModule,content,background,pan,leftHand,mound,rice,bowlHand,ingredientAtlas,spatula])=>{
    const flippedPan=document.createElement('canvas');flippedPan.width=pan.width;flippedPan.height=pan.height;
    const ctx=flippedPan.getContext('2d');ctx.translate(pan.width,0);ctx.scale(-1,1);ctx.drawImage(pan,0,0);flippedPan.complete=true;
    const materials={...content.INGREDIENT_MATERIALS,
      carrot:{...content.INGREDIENT_MATERIALS.carrot,size:[36,34]},
      onion:{...content.INGREDIENT_MATERIALS.onion,size:[35,33]},
      pepper:{...content.INGREDIENT_MATERIALS.pepper,size:[35,33]},
      meat:{...content.INGREDIENT_MATERIALS.meat,size:[36,34]}
    };
    const ingredientSprites=Object.fromEntries(['carrot','onion','pepper','meat'].map((type,index)=>[type,{image:ingredientAtlas,index,columns:2,rows:2,inset:.16}]));
    return{FryingEngine:engineModule.FryingEngine,materials,ingredientSprites,background,pan:flippedPan,leftHand,mound,rice,bowlHand,spatula};
  });
  return friedRiceAssetsPromise;
}

class FriedRicePanScene{
  constructor(canvas,step,state){
    state=state||{pieces:[],pan:null,pending:[],riceBase:false,pendingToss:false};
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.step=step;this.state=state;
    this.time=0;this.pour=0;this.stirPulse=0;this.pointerX=0;this.disposed=false;
    this.isFlipping=false;this.flipElapsed=0;this.requiredFlips=step.requiredFlips||3;this.flipCount=0;this.onFlipComplete=null;this.stirVideo=null;this.stirVideoReady=false;
    if(step.action==='TOSS'){state.flipCount=0;state.pendingToss=false}
    if(step.stirVideo)this.createStirVideo(step.stirVideo);
    if(step.action==='STIR'&&!state.riceBase){state.riceBase=true;state.pending.push(['rice',58])}
    this.ready=loadFriedRiceAssets().then(assets=>{
      if(this.disposed)return;
      this.assets=assets;
      const engineAssets={background:assets.background,pan:assets.pan,leftHand:assets.leftHand,rightHand:null,foodImages:{mound:assets.mound,ingredients:{rice:assets.rice,...assets.ingredientSprites}}};
      // Keep each piece inside the inner cooking surface, with room for its full sprite at the rim.
      this.engine=new assets.FryingEngine(this.canvas,engineAssets,{ingredients:[]},{materials:assets.materials,showMound:state.riceBase,foodRadius:{x:205,y:68},foodClip:{x:235,y:88},moundSize:{width:480,height:200}});
      this.engine.pieces=state.pieces;this.engine.pan=state.pan||this.engine.pan;
      if(step.action==='TOSS')this.engine.onToss=()=>{if(!this.isFlipping){this.isFlipping=true;this.flipElapsed=0}};
      this.engine.showMound=state.riceBase;
      for(const [ingredient,count] of state.pending)this.engine.addIngredient(ingredient,count);
      state.pending.length=0;state.pieces=this.engine.pieces;state.pan=this.engine.pan;
      this.render();
    });
  }
  dispose(){this.disposed=true;if(this.stirVideo){this.stirVideo.pause();this.stirVideo.remove()}if(this.engine){this.state.pieces=this.engine.pieces;this.state.pan=this.engine.pan}}
  createStirVideo(path){
    const scene=this.canvas.parentElement;if(!scene)return;
    if(getComputedStyle(scene).position==='static')scene.style.position='relative';
    const video=document.createElement('video');this.stirVideo=video;video.className='rice-stir-reference-video';video.setAttribute('aria-label','볶음밥을 주걱으로 볶는 참고 영상');video.muted=true;video.defaultMuted=true;video.playsInline=true;video.setAttribute('playsinline','');video.preload='auto';video.loop=false;video.controls=false;
    Object.assign(video.style,{position:'absolute',inset:'0',zIndex:'3',width:'100%',height:'100%',objectFit:'cover',opacity:'0',transition:'none',pointerEvents:'none'});
    video.addEventListener('loadeddata',()=>{if(this.disposed)return;this.stirVideoReady=true;video.pause();video.style.opacity='1';video.style.visibility='visible'});
    video.addEventListener('ended',()=>{if(this.disposed)return;video.pause();video.currentTime=0});
    video.addEventListener('error',()=>{video.style.display='none'});
    video.src=path;scene.append(video);video.load();
  }
  playStirVideo(){
    const video=this.stirVideo;if(!video||!this.stirVideoReady)return;
    if(!video.paused)return;
    video.currentTime=0;video.style.opacity='1';video.style.visibility='visible';video.play().catch(()=>{});
  }
  addIngredient(ingredient){
    this.pour=1;
    const count=ingredient==='meat'?24:32;
    if(this.engine)this.engine.addIngredient(ingredient,count);
    else this.state.pending.push([ingredient,count]);
  }
  stir(){
    this.stirPulse=1;
    this.playStirVideo();
    if(!this.engine)return;
    for(const piece of this.engine.pieces){const x=piece.localX,y=piece.localY;piece.vx+=-y*.9+32;piece.vy+=x*.22-9}
    this.engine.pan.targetX=17;this.engine.pan.targetY=-7;
  }
  get canFlip(){return !this.isFlipping&&(!this.engine||this.engine.cooldown<=0)&&!this.state.pendingToss}
  toss(){
    if(!this.canFlip)return false;
    if(!this.engine){this.state.pendingToss=true;return true}
    this.isFlipping=true;this.flipElapsed=0;this.engine.launch(1.02,0,-920);return true;
  }
  hesitate(){this.stirPulse=Math.max(this.stirPulse,.2)}
  beginDrag(point,time){this.engine?.beginDrag(point.x,point.y,time)}
  moveDrag(point,time){this.engine?.moveDrag(point.x,point.y,time)}
  endDrag(){this.engine?.endDrag()}
  movePointer(point){this.pointerX=Math.max(-20,Math.min(20,(point.x-640)*.06))}
  stirDrag(dx,dy){if(!this.engine)return;for(const piece of this.engine.pieces){piece.vx-=dy*.2;piece.vy+=dx*.12}this.stirPulse=Math.max(this.stirPulse,.35)}
  update(dt){
    this.time+=dt;this.pour=Math.max(0,this.pour-dt*1.5);this.stirPulse=Math.max(0,this.stirPulse-dt*1.6);
    if(!this.engine)return;
    if(this.step.action==='STIR'&&this.engine.pan.targetX>0){this.engine.pan.targetX*=Math.exp(-8*dt);this.engine.pan.targetY*=Math.exp(-8*dt)}
    this.engine.showMound=this.state.riceBase;this.engine.update(dt);
    if(this.state.pendingToss){this.state.pendingToss=false;this.isFlipping=true;this.flipElapsed=0;this.engine.launch(1.02,0,-920)}
    if(this.step.action==='TOSS'&&this.isFlipping){
      this.flipElapsed+=dt;
      const landed=this.engine.pieces.length&&this.engine.pieces.every(piece=>piece.state==='ground');
      if(landed||this.flipElapsed>=2.4){
        if(!landed)for(const piece of this.engine.pieces){piece.state='ground';piece.z=piece.vz=piece.vx=piece.vy=piece.spin=0}
        this.isFlipping=false;this.flipCount=Math.min(this.requiredFlips,(this.state.flipCount||0)+1);this.state.flipCount=this.flipCount;this.onFlipComplete?.(this.flipCount);
      }
    }
  }
  render(){
    if(!this.engine){const c=this.ctx;c.fillStyle='#e3bb82';c.fillRect(0,0,1280,720);c.fillStyle='#b94731';c.beginPath();c.ellipse(640,430,355,150,0,0,Math.PI*2);c.fill();return}
    this.engine.render();
    if(this.step.action==='ADD')this.renderBowl();
    if(this.step.action==='STIR')this.renderSpatula();
  }
  renderBowl(){
    const c=this.ctx,a=this.assets,bob=Math.sin(this.time*3)*2;
    c.save();c.translate(this.pointerX,-this.pour*14+bob);c.translate(952,252);c.rotate(-this.pour*.11);c.translate(-952,-252);
    c.drawImage(a.bowlHand,775,16,500,404);
    const sprite=a.ingredientSprites[this.step.ingredient];
    c.save();c.beginPath();c.ellipse(877,301,53,26,-.46,0,Math.PI*2);c.clip();
    const amount=this.pour>0?14:30;
    for(let i=0;i<amount;i++){
      const x=837+(i*37%75),y=280+(i*23%36),size=11+(i%3)*2;
      const cell=sprite.image.width/2,inset=cell*sprite.inset;
      c.drawImage(sprite.image,(sprite.index%2)*cell+inset,Math.floor(sprite.index/2)*cell+inset,cell-inset*2,cell-inset*2,x,y,size,size);
    }
    c.restore();c.restore();
  }
  renderSpatula(){
    const c=this.ctx,swing=Math.sin(this.time*9)*this.stirPulse;
    c.save();c.translate(620,440);c.rotate(swing*.13);c.translate(-620,-440);
    c.drawImage(this.assets.spatula,400,190,530,350);c.restore();
  }
}
window.FriedRicePanScene=FriedRicePanScene;
