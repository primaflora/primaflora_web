import { TBasicDataBaseData } from '../../types.ts';

export type TComment = {
    id: number;
    text: string;
    rating: number;
    user: {
        name: string;
    };
};

export type TProduct = {
    photo_url: string;
    title: string;
    desc?: string;
    shortDesc?: string;
    price_currency: number;
    price_points: number;
    percent_discount: number;
    rating: number;
    isPublished: boolean;
    inStock: boolean;
    categoryIds: number[];
    descriptionPoints: string[];
    like?: {
        id: number;
        liked: boolean;
    };
    canComment?: boolean;
    comments?: TComment[];
} & TBasicDataBaseData;