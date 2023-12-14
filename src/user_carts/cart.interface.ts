import { Types } from "mongoose";

export interface ICart {
     _id: string;
     product: Types.ObjectId;
     quantity: number;
     user: Types.ObjectId;
}
