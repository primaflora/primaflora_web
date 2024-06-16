import { TRequest, TUser } from '../../types.ts';

export type TGetUserByToken = TRequest<TPayload, TResponse>;

type TPayload = {
    loadInvitedUser?: boolean
}

type TResponse = TUser;
