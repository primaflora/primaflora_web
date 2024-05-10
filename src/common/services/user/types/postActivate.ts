import { TRequest, TUser } from '../../types';

export type TPostActivateRequest = TRequest<TPayload, TResponse>;

type TPayload = {
    code: string;
};

type TResponse = TUser;
