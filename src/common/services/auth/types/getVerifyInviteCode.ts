import { TRequest, TUser } from '../../types.ts';

export type TGetVerifyInviteCode = TRequest<TPayload, TUser>;

type TPayload = {
    code: string,
}