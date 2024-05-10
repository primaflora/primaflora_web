import { TUser } from '../../../../common/services';
import { TCategory } from '../../../../common/services/category/types';
import { TProduct } from '../../../../common/services/product';

export type CartElem = {
    quantity: number;
    productId: string;
}

export type TInitialState = {
    user: TUser | null;
    categories: TCategory[];
    products: TProduct[];
}