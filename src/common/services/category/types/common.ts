import { TBasicDataBaseData, TUser } from '../../types.ts';

export type TSubcategory = {
    image: string;
    name: string; // Добавляем прямое поле name
    translate: [{
        language: string;
        name: string;
        desc: string;
    }]
    language: string;
    label?: string;
    labelColor?: string;
} & TBasicDataBaseData;

export type TCategory = {
    name: string;
    name_ukr?: string | null; // Добавляем поддержку name_ukr
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
    inStock: boolean;
    isPublished: boolean;
    categoryIds: number[];
    categories?: TSubcategory[]; // Добавляем опциональное поле для подкатегорий с лейблами
    commentsCount: number;
    like: { id: number; uuid: string } | null;
    descriptionPoints: string[];
    seoTitle?: string;
    seoDescription?: string;
    isFromNotifications?: boolean; // Для товаров из уведомлений
} & TBasicDataBaseData;

export type TComment = {
    text: string;
    rating: number;
    user: TUser;
} & TBasicDataBaseData;

export type TProductFull = {
    desc: string; // a json object of some product properties
    comments: TComment[];
    categories: TSubcategory[];
    canComment?: boolean;
} & TProduct;
