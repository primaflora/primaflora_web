import { apiPrivate } from '../../api';
import { TResponseWithoutPromise } from '../types.ts';
import { TGetProductsByQuery, TProduct } from './types';
import { TGetProductById } from './types/getProductById.ts';
import { TPostSetLikeRequest } from './types/postSetLike.ts';

export class ProductService {
    static async getAllByQuery(
        params: TGetProductsByQuery['payload'],
    ): Promise<TGetProductsByQuery['response']> {
        return apiPrivate.get('/products/getAll', { params });
    }

    static async getOneByUid(
        params: TGetProductById['payload'],
    ): Promise<TGetProductById['response']> {
        return apiPrivate.get(`/products/getWithComments/${params.uuid}`);
    }

    static async getAll(): Promise<TResponseWithoutPromise<TProduct[]>> {
        return apiPrivate.get(`/products/like`);
    }

    static async setLike(
        params: TPostSetLikeRequest['payload'],
    ): Promise<TPostSetLikeRequest['response']> {
        return apiPrivate.post(`/products/like/${params.productUuid}`);
    }
}
