import { TRequest } from '../../types.ts';
import { TProduct, TSubcategory } from './common.ts';

export type TGetCategoryWithProductsRequest = TRequest<TPayload, TResponse>;

type TPayload = {
    subcategoryId: number;
};

type TResponse = {
    products: TProduct[];
} & TSubcategory;
