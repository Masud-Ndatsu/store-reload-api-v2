import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const schema = new Schema<IUser>({
     first_name: {
          type: String,
     },
     last_name: {
          type: String,
     },
     avatar: {
          type: String,
     },
     email: {
          type: String,
     },
     phone_number: {
          type: String,
     },
     verified: {
          type: Boolean,
     },
     user_type: {
          type: String,
     },
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

export default model("users", schema);
