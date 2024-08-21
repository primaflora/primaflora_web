import { TRequest } from '../../types.ts';

export type TGetProducts = TRequest<TPayload, TResponse>

type TPayload = {
    language: 'rus' | 'urk';
}

export type TProductTable = {
    id: number;
    uuid: string;
    createdAt: string;
    price_currency: number;
    category: {
        id: number;
        uuid: string;
        createdAt: string;
        updatedAt: string;
        image: string;
        name: string;
        language: string;
    };
    title: string;
    language: string;
}
type TResponse = Array<TProductTable>;