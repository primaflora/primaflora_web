import { TBasicDataBaseData, TRequest } from '../../types.ts';
import { TProduct } from '../../product';

export type TDeleteLike = TRequest<TPayload, TResponse>

type TPayload = {
    productUuid: string
}

type TResponse = {
    product: TProduct
} & TBasicDataBaseData