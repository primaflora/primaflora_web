import { TRequest } from '../../types.ts';
import { TLike } from './common.ts';

export type TGetLikes = TRequest<null, TLike[]>