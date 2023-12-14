import { Types } from "mongoose";

export interface IOrder {
     products: Types.ObjectId[];
     price: number;
     user: Types.ObjectId;
     shipping_address: string;
     reference: string;
}
