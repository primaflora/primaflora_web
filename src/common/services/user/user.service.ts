import { apiPrivate } from '../../api/index.ts';
import { TGetUserByToken } from './types/getUserByToken.ts';
import { TPatchUpdateRequest } from './types/patchUpdate.ts';
import { TPostActivateRequest } from './types/postActivate.ts';

export class UserService {
    static async getUserByToken(): Promise<TGetUserByToken['response']> {
        return apiPrivate.get('/user');
    }

    static async postActivate(
        data: TPostActivateRequest['payload'],
    ): Promise<TPostActivateRequest['response']> {
        return apiPrivate.post(`/user/activate/${data.code}`);
    }

    static async patchUpdate(data: TPatchUpdateRequest['payload']): Promise<TPatchUpdateRequest['response']> {
        return apiPrivate.patch('/user', data);
    }
}
