/* Data-only validation recipe. Its interactions are shared by future recipes. */
window.COOKING_RECIPE_DATA={
  pancakeTest:{
    id:'pancake-test',hasFreeGarnish:false,
    ingredients:['🥚 계란','🌾 파우더','🍬 설탕','🥞 반죽','🍯 시럽'],
    steps:[
      {interaction:'TIMING',action:'TIMING',label:'계란 깨기',instruction:'바늘이 초록 구간일 때 눌러 계란을 깨요.',inputText:'SPACE · 화면 탭',scene:'bowl',ingredient:'egg',stateKey:'eggAdded',asset:'assets/frying-prototype/food/egg.png',animation:'egg-crack',goal:1},
      {interaction:'HOLD_AMOUNT',action:'HOLD_AMOUNT',label:'가루와 설탕 넣기',instruction:'가루를 넣고 손을 뗀 뒤, 같은 볼에 설탕을 차례로 넣어요.',inputText:'가루 → 설탕 · 각각 목표량에 맞춰 누르고 있어요',scene:'bowl',phases:[{label:'가루',ingredient:'powder',stateKey:'powderAmount',targetAmount:.58,minAmount:.48,maxAmount:.7,rate:.32},{label:'설탕',ingredient:'sugar',stateKey:'sugarAmount',targetAmount:.48,minAmount:.39,maxAmount:.59,rate:.34}],phaseStateKey:'mixPhase',asset:'assets/frying-prototype/food/pancake-core.png',animation:'pour-ingredients',goal:1},
      {interaction:'STIR',action:'STIR',label:'반죽 섞기',instruction:'볼 안에서 원을 그리며 반죽을 섞어요.',inputText:'마우스 / 손가락으로 원을 그려요',scene:'bowl',ingredient:'batter',stateKey:'batterMixed',targetTurns:1.35,animation:'stir-batter',goal:1},
      {interaction:'HOLD_AMOUNT',action:'HOLD_AMOUNT',label:'팬에 반죽 붓기',instruction:'적정량만큼 팬에 반죽을 부어요.',inputText:'누르고 있는 동안 부어져요 · SPACE / 터치',scene:'pan',ingredient:'batter',stateKey:'batterAmount',targetAmount:.62,minAmount:.5,maxAmount:.76,overflowAt:.88,rate:.3,asset:'assets/frying-prototype/food/pancake-core.png',animation:'pour-batter',goal:1},
      {interaction:'COOK_TIMING',action:'COOK_TIMING',label:'앞면 굽기',instruction:'반죽이 노릇해져 초록 구간에 오면 눌러요.',successMessage:'뒷면도 구워보자!',inputText:'완벽하게 익었을 때 SPACE · 탭',scene:'pan',ingredient:'pancake',stateKey:'frontCooked',side:'front',rawDuration:.75,perfectStart:3,burnStart:6.4,asset:'assets/frying-prototype/food/pancake-core.png',animation:'cook-surface',goal:1},
      {interaction:'FLIP',action:'FLIP',label:'팬케이크 뒤집기',instruction:'눌러 팬을 당겼다가 앞으로 튕겨 팬케이크를 받아요.',inputText:'SPACE · 화면 탭으로 뒤집기',scene:'pan',ingredient:'pancake',stateKey:'flipped',side:'front',asset:'assets/frying-prototype/food/pancake-core.png',animation:'flip-food',duration:2.1,goal:1},
      {interaction:'COOK_TIMING',action:'COOK_TIMING',label:'뒷면 굽기',instruction:'노릇할 때 눌러요.',inputText:'완벽하게 익었을 때 SPACE · 탭',scene:'pan',ingredient:'pancake',stateKey:'backCooked',side:'back',rawDuration:.65,perfectStart:2.7,burnStart:6.1,asset:'assets/frying-prototype/food/pancake-core.png',animation:'cook-surface',goal:1},
      {interaction:'POINTER_DRAW',action:'POINTER_DRAW',label:'시럽 뿌리기',instruction:'팬케이크 위를 따라 시럽을 그려요.',inputText:'누른 채 마우스 / 손가락으로 그려요',scene:'pan',ingredient:'syrup',stateKey:'syrupStrokes',asset:'assets/frying-prototype/food/pancake-core.png',animation:'draw-syrup',strokeColor:'#a95724',strokeWidth:15,minLength:190,goal:1}
    ]
  }
};
