import { TRequest } from '../../types.ts';

export type TPostCreateComment = TRequest<TPayload, any>

type TPayload = {
    productId: number;
    text: string;
    rating: number;
}