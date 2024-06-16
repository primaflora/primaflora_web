import { TRequest } from '../../types.ts';

export type TPatchUpdateRequest = TRequest<Partial<TPayload>, null>

type TPayload = {
    name: string;
    phone: string;
    email: string;
    login: string;
    password1: string;
    password2: string;
}