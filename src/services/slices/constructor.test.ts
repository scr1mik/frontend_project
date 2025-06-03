import { constructorReducer } from './constructor-slice';
import {
  addIngredient,
  removeIngredient,
  moveIngredient
} from './constructor-slice';
import type { TConstructorIngredient } from 'src/utils/types';

describe('constructorSlice reducer', () => {
  const ing1: TConstructorIngredient = {
    _id: '60d3b41abdacab0026a733c9',
    id: 'fixed-id-1',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 1337,
    image: '',
    image_mobile: '',
    image_large: ''
  };
  const ing2: TConstructorIngredient = {
    _id: '60d3b41abdacab0026a733ca',
    id: 'fixed-id-2',
    name: 'Плоды Фалленианского дерева',
    type: 'main',
    proteins: 3,
    fat: 10,
    carbohydrates: 50,
    calories: 30,
    price: 305,
    image: '',
    image_mobile: '',
    image_large: ''
  };

  it('добавляет ингредиент в массив ingredients при dispatch addIngredient', () => {
    const initialState = { bun: null, ingredients: [] };
    const action = { type: addIngredient.type, payload: ing1 };
    const next = constructorReducer(initialState, action);
    expect(next.ingredients).toHaveLength(1);
    expect(next.ingredients[0]).toEqual(ing1);
  });

  it('удаляет ингредиент из массива ingredients по его id при dispatch removeIngredient', () => {
    const state = { bun: null, ingredients: [ing1, ing2] };
    const action = { type: removeIngredient.type, payload: ing1.id };
    const next = constructorReducer(state, action);
    expect(next.ingredients).toHaveLength(1);
    expect(next.ingredients[0]).toEqual(ing2);
  });

  it('меняет порядок элементов в ingredients при dispatch moveIngredient', () => {
    const state = { bun: null, ingredients: [ing1, ing2] };
    const action = {
      type: moveIngredient.type,
      payload: { fromIndex: 0, toIndex: 1 }
    };
    const next = constructorReducer(state, action);
    expect(next.ingredients).toEqual([ing2, ing1]);
  });
});
