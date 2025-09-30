import { TRequest } from '../../types.ts';

export type TSubcategoryWithProducts = {
    subcategory: {
        id: number;
        uuid: string;
        name: string;
        image: string;
        order: number;
        parentOrder: number;
    };
    products: TProductShort[];
};

type TProductShort = {
    id: number;
    uuid: string;
    photo_url: string;
    price_currency: number;
    price_points: number;
    percent_discount: number;
    rating: number;
    commentsCount: number;
    title: string;
    shortDesc: string;
    isPublished: boolean;
    inStock: boolean;
};

export type TGetRandomBySubcategories = TRequest<void, TSubcategoryWithProducts[]>;