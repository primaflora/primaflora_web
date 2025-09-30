export type TOrderStatus = 'pending' | 'paid' | 'shipped' | 'completed' | 'canceled';

export type TOrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    uuid: string;
    photo_url: string;
    title: string;
    shortDesc: string;
    price_currency: number;
    price_points: number;
  };
};

export type TOrder = {
  id: number;
  uuid: string;
  totalPrice: number;
  status: TOrderStatus;
  createdAt: string;
  updatedAt: string;
  invoiceId: string | null;
  items: TOrderItem[];
};

export type TGetOrderHistoryResponse = TOrder[];