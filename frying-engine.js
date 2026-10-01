// Shared pan control, particle motion, and rendering. Recipe data and food images are external.
const WIDTH=1280,HEIGHT=720,CENTER_X=640,CENTER_Y=419;
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const smooth=(current,target,rate,dt)=>current+(target-current)*(1-Math.exp(-rate*dt));
function randomGenerator(seed){let value=seed>>>0;return()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296}}

export class FryingEngine{
  constructor(canvas,assets,recipe,options={}){
    if(!recipe)throw Error('A frying recipe is required');
    this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:false});this.assets=assets;this.recipe=recipe;
    this.materials=options.materials||{};this.showMound=options.showMound!==false;
    this.foodRadius=options.foodRadius||{x:176,y:75};
    this.foodClip=options.foodClip||{x:184,y:85};
    this.moundSize=options.moundSize||{width:360,height:160};
    this.setFoodImages(assets.foodImages);
    this.pan={x:0,y:0,vx:0,vy:0,ax:0,ay:0,tilt:0,scale:1,targetX:0,targetY:0};
    this.drag=null;this.speed=0;this.tosses=0;this.cooldown=0;this.lastToss=0;this.onToss=null;
    this.resetFood();
  }
  setFoodImages(foodImages){
    if(!foodImages)throw Error('Food image configuration is required');
    this.foodImages=foodImages;
  }
  resetFood(){
    const random=randomGenerator(2597);this.pieces=[];
    for(const ingredient of this.recipe.ingredients){
      if(!this.materials[ingredient.type])throw Error(`Unknown ingredient: ${ingredient.type}`);
      const material={...this.materials[ingredient.type],...ingredient.physics};
      for(let index=0;index<ingredient.count;index++){
        const radius=Math.sqrt(random())*(ingredient.spread??.91),angle=random()*Math.PI*2;
        const localX=Math.cos(angle)*this.foodRadius.x*.92*radius,localY=Math.sin(angle)*this.foodRadius.y*.88*radius;
        this.pieces.push({type:ingredient.type,material,frames:ingredient.frames??4,variant:Math.floor(random()*(ingredient.frames??4)),localX,localY,
          x:0,y:0,z:0,vx:0,vy:0,vz:0,rotation:(random()-.5)*.5,spin:0,
          size:.78+random()*.48,seed:random(),state:'ground',bounces:0,followX:0,followY:0});
      }
    }
    this.tosses=0;this.cooldown=0;
  }
  addIngredient(type,count=28){
    const material=this.materials[type];if(!material)throw Error(`Unknown ingredient: ${type}`);
    const random=randomGenerator(5103+this.pieces.length*97);
    for(let index=0;index<count;index++){
      const angle=random()*Math.PI*2,radius=Math.sqrt(random());
      const localX=Math.cos(angle)*this.foodRadius.x*.87*radius,localY=Math.sin(angle)*this.foodRadius.y*.81*radius;
      this.pieces.push({type,material,frames:1,variant:0,localX,localY,
        x:CENTER_X+105+random()*48,y:CENTER_Y-88-random()*30,z:64+random()*54,
        vx:-110-random()*95,vy:40+random()*35,vz:20+random()*90,
        rotation:(random()-.5)*.5,spin:(random()-.5)*5,size:.7+random()*.42,seed:random(),state:'air',bounces:0,followX:0,followY:0});
    }
  }
  beginDrag(x,y,time){this.drag={x,y,lastX:x,lastY:y,lastTime:time,pulled:false};this.pan.targetX=this.pan.x;this.pan.targetY=this.pan.y}
  moveDrag(x,y,time){
    if(!this.drag)return;
    const deltaTime=clamp((time-this.drag.lastTime)/1000,.008,.08);
    const inputVx=(x-this.drag.lastX)/deltaTime,inputVy=(y-this.drag.lastY)/deltaTime;
    const speed=Math.hypot(inputVx,inputVy);this.speed=smooth(this.speed,speed,13,deltaTime);
    this.pan.targetX=clamp((x-this.drag.x)*.68,-76,76);
    this.pan.targetY=clamp((y-this.drag.y)*.68,-68,72);
    if(this.pan.targetY>12)this.drag.pulled=true;
    for(const piece of this.pieces){if(piece.state!=='ground')continue;
      const delay=piece.material.followDelay;
      piece.vx-=inputVx*delay*1.2;
      piece.vy-=inputVy*delay*1.6;
    }
    if(inputVy<-(this.drag.pulled?560:920)&&speed>620&&this.cooldown<=0){
      const power=clamp(.86+(speed-620)/1550,.86,1.42);
      this.launch(power,inputVx,inputVy);
      this.drag.pulled=false;
    }
    this.drag.lastX=x;this.drag.lastY=y;this.drag.lastTime=time;
  }
  endDrag(){this.drag=null;this.pan.targetX=0;this.pan.targetY=0}
  launch(power,inputVx,inputVy){
    const random=randomGenerator((Math.round(performance.now())+this.tosses*701)>>>0);
    const panX=CENTER_X+this.pan.x,panY=CENTER_Y+this.pan.y;
    for(const piece of this.pieces){if(piece.state!=='ground')continue;
      const material=piece.material;
      piece.state='air';piece.bounces=0;
      piece.x=panX+piece.localX;piece.y=panY+piece.localY;piece.z=0;
      piece.vx=this.pan.vx*.16+inputVx*.035+(random()-.5)*material.scatterAmount*2.3*power;
      piece.vy=Math.min(-28,inputVy*.08)+(random()-.5)*material.scatterAmount*.8;
      piece.vz=(545+(random()-.5)*(material.liftVariation??88))*power*material.tossStrength;
      piece.spin=(random()-.5)*2*material.rotationSpeed*material.rotationAmount;
    }
    this.cooldown=1.05;this.tosses++;this.lastToss=performance.now();this.onToss?.(this.tosses);
  }
  update(dt){
    dt=clamp(dt,0,.033);this.cooldown=Math.max(0,this.cooldown-dt);
    this.speed*=Math.exp(-3.8*dt);
    const pan=this.pan,oldVx=pan.vx,oldVy=pan.vy,oldX=pan.x,oldY=pan.y;
    pan.x=smooth(pan.x,pan.targetX,this.drag?16:8,dt);pan.y=smooth(pan.y,pan.targetY,this.drag?16:8,dt);
    pan.vx=(pan.x-oldX)/Math.max(dt,.001);pan.vy=(pan.y-oldY)/Math.max(dt,.001);
    pan.ax=clamp((pan.vx-oldVx)/Math.max(dt,.001),-12000,12000);
    pan.ay=clamp((pan.vy-oldVy)/Math.max(dt,.001),-12000,12000);
    pan.tilt=smooth(pan.tilt,clamp(-pan.vy*.00016+pan.x*.00045,-.11,.11),12,dt);
    pan.scale=smooth(pan.scale,clamp(1+pan.y*.0009,.94,1.07),10,dt);
    for(const piece of this.pieces){
      const material=piece.material;
      if(piece.state==='ground'){
        const inertia=1/(.7+material.mass);
        piece.vx-=pan.ax*.007*inertia*dt;piece.vy-=pan.ay*.01*inertia*dt;
        const friction=Math.exp(-material.friction*dt);piece.vx*=friction;piece.vy*=friction;
        piece.localX+=piece.vx*dt;piece.localY+=piece.vy*dt;
        const radius=Math.hypot(piece.localX/this.foodRadius.x,piece.localY/this.foodRadius.y);
        if(radius>1){piece.localX/=radius;piece.localY/=radius;piece.vx*=-.25;piece.vy*=-.25}
      }else{
        const drag=Math.exp(-material.drag*dt);
        piece.vx*=drag;piece.vy*=drag;piece.x+=piece.vx*dt;piece.y+=piece.vy*dt;
        piece.vz-=material.gravity*dt;piece.z+=piece.vz*dt;
        piece.rotation+=piece.spin*dt;
        if(piece.vz<0){
          const catchRate=3.2+2.8*(1-clamp(piece.z/180,0,1));
          piece.x=smooth(piece.x,CENTER_X+pan.x+piece.localX*.88,catchRate,dt);
          piece.y=smooth(piece.y,CENTER_Y+pan.y+piece.localY*.88,catchRate,dt);
        }
        if(piece.z<=0){
          piece.z=0;
          if(piece.bounces===0&&-piece.vz*material.bounce>45){
            piece.vz=-piece.vz*material.bounce;piece.vx*=.48;piece.vy*=.48;piece.spin*=.35;piece.bounces=1;
          }else{
            piece.state='ground';piece.localX=(piece.x-(CENTER_X+pan.x))*.55+piece.localX*.45;piece.localY=(piece.y-(CENTER_Y+pan.y))*.55+piece.localY*.45;
            const radius=Math.max(1,Math.hypot(piece.localX/(this.foodRadius.x*.97),piece.localY/(this.foodRadius.y*.93)));
            piece.localX/=radius;piece.localY/=radius;piece.vx*=.15;piece.vy*=.15;
            piece.rotation=clamp(piece.rotation,-.7,.7);
          }
        }
      }
    }
  }
  panTransform(ctx){ctx.translate(CENTER_X+this.pan.x,CENTER_Y+this.pan.y);ctx.rotate(this.pan.tilt);ctx.scale(this.pan.scale,this.pan.scale);ctx.translate(-CENTER_X,-CENTER_Y)}
  drawPiece(ctx,piece,x,y,airborne=false){
    const material=piece.material,sprite=this.foodImages.ingredients[piece.type];
    const scale=piece.size*(airborne?1+Math.min(piece.z/800,.18):1);
    const w=material.size[0]*scale,h=material.size[1]*scale;
    ctx.save();ctx.translate(x,y);ctx.rotate(piece.rotation);
    if(sprite?.image?.naturalWidth){
      const source=sprite.image,columns=sprite.columns||1,rows=sprite.rows||1;
      const cellW=source.width/columns,cellH=source.height/rows,index=sprite.index||0;
      const inset=sprite.inset||0,sw=cellW*(1-inset*2),sh=cellH*(1-inset*2);
      ctx.drawImage(source,(index%columns+inset)*cellW,(Math.floor(index/columns)+inset)*cellH,sw,sh,-w/2,-h/2,w,h);
    }
    else if(sprite?.naturalWidth){const frameWidth=sprite.width/piece.frames;ctx.drawImage(sprite,piece.variant*frameWidth,0,frameWidth,sprite.height,-w/2,-h/2,w,h)}
    else{ctx.shadowColor='#5b38275a';ctx.shadowBlur=3;ctx.shadowOffsetY=2;ctx.fillStyle=material.color||'#ecbc77';ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,Math.min(5,w*.22));ctx.fill();ctx.shadowColor='transparent';ctx.fillStyle='#fff4c066';ctx.fillRect(-w*.35,-h*.33,w*.55,Math.max(2,h*.2))}
    ctx.restore();
  }
  render(){
    const c=this.ctx;c.clearRect(0,0,WIDTH,HEIGHT);
    if(this.assets.background.complete)c.drawImage(this.assets.background,0,0,WIDTH,HEIGHT);
    else{c.fillStyle='#dfb781';c.fillRect(0,0,WIDTH,HEIGHT)}
    c.save();c.translate(this.pan.x*.45,this.pan.y*.35);c.fillStyle='#261e2560';c.filter='blur(22px)';c.beginPath();c.ellipse(638,550,253,83,0,0,Math.PI*2);c.fill();c.restore();
    c.save();this.panTransform(c);
    if(this.assets.pan.complete)c.drawImage(this.assets.pan,175,160,970,546);
    c.save();c.beginPath();c.ellipse(CENTER_X,CENTER_Y-3,this.foodClip.x,this.foodClip.y,0,0,Math.PI*2);c.clip();
    const groundedPieces=this.pieces.filter(piece=>piece.state==='ground');
    const moundVisible=this.showMound&&this.foodImages.mound?.naturalWidth&&groundedPieces.length>0;
    for(let i=0;i<groundedPieces.length;i++){
      if(moundVisible&&i%3===0)continue;
      const piece=groundedPieces[i];this.drawPiece(c,piece,CENTER_X+piece.localX,CENTER_Y+piece.localY);
    }
    if(moundVisible){
      c.save();c.globalAlpha=Math.pow(groundedPieces.length/this.pieces.length,.6)*.93;
      c.drawImage(this.foodImages.mound,CENTER_X-this.moundSize.width/2,CENTER_Y-this.moundSize.height/2,this.moundSize.width,this.moundSize.height);c.restore();
      for(let i=0;i<groundedPieces.length;i+=3){
        const piece=groundedPieces[i];this.drawPiece(c,piece,CENTER_X+piece.localX,CENTER_Y+piece.localY);
      }
    }
    c.restore();c.restore();
    let airborne=0,averageZ=0;
    for(const piece of this.pieces)if(piece.state!=='ground'){airborne++;averageZ+=piece.z}
    if(airborne){
      averageZ/=airborne;c.save();c.fillStyle=`rgba(41,30,26,${clamp(airborne/this.pieces.length*.26,0,.26)})`;c.filter='blur(15px)';c.beginPath();c.ellipse(CENTER_X+this.pan.x,CENTER_Y+this.pan.y+2,clamp(170-averageZ*.35,75,170),clamp(65-averageZ*.15,30,65),0,0,Math.PI*2);c.fill();c.restore();
      const flying=this.pieces.filter(piece=>piece.state!=='ground').sort((a,b)=>(a.y-a.z)-(b.y-b.z));
      for(const piece of flying)this.drawPiece(c,piece,piece.x,piece.y-piece.z,true);
    }
    c.save();this.panTransform(c);
    if(this.assets.rightHand?.complete)c.drawImage(this.assets.rightHand,650,478,635,357);
    c.restore();
    if(this.assets.leftHand?.complete)c.drawImage(this.assets.leftHand,385+this.pan.x*.10,590+this.pan.y*.07,382,215);
  }
}
