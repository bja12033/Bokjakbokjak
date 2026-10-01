# 팬 볶기 공통 시스템

11개 메뉴 전체의 조리 단계와 입력 방식은 [COOKING_SYSTEM.md](COOKING_SYSTEM.md)를 참고하세요. 이 문서는 볶음밥 팬 토스의 재료 물리와 이미지 교체 방법을 설명합니다.

- `frying-engine.js`: 마우스 입력, 팬 관성, 재료 미끄러짐, 공중 궤적, 회전, 낙하, 반동, 착지. 음식 이름이나 이미지 경로를 포함하지 않습니다.
- `frying-content.js`: 조리 장면 그림, 음식 그림, 재료별 물리 값, 레시피 구성.
- `frying-prototype.js`: 그림 로딩과 화면 입력 연결. `?recipe=레시피ID`로 등록된 레시피를 선택합니다.

## 음식 그림 교체

`frying-content.js`의 `FOOD_IMAGES`에서 `mound`와 재료별 PNG 경로를 교체하세요. 물리 값과 엔진 코드는 그대로 둡니다. 재료 PNG는 투명 배경의 가로 이미지 시트이며, 현재 그림은 같은 크기의 4칸으로 이루어져 있습니다. 새 그림이 한 칸이면 해당 레시피 재료의 `frames`를 `1`로 설정할 수 있습니다. `mound`는 팬 바닥의 음식 밑층 그림입니다.

실행 중에도 다음처럼 로드된 그림만 바꿀 수 있습니다. 이때 재료 위치와 속도는 유지됩니다.

```js
await window.fryingPrototype.useFoodImages({
  mound: 'assets/food/new-mound.png',
  ingredients: {
    rice: 'assets/food/new-rice.png',
    egg: 'assets/food/new-egg.png',
    carrot: 'assets/food/new-carrot.png',
    ham: 'assets/food/new-ham.png',
    scallion: 'assets/food/new-scallion.png'
  }
});
```

다른 음식은 `FRYING_RECIPES`에 재료 종류와 개수를, `FOOD_IMAGES`에 그림 경로를 등록합니다. 새 재료의 질량·마찰·반동 등을 `INGREDIENT_MATERIALS`에 추가하거나 레시피 재료의 `physics`로 덮어쓸 수 있습니다. 엔진의 입력과 운동 계산은 다시 작성할 필요가 없습니다.
