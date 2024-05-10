import { apiPrivate } from '../../api';
import { TGetProductsByQuery, TProduct } from './types';
import { TGetProductById } from './types/getProductById.ts';
import { TResponse } from '../types.ts';

export class ProductService {
    static async getAllByQuery(params: TGetProductsByQuery['payload']): Promise<TGetProductsByQuery['response']> {
        return apiPrivate.get('/products/getAll', { params });
    }

    static async getOneById(params: TGetProductById['payload']): Promise<TGetProductById['response']> {
        return apiPrivate.get(`/products/get/${params.uuid}`);
    }

    static async getAll(): TResponse<TProduct[]> {
        return apiPrivate.get('/products/getAll');
    }
}