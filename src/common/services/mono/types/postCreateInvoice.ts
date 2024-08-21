import { TRequest } from "../../types";

export type TPostCreateInvoice = TRequest<TPayload, TResponse>;

type TPayload = {
    baskets: Array<TBasket>
    amount: number
}

type TBasket = {
    name: string,
    qty: number,
    sum: number,
    icon: string,
    unit: string,
    code: string,
}

type TResponse = {
    invoiceId: string,
    pageUrl: string;
}