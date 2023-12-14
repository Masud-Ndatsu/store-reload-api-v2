import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const schema = new Schema<IOrder>(
     {
          products: [
               {
                    type: Schema.Types.ObjectId,
                    required: true,
               },
          ],
          price: {
               type: Number,
               default: 0,
          },
          user: {
               type: Schema.Types.ObjectId,
               required: true,
          },
          shipping_address: {
               type: String,
          },
          reference: {
               type: String,
          },
     },
     {
          timestamps: true,
     }
);

export const OrderModel = model("orders", schema);
