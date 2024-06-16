import { apiPrivate } from '../../api';
import { TPostUserSignUpRequest } from './types/postSignUp.ts';
import { TPostUserSignInRequest } from './types/postSignIn.ts';
import { TGetRefreshToken } from './types/getRefreshToken.ts';
import { TGetVerifyInviteCode } from './types/getVerifyInviteCode.ts';

export class AuthService {
    static async postSignUp(
        data: TPostUserSignUpRequest['payload'],
        params?: { inviteCode?: string },
    ): Promise<TPostUserSignUpRequest['response']> {
        return apiPrivate.post(
            `/authorization/sign-up${
                params?.inviteCode ? `?inviteCode=${params.inviteCode}` : ''
            }`,
            data,
        );
    }

    static async postSignIn(
        data: TPostUserSignInRequest['payload'],
    ): Promise<TPostUserSignInRequest['response']> {
        return apiPrivate.post('/authorization/sign-in', data);
    }

    static async refreshToken(): Promise<TGetRefreshToken['response']> {
        return apiPrivate.get('/authorization/refreshToken');
    }

    static async postLogOut() {
        return apiPrivate.post('/authorization/sign-in');
    }

    static async getVerifyInviteCode(
        data: TGetVerifyInviteCode['payload'],
    ): Promise<TGetVerifyInviteCode['response']> {
        return apiPrivate.get(`/authorization/verifyInviteCode/${data.code}`);
    }
}
