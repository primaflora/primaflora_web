import { TRequest } from '../../types.ts';
import { TProduct } from './common.ts';

export type TPatchUpdateProduct = TRequest<TPayload, any>

type TPayload = {
    productUid: string;
    toUpdate: Partial<TProductUpdate>;
}

export type TProductUpdate = {
    translate?: Partial<TProductTranslate>;
} & TProduct;

type TProductTranslate = {
    title: string,
    desc: string,
    shortDesc: string,
    seoTitle?: string,
    seoDescription?: string,
}
