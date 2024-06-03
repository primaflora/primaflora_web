import { TUser } from '../../../../common/services';
import { TCategory, TProduct, TSubcategory } from '../../../../common/services/category/types/common';
import { TLike } from '../../../../common/services/likes';

export type CartElem = {
    quantity: number;
    productId: string;
};

export type TInitialState = {
    user: TUser | null;
    likes: TLike[];
    categories: TCategory[];
    products: TProduct[];
    isAuth: boolean;
    pickedSubcategory?: TSubcategory | null;
    pickedProduct?: TProduct | null;
};
