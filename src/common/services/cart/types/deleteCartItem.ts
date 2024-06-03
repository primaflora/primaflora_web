import { TRequest } from '../../types.ts';

export type TDeleteCartItem = TRequest<TPayload, any>

type TPayload = {
    uuid: string;
}