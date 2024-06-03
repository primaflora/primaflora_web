import { TLike } from '../../likes/index.ts';
import { TRequest } from '../../types.ts';

export type TPostSetLikeRequest = TRequest<TPayload, TLike>;

type TPayload = {
    productUuid: string;
};
