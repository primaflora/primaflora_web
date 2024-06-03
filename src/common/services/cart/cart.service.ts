import { apiPrivate } from '../../api';
import {
    TDeleteCartItem,
    TGetAllCartItemsByUserId,
    TPatchUpdateCartItem,
    TPostCreateCartItem,
} from './types';

export class CartService {
    static async postCreate(
        data: TPostCreateCartItem['payload'],
    ): Promise<TPostCreateCartItem['response']> {
        console.log('payload => ', data);
        return apiPrivate.post('/cart', data);
    }

    static async getAll(): Promise<TGetAllCartItemsByUserId['response']> {
        return apiPrivate.get('/cart/getAll');
    }

    static async patchUpdate(
        data: TPatchUpdateCartItem['payload'],
    ): Promise<TPatchUpdateCartItem['response']> {
        return apiPrivate.patch(`/cart/${data.params.userUuid}`, {
            data: data.payload,
        });
    }

    static async delete(
        params: TDeleteCartItem['payload'],
    ): Promise<TDeleteCartItem['response']> {
        return apiPrivate.delete(`/cart/${params.uuid}`);
    }
}
