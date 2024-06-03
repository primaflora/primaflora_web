import { apiPrivate } from '../../api';
import { TSetLike } from './types/setLike.ts';
import { TGetLikes } from './types/getLikes.ts';
import { TDeleteLike } from './types/deleteLike.ts';

export class LikesService {
    // Old method. Use setLike in Product service instead.
    static async setLike(params: TSetLike['payload']): Promise<TSetLike['response']> {
        return apiPrivate.get(`/like/${params.productUuid}`);
    }

    static async getLikes(): Promise<TGetLikes['response']> {
        return apiPrivate.get('/like/likes');
    }

    static async deleteLike(params: TDeleteLike['payload']): Promise<TDeleteLike['response']> {
        return apiPrivate.delete(`/like/${params.likeUuid}`);
    }
}