import { apiPrivate } from '../../api';
import i18n from '../../i18n/i18n.ts';
import { TGetAllRequest } from './types/getAll.ts';
import { TGetCategoryWithProductsRequest } from './types/getCategiryWithProducts.ts';

export class CategoryService {
    static async getCategoryWithProducts(
        data: TGetCategoryWithProductsRequest['payload'],
    ): Promise<TGetCategoryWithProductsRequest['response']> {
        return await apiPrivate.get(
            `/categories/findSubcategoryWithProducts/${data.subcategoryId}`,
            {
                headers: {
                    'Accept-Language': i18n.language,
                },
            }    
        );
    }

    static async getAll(): Promise<TGetAllRequest['response']> {
        return await apiPrivate.get('/categories/findAllWithSub', {
            headers: {
                'Accept-Language': i18n.language,
            },
        });
    }
}
