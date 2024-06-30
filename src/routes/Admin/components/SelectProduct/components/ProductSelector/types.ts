import { TProduct } from "../../../../../../common/services/category/types/common"

export type TProductSelectorProps = {
    onProductSelect: (product: TProduct) => void
}