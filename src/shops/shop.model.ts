import { Schema, model } from "mongoose";
import { IShop } from "./shop.interface";

const schema = new Schema<IShop>({
     shop_name: {
          type: String,
          index: true,
     },
     password: {
          type: String,
          required: true,
     },
     address: {
          type: String,
     },
     LGA: {
          type: String,
     },
     auth_code: {
          type: String,
     },
     auth_code_expires: {
          type: Date,
     },
     reset_token: {
          type: String,
     },
});

export default model("shops", schema);
