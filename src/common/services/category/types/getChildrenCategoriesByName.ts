import { TRequest } from '../../types.ts';
import { TCategory } from './common.ts';

export type TGetChildrenCategoriesByNameRequest = TRequest<null, TResponse>

type TResponse = Array<TCategory> | { categoryId: number, path: string }