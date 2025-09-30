import { apiPrivate } from './api';

export interface ProductWatchDto {
    uuid: string;
    userUuid: string;
    productUuid: string;
    createdAt: string;
    isNotified: boolean;
    notifiedAt: string | null;
}

export interface CreateProductWatchDto {
    productUuid: string;
}

export interface IsWatchingResponse {
    isWatching: boolean;
}

export class ProductWatchAPI {
    static async addWatch(productUuid: string): Promise<ProductWatchDto> {
        const response = await apiPrivate.post('/product-watch', {
            productUuid
        });
        return response.data;
    }

    static async removeWatch(productUuid: string): Promise<{ message: string }> {
        const response = await apiPrivate.delete(`/product-watch/${productUuid}`);
        return response.data;
    }

    static async getUserWatches(): Promise<ProductWatchDto[]> {
        const response = await apiPrivate.get('/product-watch/my-watches');
        return response.data;
    }

    static async isWatching(productUuid: string): Promise<IsWatchingResponse> {
        const response = await apiPrivate.get(`/product-watch/is-watching/${productUuid}`);
        return response.data;
    }

    static async getAvailableWatchedProducts(): Promise<any[]> {
        const response = await apiPrivate.get('/product-watch/available-products');
        return response.data;
    }

    static async markAsViewed(productUuid: string): Promise<{ message: string }> {
        const response = await apiPrivate.post(`/product-watch/mark-viewed/${productUuid}`);
        return response.data;
    }

    static async markAllAsViewed(): Promise<{ message: string }> {
        const response = await apiPrivate.post('/product-watch/mark-all-viewed');
        return response.data;
    }
}