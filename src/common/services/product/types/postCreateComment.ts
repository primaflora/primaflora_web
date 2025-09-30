import { TRequest } from '../../types.ts';
import { TComment } from './common.ts';

export type TPostCreateComment = TRequest<TPayload, TComment>

type TPayload = {
    text: string;
    rating: number;
}