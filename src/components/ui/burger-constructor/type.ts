import {
  TBun,
  TConstructorIngredient,
  TIngredient,
  TOrder
} from '@utils-types';

// Тип для булочки
// export interface TBun {
//   _id: string;
//   name: string;
//   price: number;
//   image: string;
//   type: 'bun';
// }

// Полный тип constructorItems
export interface ConstructorItems {
  bun: TBun | null;
  ingredients: TConstructorIngredient[];
}

export type BurgerConstructorUIProps = {
  constructorItems: ConstructorItems;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
