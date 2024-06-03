import { TRequest } from '../../types';
import { TCategory } from './common';

export type TGetAllRequest = TRequest<null, TResponse>;

type TResponse = Array<TCategory>;
