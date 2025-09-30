import { apiPrivate } from '../../api';
import { TGetOrderHistoryResponse } from './types/common';

export class OrderService {
    static async getMyOrderHistory(language: 'ukr' | 'eng' = 'ukr'): Promise<TGetOrderHistoryResponse> {
        const response = await apiPrivate.get('/orders/my-history', {
            headers: {
                'Accept-Language': language,
            },
        });
        return response.data;
    }
}