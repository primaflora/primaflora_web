import { apiPrivate } from '../../api';
import { TGetAllRequest } from './types/getAll.ts';
import { TGetCategoryWithProductsRequest } from './types/getCategiryWithProducts.ts';

export class CategoryService {
    // static async postCreate(data: TPostCreateCategoryRequest['payload']): Promise<TPostCreateCategoryRequest['response']> {
    //     return apiPrivate.post('/categories/create', data)
    // }

    // static async getChildren(category: string): Promise<TGetChildrenCategoriesByNameRequest['response']> {
    //     return apiPrivate.get(`/categories/getChildrenOnly/${category}`);
    // }

    // static async getChildrenById(id: number): Promise<TGetChildrenCategoriesByNameRequest['response']> {
    //     return apiPrivate.get(`/categories/getChildrenOnlyById/${id}`);
    // }

    // static async getSiblingsById(id: number): Promise<TGetSiblingsByIdRequest['response']> {
    //     return apiPrivate.get(`/categories/getSiblingsById/${id}`);
    // }

    static async getCategoryWithProducts(
        data: TGetCategoryWithProductsRequest['payload'],
    ): Promise<TGetCategoryWithProductsRequest['response']> {
        return await apiPrivate.get(
            `/categories/findSubcategoryWithProducts/${data.subcategoryId}`,
        );
    }

    static async getAll(): Promise<TGetAllRequest['response']> {
        return await apiPrivate.get('/categories/findAllWithSub');
    }
}
