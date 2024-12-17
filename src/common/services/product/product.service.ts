import { apiPrivate } from '../../api';
import i18n from '../../i18n/i18n.ts';
import { TResponseWithoutPromise } from '../types.ts';
import { TGetProductsByQuery, TProduct } from './types';
import { TDeleteProductById } from './types/deleteProduct.ts';
import { TGetProductById } from './types/getProductById.ts';
import { TGetProducts } from './types/getProducts.ts';
import { TPatchUpdateProduct } from './types/patchUpdateProduct.ts';
import { TPostCreateComment } from './types/postCreateComment.ts';
import { TPostCreateProductRequest } from './types/postCreateProduct.ts';
import { TPostSetLikeRequest } from './types/postSetLike.ts';

export class ProductService {
    static async getAllByQuery(
        params: TGetProductsByQuery['payload'],
    ): Promise<TGetProductsByQuery['response']> {
        return apiPrivate.get('/products/getAll', { params });
    }

    static async findAll(): Promise<TGetProducts['response']> {
        return apiPrivate.get('/products/getAll', { 
            headers: { 
                'Accept-Language': i18n.language, 
            } 
        });
    }

    static async getOneByUid(
        params: TGetProductById['payload'],
    ): Promise<TGetProductById['response']> {
        return apiPrivate.get(`/products/getWithComments/${params.uuid}`, {
            headers: {
                'Accept-Language': i18n.language,
            },
        });
    }

    static async getAll(): Promise<TResponseWithoutPromise<TProduct[]>> {
        return apiPrivate.get(`/products/like`);
    }

    static async update(
        data: TPatchUpdateProduct['payload']
    ): Promise<TPatchUpdateProduct['response']> {
        console.log(data.toUpdate)
        return apiPrivate.patch(
            `/products/update/${data.productUid}`, 
            data.toUpdate,
            {
                headers: {
                    'Accept-Language': i18n.language,
                }
            }
        );
    }

    static async setLike(
        params: TPostSetLikeRequest['payload'],
    ): Promise<TPostSetLikeRequest['response']> {
        return apiPrivate.post(`/products/like/${params.productUuid}`);
    }

    static async create(data: TPostCreateProductRequest['payload']): Promise<TPostCreateProductRequest['response']> {
        return apiPrivate.post('/products/create', data);
    }

    static async delete(data: TDeleteProductById['payload']): Promise<TDeleteProductById['response']> {
        return apiPrivate.delete(`/products/${data.uuid}`);
    }

    static async createComment(data: TPostCreateComment['payload']): Promise<TPostCreateComment['response']> {
        return apiPrivate.post(`/products/createComment/${data.productId}`, { text: data.text, rating: Number(data.rating) });
    }
}
