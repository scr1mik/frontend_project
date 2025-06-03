import { rootReducer } from './root-reducer';
import { ingredientsReducer } from './slices/ingredients-slice';
import { feedReducer } from './slices/feeds-slice';
import { ordersReducer } from './slices/orders-slice';
import { userReducer } from './slices/user-slice';
import { constructorReducer } from './slices/constructor-slice';

describe('rootReducer', () => {
  it('возвращает initial state каждого слайса при неизвестном экшене', () => {
    const globalState = rootReducer(undefined, { type: '' });

    expect(globalState.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '' })
    );

    expect(globalState.feed).toEqual(feedReducer(undefined, { type: '' }));

    expect(globalState.orders).toEqual(ordersReducer(undefined, { type: '' }));

    expect(globalState.user).toEqual(userReducer(undefined, { type: '' }));

    expect(globalState.constructorBurger).toEqual(
      constructorReducer(undefined, { type: '' })
    );
  });
});
