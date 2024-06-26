import { apiPrivate } from '../../api';
import i18n from '../../i18n/i18n';
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
        return apiPrivate.get('/cart/getAll', {
            headers: {
                'Accept-Language': i18n.language,
            },
        });
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
