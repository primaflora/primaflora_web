import { TProduct } from '../../category/types/common.ts';
import { TBasicDataBaseData } from '../../types.ts';

export type TLike = {
    product: TProduct;
} & TBasicDataBaseData;
