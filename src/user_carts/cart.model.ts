import { Schema, model } from "mongoose";
import { ICart } from "./cart.interface";

const schema = new Schema<ICart>({
     product: {
          type: Schema.Types.ObjectId,
          required: true,
     },
     quantity: {
          type: Number,
          required: true,
     },
     user: {
          type: Schema.Types.ObjectId,
          required: true,
     },
});

export default model("carts", schema);
