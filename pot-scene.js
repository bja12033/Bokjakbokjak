/* Shared Canvas renderer for food suspended in a moving pot liquid.
   Recipes opt in with parameters; the first user is curry. */
const POT_SCENE_PRESETS={
  curry:{
    liquidColor:{deep:'#884715',body:'#c47a29',light:'#f2b651',edge:'#713813'},
    preSauceColor:{deep:'#78502d',body:'#b78242',light:'#e7b969',edge:'#674021'},
    liquidViscosity:.88,
    ingredientSprites:[
      {name:'potato',count:5,size:[53,69],colors:['#b87925','#e7ac4d','#ffe09a'],mass:1.15},
      {name:'carrot',count:5,size:[36,49],colors:['#a94a15','#ec7522','#ffb04a'],mass:.83},
      {name:'onion',count:5,size:[44,58],colors:['#aa7941','#e2ba75','#fbe6aa'],mass:.68}
    ],
    bubbleAmount:18,steamAmount:7,stirResistance:.8
  }
};

const potLimit=(value,min,max)=>Math.max(min,Math.min(max,value));
const potRandom=seed=>{let value=seed>>>0;return()=>((value=Math.imul(value,1664525)+1013904223>>>0)/4294967296)};
const potBlendHex=(from,to,amount)=>{
  const a=parseInt(from.slice(1),16),b=parseInt(to.slice(1),16);
  const channel=shift=>Math.round(((a>>shift)&255)*(1-amount)+((b>>shift)&255)*amount).toString(16).padStart(2,'0');
  return `#${channel(16)}${channel(8)}${channel(0)}`;
};

class PotScene{
  constructor(config){
    this.config=config;this.time=0;this.action='FRY';this.progress=0;
    this.center={x:640,y:395};this.radius={x:200,y:90};
    this.cols=11;this.rows=7;this.field=Array.from({length:this.cols*this.rows},()=>({x:0,y:0,vx:0,vy:0}));
    this.wake=[];this.spoon={x:646,y:395,targetX:646,targetY:395,energy:0};
    const random=potRandom(50319);this.random=random;this.ingredients=[];
    for(const type of config.ingredientSprites){
      for(let i=0;i<type.count;i++){
        const angle=random()*Math.PI*2,radius=Math.sqrt(random())*.97;
        this.ingredients.push({type,x:Math.cos(angle)*radius*184,y:Math.sin(angle)*radius*77,
          vx:0,vy:0,driveX:0,driveY:0,pendingX:0,pendingY:0,phase:random()*Math.PI*2,rotation:(random()-.5)*.34,
          size:type.size[0]+random()*(type.size[1]-type.size[0]),submerge:.19+random()*.25,
          delay:.38+random()*.55,seed:random()});
      }
    }
    this.bubbles=Array.from({length:config.bubbleAmount},()=>this.newBubble(random()*2.5));
    this.steam=Array.from({length:config.steamAmount},(_,i)=>this.newSteam(random()*2.4,i));
  }
  newBubble(age=0){const r=this.random,angle=r()*Math.PI*2,radius=Math.sqrt(r())*.88;
    return{x:Math.cos(angle)*radius*181,y:Math.sin(angle)*radius*74,age,life:.7+r()*1.8,size:2.5+r()*4.5,drift:(r()-.5)*9};}
  newSteam(age=0,index=0){const r=this.random;return{x:530+r()*220,y:344+r()*30,age,life:1.4+r()*1.7,drift:(r()-.5)*27,width:7+r()*8,index};}
  setPhase(action,progress){this.action=action;this.progress=potLimit(progress,0,1)}
  touch(point,previous,strength=1){
    const x=potLimit(point.x,465,815),y=potLimit(point.y,320,472);
    const dx=potLimit(x-previous.x,-44,44),dy=potLimit(y-previous.y,-34,34);
    const force=Math.min(1,Math.hypot(dx,dy)/24)*strength;
    this.spoon.targetX=x;this.spoon.targetY=y;this.spoon.energy=Math.max(this.spoon.energy,force);
    if(force>.04){this.wake.push({x:x-dx*.55,y:y-dy*.55,dx,dy,strength:force,age:0});if(this.wake.length>28)this.wake.shift()}
    const resistance=this.config.stirResistance;
    for(const piece of this.ingredients){
      const px=this.center.x+piece.x,py=this.center.y+piece.y;
      const distance=Math.hypot((px-x)*.8,(py-y)*1.6);
      const influence=Math.exp(-distance*distance/(90*90));
      const tangentX=-(py-this.center.y)*.42,tangentY=(px-this.center.x)*.13;
      piece.pendingX=potLimit(piece.pendingX+(dx*5.5+tangentX*force)*influence/resistance,-240,240);
      piece.pendingY=potLimit(piece.pendingY+(dy*4.4+tangentY*force)*influence/resistance,-190,190);
    }
    for(let row=0;row<this.rows;row++)for(let col=0;col<this.cols;col++){
      const node=this.field[row*this.cols+col],nx=484+col*31.2,ny=320+row*25;
      const distance=Math.hypot((nx-x)*.85,(ny-y)*1.3),influence=Math.exp(-distance*distance/(92*92));
      node.vx+=dx*13*influence*force/resistance;
      node.vy+=dy*8*influence*force/resistance;
    }
  }
  pulse(){
    const t=this.time*3.7,x=640+Math.cos(t)*95,y=395+Math.sin(t)*36;
    this.touch({x,y},{x:x-27*Math.sin(t),y:y+15*Math.cos(t)},.9);
  }
  update(dt){
    dt=potLimit(dt,0,.04);this.time+=dt;
    const viscosity=this.config.liquidViscosity;
    const next=this.field.map((node,index)=>{
      const col=index%this.cols,row=Math.floor(index/this.cols);
      let sumX=0,sumY=0,count=0;
      for(const neighbor of [col>0?index-1:-1,col<this.cols-1?index+1:-1,row>0?index-this.cols:-1,row<this.rows-1?index+this.cols:-1]){
        if(neighbor<0)continue;sumX+=this.field[neighbor].x;sumY+=this.field[neighbor].y;count++;
      }
      const ax=(sumX/count-node.x)*25-node.x*(8-3*viscosity);
      const simmer=this.action==='STIR'?1:this.action==='POUR'?.4:.2;
      const ay=(sumY/count-node.y)*25-node.y*(9-3*viscosity)+Math.sin(this.time*2.4+col*.81+row*1.37)*5*simmer;
      return{vx:(node.vx+ax*dt)*Math.exp(-(5-2*viscosity)*dt),vy:(node.vy+ay*dt)*Math.exp(-(5-2*viscosity)*dt)};
    });
    this.field.forEach((node,i)=>{node.vx=next[i].vx;node.vy=next[i].vy;node.x=potLimit(node.x+node.vx*dt,-24,24);node.y=potLimit(node.y+node.vy*dt,-16,16)});
    for(const piece of this.ingredients){
      const flow=this.sample(piece.x,piece.y);
      const response=1-Math.exp(-dt*(2.8-piece.delay*1.7));
      piece.driveX+=(piece.pendingX-piece.driveX)*response;
      piece.driveY+=(piece.pendingY-piece.driveY)*response;
      piece.pendingX*=Math.exp(-dt*5.8);piece.pendingY*=Math.exp(-dt*5.8);
      piece.vx+=(piece.driveX*6+flow.x*3.2-piece.vx*.8)*dt;
      piece.vy+=(piece.driveY*6+flow.y*2.7-piece.vy*.8)*dt;
      piece.vx*=Math.exp(-(1.3+piece.type.mass*.4)*dt);
      piece.vy*=Math.exp(-(1.5+piece.type.mass*.4)*dt);
      piece.vx=potLimit(piece.vx,-125,125);piece.vy=potLimit(piece.vy,-90,90);
      piece.x+=piece.vx*dt;piece.y+=piece.vy*dt;
      const boundary=Math.hypot(piece.x/183,piece.y/77);
      if(boundary>1){piece.x/=boundary;piece.y/=boundary;piece.vx*=-.28;piece.vy*=-.28}
      piece.rotation+=piece.vx*dt*.006;
    }
    for(const wake of this.wake)wake.age+=dt;
    this.wake=this.wake.filter(wake=>wake.age<1.15+viscosity*.65);
    for(let i=0;i<this.bubbles.length;i++){
      const bubble=this.bubbles[i];bubble.age+=dt;bubble.x+=bubble.drift*dt;
      if(bubble.age>bubble.life)this.bubbles[i]=this.newBubble();
    }
    for(let i=0;i<this.steam.length;i++){
      const plume=this.steam[i];plume.age+=dt;
      if(plume.age>plume.life)this.steam[i]=this.newSteam(0,i);
    }
    this.spoon.energy*=Math.exp(-dt*2.8);
    this.spoon.x+=(this.spoon.targetX-this.spoon.x)*(1-Math.exp(-dt*10));
    this.spoon.y+=(this.spoon.targetY-this.spoon.y)*(1-Math.exp(-dt*10));
  }
  sample(x,y){
    const gx=potLimit((x+156)/31.2,0,this.cols-1.001),gy=potLimit((y+75)/25,0,this.rows-1.001);
    const col=Math.floor(gx),row=Math.floor(gy),fx=gx-col,fy=gy-row;
    const a=this.field[row*this.cols+col],b=this.field[row*this.cols+col+1];
    const d=this.field[(row+1)*this.cols+col],e=this.field[(row+1)*this.cols+col+1];
    return{x:(a.x*(1-fx)+b.x*fx)*(1-fy)+(d.x*(1-fx)+e.x*fx)*fy,
      y:(a.y*(1-fx)+b.y*fx)*(1-fy)+(d.y*(1-fx)+e.y*fx)*fy};
  }
  sauceAmount(){return this.action==='FRY'?.28:this.action==='POUR'?.28+this.progress*.72:1}
  contour(c,rx,ry,offsetY=0){
    c.beginPath();
    for(let i=0;i<=64;i++){
      const a=i/64*Math.PI*2,px=Math.cos(a)*rx,py=Math.sin(a)*ry;
      const motion=this.sample(px,py),small=Math.sin(a*7+this.time*2.1)*3.2+Math.sin(a*11-this.time*1.2)*2.1;
      const x=this.center.x+px+motion.x*.43+Math.cos(a)*small;
      const y=this.center.y+offsetY+py+motion.y*.36+Math.sin(a)*small*.6;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.closePath();
  }
  draw(c){
    const amount=this.sauceAmount(),mix=potLimit((amount-.25)/.75,0,1);
    const colors=Object.fromEntries(Object.keys(this.config.liquidColor).map(key=>[key,potBlendHex(this.config.preSauceColor[key],this.config.liquidColor[key],mix)]));
    c.save();
    // The lower dark lip and two rolling contours give the sauce visible depth.
    this.contour(c,201,92,25);c.fillStyle=colors.edge;c.fill();
    this.contour(c,198,89,8);c.fillStyle=colors.deep;c.fill();
    const base=c.createRadialGradient(615,366,15,640,402,195);
    base.addColorStop(0,colors.light);base.addColorStop(.45,colors.body);base.addColorStop(1,colors.deep);
    this.contour(c,195,86,-3);c.fillStyle=base;c.fill();
    c.save();this.contour(c,195,86,-3);c.clip();
    // Broad sauce bulges and curved folds make one continuous, deforming surface.
    for(let i=0;i<10;i++){
      const angle=i*2.399,radius=Math.sqrt((i+.5)/10),px=Math.cos(angle)*radius*151,py=Math.sin(angle)*radius*61;
      const motion=this.sample(px,py),x=this.center.x+px+motion.x*.55,y=this.center.y+py+motion.y*.5;
      const width=29+(i%3)*12,shine=c.createRadialGradient(x-7,y-6,2,x,y,width);
      shine.addColorStop(0,i%3?'#f8c97958':'#713c1a40');shine.addColorStop(1,'#a45e2200');
      c.fillStyle=shine;c.beginPath();c.ellipse(x,y,width,width*.48,i*.37,0,Math.PI*2);c.fill();
    }
    for(let fold=0;fold<7;fold++){
      const x=-145+fold*48,y=(fold%3-1)*31,m=this.sample(x,y);
      const startX=this.center.x+x+m.x*.6,startY=this.center.y+y+m.y*.55;
      c.beginPath();c.moveTo(startX-26,startY+4);
      c.bezierCurveTo(startX-9,startY-10,startX+17,startY+13,startX+43,startY-6);
      c.strokeStyle=fold%2?'#ffcf8050':'#6f381b45';c.lineWidth=8+fold%3*3;c.lineCap='round';c.stroke();
    }
    this.drawWake(c,mix);
    this.ingredients.sort((a,b)=>a.y-b.y).forEach(piece=>this.drawIngredient(c,piece,colors));
    this.drawBubbles(c,amount);
    this.drawFrontRidge(c,mix);
    c.restore();
    c.strokeStyle='#f4c16e66';c.lineWidth=2.5;this.contour(c,192,84,-3);c.stroke();
    c.restore();
  }
  drawWake(c,mix){
    for(const wake of this.wake){
      const life=1-wake.age/(1.15+this.config.liquidViscosity*.65);
      const direction=Math.atan2(wake.dy,wake.dx);
      c.save();c.translate(wake.x,wake.y);c.rotate(direction);
      c.globalAlpha=life*life*wake.strength*(.4+mix*.18);
      c.fillStyle='#683412';c.beginPath();c.ellipse(-11,0,Math.min(30,13+Math.hypot(wake.dx,wake.dy)*.32),11+7*life,0,0,Math.PI*2);c.fill();
      c.strokeStyle='#ffd17b';c.lineWidth=4+life*5;c.lineCap='round';
      for(const side of [-1,1]){c.beginPath();c.moveTo(-29,side*11);c.quadraticCurveTo(-8,side*(18+life*5),12,side*13);c.stroke()}
      c.restore();
    }
  }
  drawFrontRidge(c,mix){
    c.beginPath();
    for(let i=0;i<=40;i++){
      const a=i/40*Math.PI,px=Math.cos(a)*190,py=Math.sin(a)*83;
      const motion=this.sample(px,py),x=this.center.x+px+motion.x*.45;
      const y=this.center.y-3+py+motion.y*.36+Math.sin(a*9+this.time*1.2)*2.5;
      if(i===0)c.moveTo(x,y);else c.lineTo(x,y);
    }
    c.strokeStyle=mix>.4?'#8a4a1aaa':'#8b5a30aa';c.lineWidth=15;c.lineCap='round';c.stroke();
    c.strokeStyle='#f5b65d99';c.lineWidth=3;c.stroke();
  }
  drawIngredient(c,piece,sauce){
    const bob=Math.sin(this.time*2.3+piece.phase)*1.6;
    const x=this.center.x+piece.x,y=this.center.y+piece.y+bob;
    const s=piece.size,depth=s*(.37+piece.submerge*.45),colors=piece.type.colors;
    c.save();c.translate(x,y);c.rotate(piece.rotation);
    c.fillStyle=sauce.deep+'aa';c.beginPath();c.ellipse(0,s*.22,s*.78,s*.29,0,0,Math.PI*2);c.fill();
    c.shadowColor='#4e260d66';c.shadowBlur=7;c.shadowOffsetY=5;
    if(piece.type.name==='onion'){
      c.fillStyle=colors[0];c.beginPath();c.moveTo(-s*.56,-s*.15);
      c.bezierCurveTo(-s*.35,-s*.56,s*.33,-s*.6,s*.57,-s*.16);
      c.bezierCurveTo(s*.39,s*.1,s*.21,s*.22,s*.06,s*.24);
      c.bezierCurveTo(s*.37,-s*.18,-s*.23,-s*.31,-s*.37,s*.18);
      c.bezierCurveTo(-s*.53,s*.08,-s*.58,-s*.03,-s*.56,-s*.15);c.fill();
      c.shadowColor='transparent';c.strokeStyle=colors[2];c.lineWidth=s*.11;c.lineCap='round';
      c.beginPath();c.moveTo(-s*.49,-s*.13);c.bezierCurveTo(-s*.24,-s*.49,s*.29,-s*.44,s*.47,-s*.16);c.stroke();
      c.globalAlpha=.78;c.fillStyle=sauce.body;c.beginPath();c.ellipse(0,s*.23,s*.58,s*.12,0,0,Math.PI*2);c.fill();
      c.restore();return;
    }
    c.fillStyle=colors[0];c.beginPath();c.moveTo(-s*.55,-s*.25);c.lineTo(-s*.38,-s*.53);c.lineTo(s*.32,-s*.48);c.lineTo(s*.58,-s*.15);c.lineTo(s*.5,depth);c.lineTo(-s*.42,depth*.86);c.closePath();c.fill();
    c.shadowColor='transparent';
    c.fillStyle=colors[1];c.beginPath();c.moveTo(-s*.55,-s*.25);c.lineTo(-s*.38,-s*.53);c.lineTo(s*.32,-s*.48);c.lineTo(s*.58,-s*.15);c.lineTo(s*.24,s*.13);c.lineTo(-s*.27,s*.12);c.closePath();c.fill();
    c.fillStyle=colors[2];c.beginPath();c.moveTo(-s*.37,-s*.49);c.lineTo(s*.23,-s*.44);c.lineTo(s*.38,-s*.18);c.lineTo(-s*.13,-s*.22);c.closePath();c.fill();
    // A sauce lap covers the lower face so chunks read as suspended, not pasted on top.
    c.globalAlpha=.91;c.fillStyle=sauce.body;
    c.beginPath();c.moveTo(-s*.58,-s*.02);c.quadraticCurveTo(-s*.05,s*.13,s*.55,-s*.07);c.lineTo(s*.59,depth+s*.08);c.lineTo(-s*.48,depth+s*.07);c.closePath();c.fill();
    c.globalAlpha=.65;c.strokeStyle='#ffd594';c.lineWidth=2;c.beginPath();c.moveTo(-s*.5,-s*.04);c.quadraticCurveTo(0,s*.13,s*.49,-s*.09);c.stroke();
    c.restore();
  }
  drawBubbles(c,amount){
    const active=this.action==='FRY'?.45:this.action==='POUR'?.35+this.progress*.4:.85;
    for(const bubble of this.bubbles){
      const phase=bubble.age/bubble.life;if(phase>1)continue;
      const motion=this.sample(bubble.x,bubble.y),x=this.center.x+bubble.x+motion.x*.45,y=this.center.y+bubble.y+motion.y*.4;
      const bursting=phase>.79,r=bubble.size*(bursting?1+(phase-.79)*5:.48+phase*.6);
      c.save();c.globalAlpha=(bursting?(1-phase)/.21:.24+phase*.44)*active;
      if(!bursting){const swell=c.createRadialGradient(x-r*.5,y-r*.4,1,x,y,r*2.2);
        swell.addColorStop(0,'#ffcb6a66');swell.addColorStop(1,'#71381300');c.fillStyle=swell;
        c.beginPath();c.ellipse(x,y,r*2.2,r*1.15,0,0,Math.PI*2);c.fill()}
      c.strokeStyle='#ffe3a5';c.lineWidth=bursting?1.4:2;c.beginPath();c.ellipse(x,y,r,r*.64,0,0,Math.PI*2);c.stroke();
      if(!bursting){c.fillStyle='#fff0bc';c.beginPath();c.ellipse(x-r*.28,y-r*.26,r*.2,r*.14,0,0,Math.PI*2);c.fill()}c.restore();
    }
  }
  drawSteam(c){
    const active=this.action==='FRY'?.45:this.action==='POUR'?.5:.8;
    c.save();c.lineCap='round';
    for(const plume of this.steam){
      const phase=plume.age/plume.life;if(phase>1)continue;
      const x=plume.x+plume.drift*phase+Math.sin(this.time*1.7+plume.index)*5,y=plume.y-phase*78;
      c.globalAlpha=Math.sin(Math.PI*phase)*.24*active;
      c.strokeStyle='#fff7dc';c.lineWidth=plume.width*(1+phase*.6);c.beginPath();c.moveTo(x,y+12);
      c.bezierCurveTo(x-8,y+1,x+13+plume.drift*.2,y-12,x+plume.drift*.3,y-29);c.stroke();
    }
    c.restore();
  }
  drawSpoon(c){
    if(this.action!=='STIR')return;
    const x=this.spoon.x,y=this.spoon.y,energy=this.spoon.energy;
    c.save();c.shadowColor='#3c230f88';c.shadowBlur=5;c.shadowOffsetY=4;
    c.strokeStyle='#855020';c.lineWidth=17;c.lineCap='round';c.beginPath();c.moveTo(x+12,y+5);c.lineTo(912,558);c.stroke();
    c.strokeStyle='#d59a55';c.lineWidth=12;c.beginPath();c.moveTo(x+14,y+2);c.lineTo(912,554);c.stroke();
    c.translate(x,y);c.rotate(.36+energy*.1);
    const bowl=c.createLinearGradient(-30,-14,32,19);bowl.addColorStop(0,'#f0bd70');bowl.addColorStop(.5,'#c98940');bowl.addColorStop(1,'#8e5425');
    c.fillStyle=bowl;c.beginPath();c.ellipse(0,0,39,20,0,0,Math.PI*2);c.fill();
    c.shadowColor='transparent';c.strokeStyle='#f9d49a';c.lineWidth=2;c.beginPath();c.ellipse(-3,-3,27,11,0,.25,Math.PI*1.6);c.stroke();c.restore();
  }
}

window.POT_SCENE_PRESETS=POT_SCENE_PRESETS;
window.PotScene=PotScene;
