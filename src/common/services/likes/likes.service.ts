import { apiPrivate } from '../../api';
import { TSetLike } from './types/setLike.ts';
import { TGetLikes } from './types/getLikes.ts';
import { TDeleteLike } from './types/deleteLike.ts';
import i18n from '../../i18n/i18n.ts';

export class LikesService {
    // Old method. Use setLike in Product service instead.
    static async setLike(params: TSetLike['payload']): Promise<TSetLike['response']> {
        return apiPrivate.get(`/like/${params.productUuid}`);
    }

    static async getLikes(): Promise<TGetLikes['response']> {
        return apiPrivate.get('/like/likes', {
            headers: {
                'Accept-Language': "ukr",
            },
        });
    }

    static async deleteLike(params: TDeleteLike['payload']): Promise<TDeleteLike['response']> {
        return apiPrivate.delete(`/like/${params.productUuid}`);
    }
}