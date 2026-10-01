import {FryingEngine} from './frying-engine.js';
import {SCENE_IMAGES,FOOD_IMAGES,INGREDIENT_MATERIALS,FRYING_RECIPES} from './frying-content.js';

const stage=document.getElementById('stage');
const canvas=document.getElementById('cooking-canvas');
const note=document.getElementById('gesture-note');
const speedFill=document.getElementById('speed-fill');
const tossCount=document.getElementById('toss-count');
function loadImage(path){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error(`Could not load ${path}`));image.src=path})}
async function loadFoodImages(paths){
  const [mound,ingredients]=await Promise.all([
    loadImage(paths.mound),
    Promise.all(Object.entries(paths.ingredients).map(async([type,path])=>[type,await loadImage(path)]))
  ]);
  return{mound,ingredients:Object.fromEntries(ingredients)};
}

async function start(){
  const recipeId=new URLSearchParams(location.search).get('recipe')||'friedRice';
  const recipe=FRYING_RECIPES[recipeId];
  if(!recipe||!FOOD_IMAGES[recipe.id])throw new Error(`Unknown frying recipe: ${recipeId}`);
  document.title=`${recipe.name} 팬 볶기 프로토타입 · 루루의 주방`;
  stage.setAttribute('aria-label',`${recipe.name} 팬 조작 장면`);
  canvas.setAttribute('aria-label',`${recipe.name} 조리 화면`);
  const [sceneEntries,foodImages]=await Promise.all([
    Promise.all(Object.entries(SCENE_IMAGES).map(async([key,path])=>[key,await loadImage(path)])),
    loadFoodImages(FOOD_IMAGES[recipe.id])
  ]);
  const engine=new FryingEngine(canvas,{...Object.fromEntries(sceneEntries),foodImages},recipe,{materials:INGREDIENT_MATERIALS});
  window.fryingPrototype={engine,recipe,useFoodImages:async paths=>engine.setFoodImages(await loadFoodImages(paths))};
  let noteTimer=0;
  engine.onToss=count=>{tossCount.textContent=count;note.textContent='좋아요! 재료가 팬으로 다시 모입니다';note.classList.remove('is-hidden');clearTimeout(noteTimer);noteTimer=setTimeout(()=>note.classList.add('is-hidden'),1400)};
  const position=event=>{const rect=stage.getBoundingClientRect();return{x:(event.clientX-rect.left)*1280/rect.width,y:(event.clientY-rect.top)*720/rect.height}};
  stage.addEventListener('pointerdown',event=>{if(event.button!==0&&event.pointerType==='mouse')return;event.preventDefault();stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging');note.classList.add('is-hidden');const point=position(event);engine.beginDrag(point.x,point.y,event.timeStamp)});
  stage.addEventListener('pointermove',event=>{if(!stage.hasPointerCapture(event.pointerId))return;event.preventDefault();const point=position(event);engine.moveDrag(point.x,point.y,event.timeStamp)});
  const release=event=>{if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);stage.classList.remove('is-dragging');engine.endDrag()};
  stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
  document.getElementById('reset-food').addEventListener('click',()=>{engine.endDrag();engine.resetFood();tossCount.textContent='0';note.textContent='팬을 잡고 앞뒤로 움직여 보세요';note.classList.remove('is-hidden')});
  let previous=performance.now();
  function frame(now){const elapsed=Math.min((now-previous)/1000,.05);previous=now;engine.update(elapsed);engine.render();speedFill.style.width=`${Math.min(100,engine.speed/11)}%`;requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
}
start().catch(error=>{note.textContent='그림을 불러오지 못했습니다. 페이지를 새로고침해 주세요.';console.error(error)});
