import axios from "axios";
import { TPostCreateInvoice } from "./types/postCreateInvoice";

export class MonobankService {
    static async createInvoice(
        data: TPostCreateInvoice['payload']
    ): Promise<TPostCreateInvoice['response']> {
        return axios.post('https://api.monobank.ua/api/merchant/invoice/create',
        {
            amount: data.amount,
            ccy: 980,
            destination: "Покупка щастя",
            comment: "Покупка щастя",
            basketOrder: data.baskets
        },
        {
            headers: {
                "X-Token": "uTeF1vPr1X4BchCZeWTf7idkieDitJFcci-9vzHGT6uY",
            }
        });
    }
}