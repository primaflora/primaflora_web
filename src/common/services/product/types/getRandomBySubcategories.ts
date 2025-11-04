import { TRequest } from '../../types.ts';

export type TSubcategoryWithProducts = {
    subcategory: {
        id: number;
        uuid: string;
        name: string;
        image: string;
        order: number;
        parentOrder: number;
        label?: string;
        labelColor?: string;
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
    categories?: {
        id: number;
        uuid: string;
        label?: string;
        labelColor?: string;
        translate: {
            name: string;
            language: string;
        }[];
    }[];
};

export type TGetRandomBySubcategories = TRequest<void, TSubcategoryWithProducts[]>;