import { TRequest } from '../../types.ts';

export type TDeleteProductById = TRequest<TPayload, any>

type TPayload = {
    uuid: string;
}