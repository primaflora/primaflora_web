import { TBasicDataBaseData, TUser } from '../../types.ts';

export type TSubcategory = {
    image: string;
    name: string;
    desc: string;
    language: string;
} & TBasicDataBaseData;

export type TCategory = {
    name: string;
    childrens: TSubcategory[];
} & TBasicDataBaseData;

export type TProduct = {
    photo_url: string;
    desc?: string;
    shortDesc?: string;
    price_currency: number;
    price_points: number;
    percent_discount: number;
    rating: number;
    title: string;
    comments: number;
    like: { id: number; uuid: string } | null;
} & TBasicDataBaseData;

export type TComment = {
    text: string;
    rating: string;
    user: TUser;
} & TBasicDataBaseData;

export type TProductFull = {
    desc: string; // a json object of some product properties
    comments: TComment[];
    category: TCategory;
} & TProduct;
