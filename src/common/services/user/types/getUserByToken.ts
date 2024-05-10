import { TRequest, TUser } from '../../types.ts';

export type TGetUserByToken = TRequest<any, TResponse>;

type TResponse = TUser;
