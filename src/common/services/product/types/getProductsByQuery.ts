import { TRequest } from '../../types.ts';
import { TProduct } from './common.ts';
import { TCategory } from '../../category/types';

export type TGetProductsByQuery = TRequest<TPayload, TResponse | Array<TProduct>>

type TPayload = {
    categoryId?: number | null,
    categoryName?: string | null,
    isTop?: boolean | null,
    isRelevant?: boolean | null,
    take?: number | null
}

type TResponse = {
    products: Array<TProduct>
} & TCategory;