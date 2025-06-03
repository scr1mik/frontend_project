import { expect, test, describe } from '@jest/globals';
import { fetchIngredients, ingredientsReducer } from './ingredients-slice';
import { configureStore } from '@reduxjs/toolkit';
import * as api from '../../utils/burger-api';

const setupStore = () =>
  configureStore({
    reducer: {
      ingredients: ingredientsReducer
    }
  });

describe('Тесты thunk fetchIngredients', () => {
  test('при rejected с undefined payload устанавливается дефолтная ошибка', () => {
    const store = setupStore();

    store.dispatch({
      type: fetchIngredients.rejected.type,
      payload: undefined,
      error: { message: 'some error' }
    });

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch ingredients');
  });
  test('fetchIngredients успешно получает ингредиенты', async () => {
    const store = setupStore();

    const mockedData = [
      {
        _id: '1',
        name: 'Test Ingredient',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 7,
        calories: 50,
        price: 100,
        image: 'image.png',
        image_mobile: 'image_mobile.png',
        image_large: 'image_large.png'
      }
    ];
    jest.spyOn(api, 'getIngredientsApi').mockResolvedValue(mockedData);

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.items).toEqual(mockedData);
  });

  test('fetchIngredients обрабатывает ошибку', async () => {
    const store = setupStore();

    const errorMessage = 'Ошибка сети';
    jest
      .spyOn(api, 'getIngredientsApi')
      .mockRejectedValue(new Error(errorMessage));

    await store.dispatch(fetchIngredients());

    const state = store.getState().ingredients;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.items).toEqual([]);
  });
});
