/* Reusable, real-time cutting illustration. The reference movie is never loaded by the game. */
const CUTTING_PROFILES={
  rice:{active:'#e88636',edge:'#bc5929',light:'#ffc376',bowls:['#ee9140','#d98d86','#69a354'],piles:['#f6e9c4','#62a14e']},
  curry:{active:'#df9144',edge:'#ad632d',light:'#f9c579',bowls:['#e99a4c','#e3cc93','#e8b764'],piles:['#edd6a0','#f2e2b6']}
};
const cutClamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const cutRandom=(seed)=>{let state=seed>>>0;return()=>((state=Math.imul(state,1664525)+1013904223>>>0)/4294967296)};

class CuttingScene{
  constructor(ctx,food,ingredient='carrot'){
    this.ctx=ctx;this.food=food;this.ingredient=ingredient;this.vegetableStage=food==='rice'||food==='curry';this.profile=CUTTING_PROFILES[food]||CUTTING_PROFILES.rice;
    this.ingredientColors={carrot:'#ef8127',onion:'#f1e4bd',pepper:'#3f982d',potato:'#f3cb70'};
    this.time=0;this.stroke=0;this.miss=0;this.cutCount=0;this.pointerShift=0;this.flying=[];
    this.carrotCuts=0;this.queuedCuts=0;this.cutClock=0;this.cutActive=false;this.cutContact=false;this.carrotPieces=[];
    this.art={};
    for(const [key,file] of Object.entries({board:food==='curry'?'curry-board-background.png':'rice-carrot-background.png',left:'left-hand.png',knife:'right-hand-knife.png',...(this.vegetableStage?{carrot:'rice-carrot-sprite.png',vegetables:'rice-vegetables-v2.png',ingredients:'../frying-prototype/food/fried-rice-ingredients-v2.png',...(food==='curry'?{potato:'curry-potato-sprite.png'}:{})}:{})})){
      const picture=new Image();picture.decoding='async';picture.src=`assets/cutting/${file}`;this.art[key]=picture;
    }
    this.background=document.createElement('canvas');this.background.width=1280;this.background.height=720;
    const c=this.background.getContext('2d',{alpha:false});
    c.fillStyle='#e7ba81';c.fillRect(0,0,1280,720);
    c.save();c.translate(0,-110);c.scale(2,2);this.drawBackground(c);c.restore();
  }
  update(dt){
    this.time+=dt;this.stroke=Math.max(0,this.stroke-dt*3.6);this.miss=Math.max(0,this.miss-dt*4.5);
    if(this.vegetableStage){
      if(this.cutActive){
        this.cutClock+=dt;
        if(!this.cutContact&&this.cutClock>=.14){this.cutContact=true;this.finishCarrotCut()}
        if(this.cutClock>=.30){this.cutActive=false;this.cutClock=0;if(this.queuedCuts)this.startCarrotCut()}
      }
      for(const piece of this.carrotPieces){
        piece.age+=dt;
        if(piece.age<.29){piece.x+=piece.vx*dt;piece.y+=piece.vy*dt;piece.vy+=360*dt;piece.rotation+=piece.spin*dt}
        else{const settle=Math.min(1,dt*13);piece.x+=(piece.targetX-piece.x)*settle;piece.y+=(piece.targetY-piece.y)*settle;piece.rotation+=(piece.targetRotation-piece.rotation)*settle}
      }
      return;
    }
    this.flying=this.flying.filter(piece=>piece.life>0);
    for(const piece of this.flying){piece.x+=piece.vx*dt;piece.y+=piece.vy*dt;piece.vy+=260*dt;piece.rotation+=piece.spin*dt;piece.life-=dt}
  }
  movePointer(point){this.pointerShift=cutClamp((point.x-640)/34,-12,12)}
  strike(){
    this.stroke=1;this.miss=0;this.cutCount++;
    if(this.vegetableStage){this.queuedCuts++;if(!this.cutActive)this.startCarrotCut();return}
    const random=cutRandom(this.cutCount*314159);
    for(let index=0;index<7;index++)this.flying.push({x:305+random()*19,y:264+random()*25,vx:(random()-.5)*95,vy:-45-random()*95,spin:(random()-.5)*8,rotation:random(),life:.38+random()*.18,size:5+random()*4});
  }
  hesitate(){this.miss=1}
  startCarrotCut(){this.queuedCuts--;this.cutActive=true;this.cutContact=false;this.cutClock=0}
  finishCarrotCut(){
    const cut=++this.carrotCuts;
    if(this.ingredient==='carrot'&&cut<=2){
      this.carrotPieces.push({kind:'slice',age:0,x:334,y:273,vx:51+cut*7,vy:-84,spin:.8,rotation:0,targetX:360+(cut-1)*21,targetY:283+(cut%2)*4,targetRotation:cut===1?-.12:.1});
      return;
    }
    const random=cutRandom(cut*991);
    for(let index=0;index<(this.ingredient==='carrot'?18:14);index++){
      const angle=random()*Math.PI*2,radius=Math.sqrt(random());
      const pileX=this.food==='curry'?({carrot:383,onion:440,potato:505}[this.ingredient]||445):445;
      this.carrotPieces.push({kind:'dice',age:0,x:334+random()*6,y:271+random()*9,vx:150+random()*100,vy:-80-random()*60,spin:(random()-.5)*5,rotation:0,targetX:pileX+Math.cos(angle)*radius*45,targetY:279+Math.sin(angle)*radius*28-index*.18,targetRotation:(random()-.5)*.7,size:13+random()*4});
    }
  }
  rounded(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
  ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()}
  cube(c,x,y,size,color,rotation=0){
    c.save();c.translate(x,y);c.rotate(rotation);c.shadowColor='#6f442c66';c.shadowBlur=2;c.shadowOffsetY=2;
    this.rounded(c,-size/2,-size/2,size,size,Math.max(1,size*.17),color);
    c.shadowColor='transparent';c.globalAlpha=.28;this.rounded(c,-size/2+1,-size/2+1,size*.65,Math.max(2,size*.21),1,'#fff8cf');c.restore();
  }
  drawIngredientCube(c,x,y,size,rotation=0){
    const image=this.art.ingredients,index={carrot:0,onion:1,pepper:2}[this.ingredient];
    if(!image?.naturalWidth||index===undefined){this.cube(c,x,y,size,this.ingredientColors[this.ingredient],rotation);return}
    const cellW=image.width/2,cellH=image.height/2,insetW=cellW*.16,insetH=cellH*.16;
    c.save();c.translate(x,y);c.rotate(rotation);
    c.drawImage(image,(index%2)*cellW+insetW,Math.floor(index/2)*cellH+insetH,cellW-insetW*2,cellH-insetH*2,-size/2,-size/2,size,size);
    c.restore();
  }
  drawBowl(c,x,y,fill,seed){
    c.save();c.shadowColor='#7b503d66';c.shadowBlur=9;c.shadowOffsetY=8;this.ellipse(c,x,y+8,51,26,'#cbb9a4');c.restore();
    this.ellipse(c,x,y+3,51,28,'#fff8e9');this.ellipse(c,x,y-2,43,22,'#c7b9a2');this.ellipse(c,x,y-4,39,18,'#e1d5b9');
    const random=cutRandom(seed);c.save();c.beginPath();c.ellipse(x,y-4,38,17,0,0,Math.PI*2);c.clip();
    for(let i=0;i<55;i++){const angle=random()*Math.PI*2,radius=Math.sqrt(random());this.cube(c,x+Math.cos(angle)*radius*36,y-5+Math.sin(angle)*radius*16,5+random()*4,fill,(random()-.5)*.3)}
    c.restore();c.strokeStyle='#fffdf2';c.lineWidth=6;c.beginPath();c.ellipse(x,y-2,43,22,0,0,Math.PI*2);c.stroke();
  }
  drawBackground(c){
    const wall=c.createLinearGradient(0,0,0,135);wall.addColorStop(0,'#f9e9c8');wall.addColorStop(1,'#eac89f');c.fillStyle=wall;c.fillRect(0,0,640,146);
    c.strokeStyle='#d5b699';c.lineWidth=2;for(let y=30;y<145;y+=48){c.beginPath();c.moveTo(0,y);c.lineTo(640,y);c.stroke()}for(let x=0;x<640;x+=86){c.beginPath();c.moveTo(x,0);c.lineTo(x,145);c.stroke()}
    const counter=c.createLinearGradient(0,140,0,475);counter.addColorStop(0,'#f9d79a');counter.addColorStop(.55,'#e9b875');counter.addColorStop(1,'#dca469');c.fillStyle=counter;c.fillRect(0,140,640,335);
    c.strokeStyle='#d69a5d66';c.lineWidth=2;for(let y=146;y<475;y+=74){c.beginPath();c.moveTo(0,y);c.lineTo(640,y-8);c.stroke()}
    c.save();c.shadowColor='#63432f77';c.shadowBlur=20;c.shadowOffsetY=12;this.rounded(c,74,159,476,238,17,'#8f603d');c.restore();
    this.rounded(c,76,160,472,224,16,'#b77746');
    const board=c.createLinearGradient(100,162,520,390);board.addColorStop(0,'#f0bf81');board.addColorStop(.45,'#e8b378');board.addColorStop(1,'#d69a62');this.rounded(c,81,163,463,215,13,board);
    c.strokeStyle='#9b643f99';c.lineWidth=2;c.beginPath();c.roundRect(81,163,463,215,13);c.stroke();
    c.strokeStyle='#fff0bd4d';c.lineWidth=2;for(let i=0;i<8;i++){const y=184+i*25;c.beginPath();c.moveTo(115,y);c.bezierCurveTo(235,y+5,400,y-3,521,y+4);c.stroke()}
    this.rounded(c,92,279,15,32,7,'#a66a43');this.rounded(c,95,283,9,24,5,'#dca371');
    this.drawBowl(c,160,93,this.profile.bowls[0],11);this.drawBowl(c,278,92,this.profile.bowls[1],22);this.drawBowl(c,403,94,this.profile.bowls[2],33);
    c.save();c.shadowColor='#48372b88';c.shadowBlur=13;this.ellipse(c,638,110,92,124,'#383b3d');c.restore();this.ellipse(c,638,102,84,116,'#c94732');this.ellipse(c,632,87,75,97,'#282d33');c.strokeStyle='#e9b29a';c.lineWidth=7;c.beginPath();c.ellipse(638,102,84,116,0,0,Math.PI*2);c.stroke();
    this.drawPile(c,398,258,this.profile.piles[0],49,106);this.drawPile(c,484,260,this.profile.piles[1],47,207);
    c.save();c.globalAlpha=.13;this.ellipse(c,326,325,121,22,'#674a30');c.restore();
  }
  drawPile(c,x,y,color,count,seed){
    const random=cutRandom(seed);for(let i=0;i<count;i++){const angle=random()*Math.PI*2,radius=Math.sqrt(random());this.cube(c,x+Math.cos(angle)*radius*40,y+Math.sin(angle)*radius*28,6+random()*5,color,(random()-.5)*.55)}
  }
  drawActiveFood(c,progress){
    c.save();c.translate(205,222);c.rotate(-.4);c.shadowColor='#73493077';c.shadowBlur=5;c.shadowOffsetY=4;
    this.rounded(c,-42,-13,84,26,11,this.profile.edge);this.rounded(c,-39,-14,78,23,10,this.profile.active);
    c.strokeStyle=this.profile.light;c.lineWidth=2;for(let x=-30;x<37;x+=13){c.beginPath();c.moveTo(x,-9);c.lineTo(x+4,8);c.stroke()}c.restore();
    const length=56-progress*27;
    c.save();c.translate(279,277);c.shadowColor='#73493077';c.shadowBlur=5;c.shadowOffsetY=5;
    this.rounded(c,-5,-13,length,25,7,this.profile.edge);this.rounded(c,-4,-14,length-2,21,7,this.profile.active);
    c.strokeStyle=this.profile.light;c.lineWidth=2;for(let x=6;x<length-8;x+=12){c.beginPath();c.moveTo(x,-10);c.lineTo(x+4,3);c.stroke()}c.restore();
    const amount=12+Math.round(progress*48),random=cutRandom(687);for(let i=0;i<amount;i++){const angle=random()*Math.PI*2,radius=Math.sqrt(random());this.cube(c,337+Math.cos(angle)*radius*41,274+Math.sin(angle)*radius*32,6+random()*6,this.profile.active,(random()-.5)*.35)}
    for(const piece of this.flying){c.save();c.globalAlpha=cutClamp(piece.life*2,0,1);this.cube(c,piece.x,piece.y,piece.size,this.profile.active,piece.rotation);c.restore()}
  }
  drawVegetable(c){
    const cuts=Math.min(this.carrotCuts,5),tip=145+cuts*21,right=333;
    if(this.ingredient==='potato'&&this.art.potato?.naturalWidth){
      c.save();c.globalAlpha=.2;this.ellipse(c,247,309,99-cuts*8,15,'#744129');c.restore();
      c.save();c.beginPath();c.rect(tip,220,right-tip+15,110);c.clip();c.drawImage(this.art.potato,100,217,290,125);c.restore();
      for(const piece of this.carrotPieces)this.drawIngredientCube(c,piece.x,piece.y,piece.size,piece.rotation);
      return;
    }
    if(this.ingredient!=='carrot'){
      const onion=this.ingredient==='onion',potato=this.ingredient==='potato',base=onion?'#f6e9bf':potato?'#f3cb70':'#3a922b',edge=onion?'#d9c894':potato?'#c99a46':'#286722';
      c.save();c.globalAlpha=.2;this.ellipse(c,247,304,99-cuts*8,15,'#744129');c.restore();
      if(this.art.vegetables?.naturalWidth&&!potato){
        const image=this.art.vegetables,sw=image.width/2;
        c.save();c.beginPath();c.rect(155,218,Math.max(40,181-cuts*24),126);c.clip();
        c.drawImage(image,onion?0:sw,0,sw,image.height,155,219,178,113);c.restore();
      }else{
        c.fillStyle=base;c.strokeStyle=edge;c.lineWidth=3;c.beginPath();
        c.ellipse(240+cuts*10,278,Math.max(28,86-cuts*10),onion?43:37,-.12,0,Math.PI*2);c.fill();c.stroke();
        if(onion){c.strokeStyle='#fff9df';c.lineWidth=2;for(let i=0;i<4;i++){c.beginPath();c.ellipse(240+cuts*10,278,Math.max(18,69-cuts*10-i*10),34-i*5,-.12,Math.PI*.9,Math.PI*1.9);c.stroke()}}
        else if(!potato){c.fillStyle='#6aba44';c.beginPath();c.ellipse(234+cuts*10,266,48,13,-.18,0,Math.PI*2);c.fill();this.ellipse(c,274+cuts*10,274,13,9,'#f4dea0')}
      }
      for(const piece of this.carrotPieces)this.drawIngredientCube(c,piece.x,piece.y,piece.size,piece.rotation);
      return;
    }
    c.save();c.globalAlpha=.23;this.ellipse(c,(tip+right)/2,309,(right-tip)/2+7,15,'#744129');c.restore();
    if(this.art.carrot?.naturalWidth){
      c.save();c.beginPath();c.rect(tip,235,right-tip+15,95);c.clip();
      c.drawImage(this.art.carrot,100,235,290,90);c.restore();
    }else{
      const body=c.createLinearGradient(0,247,0,307);body.addColorStop(0,'#ffd475');body.addColorStop(.5,'#ed7627');body.addColorStop(1,'#b74c1c');
      c.fillStyle=body;c.beginPath();c.moveTo(tip,281);c.bezierCurveTo(tip+30,268,right-42,244,right-16,248);c.quadraticCurveTo(right+4,249,right,276);c.quadraticCurveTo(right+2,306,right-17,305);c.bezierCurveTo(right-70,303,tip+39,295,tip,281);c.fill();
    }
    for(const piece of this.carrotPieces){
      if(piece.kind==='dice'){this.drawIngredientCube(c,piece.x,piece.y,piece.size,piece.rotation);continue}
      c.save();c.translate(piece.x,piece.y);c.rotate(piece.rotation);
      c.shadowColor='#87461f66';c.shadowBlur=3;c.shadowOffsetY=3;
      this.ellipse(c,0,2,13,16,'#c95e20');this.ellipse(c,0,-1,12,14,'#f79030');
      c.shadowColor='transparent';c.strokeStyle='#ffca67';c.lineWidth=2;c.beginPath();c.ellipse(0,-2,8,10,-.1,0,Math.PI*2);c.stroke();
      this.ellipse(c,-3,-5,2.2,3,'#ffd67f');c.restore();
    }
  }
  drawLeftHand(c,progress){
    const shift=progress*9;c.save();c.translate(shift,0);
    c.save();c.shadowColor='#563d3266';c.shadowBlur=8;c.shadowOffsetY=5;
    c.fillStyle='#fff9ef';c.beginPath();c.moveTo(0,470);c.lineTo(0,354);c.lineTo(94,289);c.lineTo(120,331);c.lineTo(83,470);c.closePath();c.fill();c.restore();
    c.strokeStyle='#e88f85';c.lineWidth=6;c.beginPath();c.moveTo(35,341);c.lineTo(99,370);c.stroke();
    const skin=c.createLinearGradient(115,230,260,355);skin.addColorStop(0,'#ffe3bb');skin.addColorStop(.6,'#ffd1a4');skin.addColorStop(1,'#eeb98f');c.fillStyle=skin;c.strokeStyle='#c9856e';c.lineWidth=2;
    c.beginPath();c.moveTo(45,355);c.bezierCurveTo(98,308,155,275,202,248);c.bezierCurveTo(217,238,236,231,245,239);c.bezierCurveTo(251,245,246,251,238,253);c.bezierCurveTo(261,241,274,242,278,252);c.bezierCurveTo(280,258,272,263,264,265);c.bezierCurveTo(276,262,288,268,283,278);c.bezierCurveTo(278,288,259,286,242,286);c.bezierCurveTo(211,287,195,300,178,314);c.lineTo(91,386);c.closePath();c.fill();c.stroke();
    c.strokeStyle='#e9ad88';c.lineWidth=2;for(const [x,y] of [[234,254],[249,265],[262,278]]){c.beginPath();c.moveTo(x-12,y+5);c.lineTo(x+5,y-2);c.stroke()}c.restore();
  }
  drawKnifeAndRightHand(c){
    const beat=this.vegetableStage?0:Math.sin(this.time*12)*2;
    const impact=this.vegetableStage?(this.cutActive?Math.sin(Math.PI*Math.min(1,this.cutClock/.30))*39:0):(this.stroke>0?Math.sin((1-this.stroke)*Math.PI)*39:0);
    const hesitation=this.miss>0?Math.sin(this.time*45)*this.miss*4:0;
    c.save();c.translate(this.pointerShift+hesitation,impact+beat);
    c.save();c.shadowColor='#393c4266';c.shadowBlur=8;c.shadowOffsetX=5;c.shadowOffsetY=5;
    const steel=c.createLinearGradient(275,180,344,340);steel.addColorStop(0,'#f8fcfb');steel.addColorStop(.45,'#d5e1e5');steel.addColorStop(1,'#82919a');c.fillStyle=steel;c.strokeStyle='#52626b';c.lineWidth=2;
    c.beginPath();c.moveTo(279,169);c.lineTo(317,199);c.lineTo(350,329);c.lineTo(331,338);c.lineTo(300,279);c.closePath();c.fill();c.stroke();c.restore();
    c.strokeStyle='#fffef9cc';c.lineWidth=2;c.beginPath();c.moveTo(284,176);c.lineTo(333,326);c.stroke();
    this.rounded(c,334,324,26,50,8,'#3c4145');this.rounded(c,341,330,9,35,4,'#606970');
    c.save();c.shadowColor='#563d3266';c.shadowBlur=8;c.shadowOffsetY=5;c.fillStyle='#fff9ef';c.beginPath();c.moveTo(448,475);c.lineTo(385,475);c.lineTo(360,385);c.lineTo(397,349);c.closePath();c.fill();c.restore();
    c.strokeStyle='#e88f85';c.lineWidth=6;c.beginPath();c.moveTo(367,383);c.lineTo(403,362);c.stroke();
    const skin=c.createLinearGradient(333,302,445,410);skin.addColorStop(0,'#ffe1b9');skin.addColorStop(.65,'#ffd0a2');skin.addColorStop(1,'#e9aa85');c.fillStyle=skin;c.strokeStyle='#c9856e';c.lineWidth=2;
    c.beginPath();c.moveTo(402,383);c.bezierCurveTo(384,359,370,334,352,311);c.bezierCurveTo(338,296,329,303,329,316);c.bezierCurveTo(322,302,314,303,311,314);c.bezierCurveTo(309,326,317,340,328,351);c.bezierCurveTo(335,367,348,379,358,394);c.lineTo(383,448);c.lineTo(445,449);c.closePath();c.fill();c.stroke();
    c.strokeStyle='#e7ae89';c.lineWidth=2;c.beginPath();c.moveTo(327,320);c.lineTo(344,346);c.stroke();c.restore();
  }
  render(progress){
    const c=this.ctx;c.clearRect(0,0,1280,720);
    if(this.art.board.complete&&this.art.board.naturalWidth)c.drawImage(this.art.board,0,0,1280,720);
    else c.drawImage(this.background,0,0,1280,720);
    c.save();c.translate(0,-110);c.scale(2,2);
    if(this.vegetableStage)this.drawVegetable(c);else this.drawActiveFood(c,progress);
    if(this.art.left.complete&&this.art.left.naturalWidth){
      c.save();c.translate(this.vegetableStage?-40+this.carrotCuts*3:progress*9,0);c.drawImage(this.art.left,16,184,334,222);c.restore();
    }else this.drawLeftHand(c,progress);
    if(this.art.knife.complete&&this.art.knife.naturalWidth){
      const beat=this.vegetableStage?0:Math.sin(this.time*12)*2;
      const impact=this.vegetableStage?(this.cutActive?Math.sin(Math.PI*Math.min(1,this.cutClock/.30))*39:0):(this.stroke>0?Math.sin((1-this.stroke)*Math.PI)*39:0);
      const hesitation=this.miss>0?Math.sin(this.time*45)*this.miss*4:0;
      c.save();c.translate(this.pointerShift+hesitation,impact+beat);
      c.drawImage(this.art.knife,268,163,205,201);c.restore();
    }else this.drawKnifeAndRightHand(c);
    c.restore();
  }
}
window.CuttingScene=CuttingScene;
