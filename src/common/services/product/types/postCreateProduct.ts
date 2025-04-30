import { TRequest } from '../../types.ts';

export type TPostCreateProductRequest = TRequest<TPayload, object>;


type TPayload = TProductPayload;

export type TProductPayload = {
    photo_url: string;
    price_currency: number;
    price_points: number;
    percent_discount: number,
    categoryIds: number[];
    translate: TProductTranslatePayload[];
    isPublished: boolean;
    descriptionPoints: string[];
}

type TProductTranslatePayload = {
    language: string;
    title: string;
    shortDesc: string;
    desc: string;
}