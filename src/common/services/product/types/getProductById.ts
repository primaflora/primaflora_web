import { TProductFull } from '../../category/types/common.ts';
import { TRequest } from '../../types.ts';

export type TGetProductById = TRequest<TPayload, TProductFull | undefined>

type TPayload = {
    uuid: string;
}