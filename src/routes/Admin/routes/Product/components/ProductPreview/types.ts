import { RawDraftContentState } from "draft-js";
import { TProduct } from "../../../../../../common/services/product";

export type TProductPreviewProps = {
    descriptionRaw?: RawDraftContentState;
    card: Partial<TProduct> | undefined;
}