export interface ICart {
     _id: string;
     product: string;
     quantity: number;
     user: string;
}

export interface IOrder {
     products: string[];
     price: number;
     user: string;
     shipping_address: string;
     reference: string;
}
