// Replace paths in FOOD_IMAGES to change the food art. Motion code stays untouched.
// Each ingredient PNG is a transparent horizontal sheet of four equal cells.
// A single-cell image is also supported by setting that ingredient's frames to 1.
export const SCENE_IMAGES={
  background:'assets/frying-prototype/kitchen-background.png',
  pan:'assets/frying-prototype/empty-red-pan.png',
  rightHand:'assets/frying-prototype/right-hand.png',
  leftHand:'assets/frying-prototype/left-hand.png'
};

export const FOOD_IMAGES={
  friedRice:{
    mound:'assets/frying-prototype/food/fried-rice-mound.png',
    ingredients:{
      rice:'assets/frying-prototype/food/rice.png',
      egg:'assets/frying-prototype/food/egg.png',
      carrot:'assets/frying-prototype/food/carrot.png',
      ham:'assets/frying-prototype/food/ham.png',
      scallion:'assets/frying-prototype/food/scallion.png'
    }
  }
};

// Physical behavior is independent of the images above.
export const INGREDIENT_MATERIALS={
  rice:{mass:.42,gravity:980,friction:5.5,tossStrength:1.08,rotationAmount:.55,rotationSpeed:3.5,bounce:.20,drag:.30,followDelay:.06,scatterAmount:18,liftVariation:28,size:[25,19]},
  carrot:{mass:.85,gravity:1120,friction:6.5,tossStrength:.93,rotationAmount:1.4,rotationSpeed:4.2,bounce:.28,drag:.16,followDelay:.11,scatterAmount:43,size:[33,28]},
  ham:{mass:.93,gravity:1080,friction:5.7,tossStrength:.90,rotationAmount:1.1,rotationSpeed:3.8,bounce:.19,drag:.13,followDelay:.12,scatterAmount:39,size:[36,27]},
  scallion:{mass:.32,gravity:870,friction:5.2,tossStrength:1.20,rotationAmount:1.6,rotationSpeed:5.7,bounce:.15,drag:.38,followDelay:.05,scatterAmount:62,size:[29,24]},
  egg:{mass:.48,gravity:970,friction:5.7,tossStrength:1.05,rotationAmount:.9,rotationSpeed:3.2,bounce:.16,drag:.26,followDelay:.08,scatterAmount:48,size:[32,24]},
  onion:{mass:.66,gravity:950,friction:5.9,tossStrength:1.02,rotationAmount:1.1,rotationSpeed:4.3,bounce:.16,drag:.24,followDelay:.08,scatterAmount:39,size:[18,17],color:'#f5e6c1'},
  pepper:{mass:.53,gravity:900,friction:5.2,tossStrength:1.16,rotationAmount:1.5,rotationSpeed:5.2,bounce:.19,drag:.32,followDelay:.06,scatterAmount:48,size:[20,19],color:'#469b30'},
  meat:{mass:.96,gravity:1110,friction:5.9,tossStrength:.89,rotationAmount:1.2,rotationSpeed:3.6,bounce:.17,drag:.13,followDelay:.12,scatterAmount:36,size:[22,20],color:'#ef8e91'}
};

// New food can define its own ingredient list and image set with the same engine.
export const FRYING_RECIPES={
  friedRice:{id:'friedRice',name:'볶음밥',ingredients:[
    {type:'rice',count:780,spread:.84,frames:4},
    {type:'egg',count:45,spread:.91,frames:4},
    {type:'carrot',count:38,spread:.91,frames:4},
    {type:'ham',count:29,spread:.91,frames:4},
    {type:'scallion',count:36,spread:.91,frames:4}
  ]}
};
