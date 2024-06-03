import { TCartItem } from '../../../../common/services/cart';

export type TCartItemProps = {
    item: TCartItem;
    onQuantityChange: (productUid: string, value: number) => void;
    onRemove: (cartItemUid: string) => void;
};
