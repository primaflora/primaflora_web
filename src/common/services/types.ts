import { AxiosResponse } from 'axios';

export type TResponse<Response = unknown, Config = unknown> = Promise<
    AxiosResponse<Response, Config>
>;
export type TResponseWithoutPromise<
    Response = unknown,
    Config = unknown,
> = AxiosResponse<Response, Config>;

export type TRequest<TPayload, TRes> = {
    payload: TPayload;
    response: AxiosResponse<TRes>;
};

export type TRequestWithoutPromise<TPayload, TRes> = {
    payload: TPayload;
    response: TResponseWithoutPromise<TRes>;
};

export type TResponseData<Data> = {
    data: Data;
};

export type TBasicDataBaseData = {
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
};

// TODO: move to the specific folder (user or auth)
export type TUser = {
    id: number;
    uuid: string;
    createdAt: Date;
    updatedAt: Date;
    is_activated: boolean;
    password: string;
    name: string;
    phone: string;
    email: string;
    login: string;
    invitationCode: string;
    invitedUser?: TUser;
    phone_allowed: boolean;
    consultation_allowed: boolean;
    role?: TRole | null

};

export type TRole = {
    id: number,
    name: EUserRole
}

export enum EUserRole {
    USER = 'user',
    ADMIN = 'admin',
}