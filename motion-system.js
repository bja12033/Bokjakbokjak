/* Shared motion vocabulary for every recipe step. Scenes provide the visible parts;
   the recipe data chooses an action, and this player owns its timing and outcome. */
const CookingMotion=(()=>{
  const durations={chop:180,toss:1850,season:900,sauce:950,powder:950,pour:1050,coat:900,fill:850,broth:1050,crack:760,heat:950,simmer:1000,boil:1000,stir:850,sear:1050,flip:1400,fry:1050,separate:850,draw:360,sprinkle:420,ladle:500};
  const ease='cubic-bezier(.22,.72,.27,1)';
  const prefersLessMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function play(root,step,outcome='perfect'){
    const duration=prefersLessMotion()?0:(durations[step.action]||800);
    if(!root||!duration)return{duration};
    const animate=(selector,frames,options={})=>{
      root.querySelectorAll(selector).forEach(element=>element.animate(frames,{duration,easing:ease,fill:'none',...options}));
    };
    const bob=[{transform:'translateY(0) scale(1)'},{transform:'translateY(-8px) scale(1.06)',offset:.48},{transform:'translateY(3px) scale(.97)',offset:.83},{transform:'translateY(0) scale(1)'}];
    const stir=[{transform:'rotate(-34deg) translate(0,0)'},{transform:'rotate(-8deg) translate(-26px,16px)',offset:.3},{transform:'rotate(-56deg) translate(-35px,6px)',offset:.65},{transform:'rotate(-34deg) translate(0,0)'}];
    if(outcome==='miss'){
      animate(':scope > *',[{transform:'translateX(0)'},{transform:'translateX(-10px)',offset:.3},{transform:'translateX(8px)',offset:.65},{transform:'translateX(0)'}],{duration:420});
      return{duration:420};
    }
    switch(step.action){
      case 'chop':
        animate('.chop-knife',[{transform:'rotate(0) translateY(0)'},{transform:'rotate(-30deg) translate(-18px,30px)',offset:.55},{transform:'rotate(0) translateY(0)'}]);
        animate('.ingredient-cut-art',bob);
        break;
      case 'toss':
      case 'flip':{
        const height=(outcome==='good'?.78:1)*(root.querySelector('.flip-scene')?.5:1);
        const arc=y=>`${Math.round(y*height)}px`;
        const flipFrames=[
          {translate:'0 0',rotate:'0deg',scale:1,offset:0},
          {translate:`0 ${arc(-46)}`,rotate:'0deg',scale:1.02,offset:.23},
          {translate:`0 ${arc(-90)}`,rotate:'45deg',scale:1.05,offset:.39},
          {translate:`0 ${arc(-108)}`,rotate:'90deg',scale:1.07,offset:.54},
          {translate:`0 ${arc(-55)}`,rotate:'205deg',scale:1.03,offset:.72},
          {translate:'0 4px',rotate:'350deg',scale:.93,offset:.88},
          {translate:'0 -6px',rotate:'360deg',scale:1.03,offset:.94},
          {translate:'0 0',rotate:'360deg',scale:1,offset:1}
        ];
        // The reference pan toss keeps the food facing up: the pan winds up,
        // the mound rises, loosens at the apex, falls, and gathers on landing.
        const tossFrames=[
          {translate:'0 0',rotate:'0deg',scale:1,offset:0},
          {translate:'0 5px',rotate:'0deg',scale:.97,offset:.2},
          {translate:`0 ${arc(-28)}`,rotate:'-3deg',scale:1.02,offset:.31},
          {translate:`0 ${arc(-103)}`,rotate:'-7deg',scale:1.09,offset:.43},
          {translate:`0 ${arc(-139)}`,rotate:'2deg',scale:1.12,offset:.55},
          {translate:`0 ${arc(-121)}`,rotate:'7deg',scale:1.06,offset:.63},
          {translate:`0 ${arc(-48)}`,rotate:'3deg',scale:1.02,offset:.71},
          {translate:'0 5px',rotate:'0deg',scale:.94,offset:.78},
          {translate:'0 -4px',rotate:'0deg',scale:1.025,offset:.86},
          {translate:'0 0',rotate:'0deg',scale:1,offset:1}
        ];
        const frames=step.action==='toss'?tossFrames:flipFrames;
        animate('.flying-food',frames,{easing:'linear'});
        // The finished dish preview includes a plate; only the food pieces should fly.
        animate('.cook-preview',[{opacity:0},{opacity:0}]);
        animate('.cook-pieces',frames.map(frame=>({...frame,opacity:1})),{easing:'linear'});
        if(step.action==='toss'){
          const spread=[[-28,-10],[23,-22],[-16,18],[31,11]];
          root.querySelectorAll('.cook-morsel,.flight-bit').forEach((element,index)=>{
            const [x,y]=spread[index%spread.length];
            const drift=[{translate:'0 0',rotate:'0deg',opacity:1,offset:0},{translate:'0 0',rotate:'0deg',opacity:1,offset:.25},{translate:`${Math.round(x*.4)}px ${arc(-71)}`,rotate:`${x/2}deg`,opacity:1,offset:.42},{translate:`${x}px ${arc(-120+y)}`,rotate:`${x}deg`,opacity:1,offset:.55},{translate:`${Math.round(x*.55)}px ${arc(-96+y)}`,rotate:`${x/2}deg`,opacity:1,offset:.65},{translate:'0 4px',rotate:'0deg',opacity:1,offset:.79},{translate:'0 0',rotate:'0deg',opacity:1,offset:1}];
            if(element.matches('.flight-bit'))drift[0].opacity=drift[1].opacity=drift[6].opacity=0;
            element.animate(drift,{duration,easing:'linear',fill:'none'});
          });
          animate('.pan-food',[{opacity:1},{opacity:0,offset:.28},{opacity:0,offset:.7},{opacity:1,offset:.82}]);
          animate('.pan,.cook-vessel',[{transform:'translateY(0) rotate(0deg) scale(1)',offset:0},{transform:'translateY(7px) rotate(-3deg) scale(.98)',offset:.2},{transform:'translateY(22px) rotate(5deg) scale(1.08)',offset:.39},{transform:'translateY(18px) rotate(3deg) scale(1.06)',offset:.56},{transform:'translateY(4px) rotate(-2deg) scale(1.01)',offset:.76},{transform:'translateY(0) rotate(0deg) scale(1)',offset:1}],{easing:'linear'});
        }else{
          animate('.cook-morsel',frames,{easing:'linear'});
          animate('.pan,.cook-vessel',[{transform:'translateY(0) rotate(0deg)'},{transform:'translateY(9px) rotate(-6deg)',offset:.22},{transform:'translateY(-7px) rotate(5deg)',offset:.43},{transform:'translateY(3px) rotate(-2deg)',offset:.87},{transform:'translateY(0) rotate(0deg)'}],{easing:'linear'});
        }
        animate('.toss-shadow',[{transform:'scale(1)',opacity:.55},{transform:'scale(.42)',opacity:.15,offset:.54},{transform:'scale(1.15)',opacity:.65,offset:.88},{transform:'scale(1)',opacity:.55}],{easing:'linear'});
        animate('.landing-ring',[{transform:'scale(.6)',opacity:0,offset:0},{transform:'scale(.6)',opacity:0,offset:.82},{transform:'scale(.85)',opacity:.9,offset:.88},{transform:'scale(1.5)',opacity:0,offset:1}],{easing:'linear'});
        break;
      }
      case 'season':
      case 'sauce':
      case 'powder':
      case 'pour':
      case 'coat':
        animate('.action-source',[{transform:'rotate(-8deg) translateY(0)'},{transform:'rotate(35deg) translate(-15px,8px)',offset:.25},{transform:'rotate(42deg) translate(-20px,10px)',offset:.68},{transform:'rotate(-8deg) translateY(0)'}]);
        animate('.action-stream i',[{transform:'translateY(-20px) scale(.55)',opacity:0},{transform:'translateY(25px) scale(1)',opacity:1,offset:.45},{transform:'translateY(85px) scale(.85)',opacity:0}],{delay:100});
        animate('.action-target',bob);
        break;
      case 'fill':
        animate('.water-fill',[{transform:'scaleY(.75)'},{transform:'scaleY(1.05)',offset:.75},{transform:'scaleY(1)'}]);
        animate('.water-surface',[{transform:'scaleX(.85)'},{transform:'scaleX(1.06)',offset:.75},{transform:'scaleX(1)'}]);
        animate('.water-pour',[{transform:'translateY(-12px)',opacity:0},{transform:'translateY(72px)',opacity:1,offset:.7},{transform:'translateY(90px)',opacity:0}]);
        break;
      case 'broth':
        animate('.broth-ladle',[{transform:'rotate(-10deg) translate(0,0)'},{transform:'rotate(30deg) translate(-18px,15px)',offset:.5},{transform:'rotate(-10deg) translate(0,0)'}]);
        animate('.broth-liquid',[{transform:'scale(1,.94)'},{transform:'scale(1.08,1.04)',offset:.55},{transform:'scale(1,.94)'}]);
        break;
      case 'crack':
        animate('.egg-real',[{transform:'translateY(0) scale(1)',backgroundPosition:'0 0'},{transform:'translateY(15px) scale(.96)',backgroundPosition:'0 0',offset:.34},{transform:'translateY(-7px) scale(1.04)',backgroundPosition:'50% 0',offset:.55},{transform:'translateY(10px) scale(.96)',backgroundPosition:'50% 0'}],{easing:'steps(2,end)'});
        animate('.bowl',bob);
        break;
      case 'heat':
      case 'simmer':
      case 'boil':
        animate('.heat-flames i',[{transform:'scale(.85)',opacity:.45},{transform:'scale(1.22)',opacity:1,offset:.55},{transform:'scale(1)',opacity:.7}]);
        animate('.heat-surface,.heat-liquid,.raw-noodles',bob);
        animate('.boil-bubbles i,.heat-steam i',[{transform:'translateY(8px) scale(.5)',opacity:0},{transform:'translateY(-25px) scale(1.15)',opacity:1,offset:.55},{transform:'translateY(-48px) scale(1.3)',opacity:0}]);
        break;
      case 'stir':
      case 'separate':
      case 'sear':
      case 'fry':
        animate('.cook-utensil',stir);
        animate('.cook-preview,.cook-pieces',[{transform:'perspective(90px) rotateX(48deg) translateX(0) scale(1)'},{transform:'perspective(90px) rotateX(48deg) translateX(17px) scale(.94)',offset:.35},{transform:'perspective(90px) rotateX(48deg) translateX(-12px) scale(1.06)',offset:.7},{transform:'perspective(90px) rotateX(48deg) translateX(0) scale(1)'}]);
        animate('.cook-morsel',bob);
        if(step.action==='sear'||step.action==='fry')animate('.heat-glow i',[{transform:'scale(.85)',opacity:.6},{transform:'scale(1.28)',opacity:1,offset:.55},{transform:'scale(1)',opacity:.7}]);
        break;
      case 'draw':
      case 'sprinkle':
      case 'ladle':
        animate('#drawing',[{filter:'brightness(1) saturate(1)'},{filter:'brightness(1.08) saturate(1.14)',offset:.6},{filter:'brightness(1) saturate(1)'}]);
        break;
    }
    return{duration};
  }
  return{play,durations};
})();
