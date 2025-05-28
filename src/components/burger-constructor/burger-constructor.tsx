import React, { FC, useMemo } from 'react';
import store, {
  RootState,
  useDispatch,
  useSelector
} from '../../services/store';
import { TConstructorIngredient } from '../../utils/types';
import { BurgerConstructorUI } from '../ui/burger-constructor';
import {
  createOrder,
  clearCurrentOrder
} from '../../services/slices/orders-slice';
import { clearConstructor } from '../../services/slices/constructor-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.constructorBurger);
  const orderRequest = useSelector((state) => state.orders.loading);
  const orderModalData = useSelector((state) => state.orders.currentOrder);
  const user = useSelector((state: RootState) => state.user.user);

  console.log('Constructor state snapshot:', store.getState());

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    const ids = constructorItems.ingredients.map((item) => item._id);
    const ingredientIds = [
      constructorItems.bun._id,
      ...ids,
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds)).then((action) => {
      if (createOrder.fulfilled.match(action)) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;
    const fillingPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
      0
    );
    return bunPrice + fillingPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
