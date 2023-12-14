import { Schema, model } from "mongoose";
import { IUser } from "./user.interface";

const schema = new Schema<IUser>({
     first_name: {
          type: String,
          trim: true,
     },
     last_name: {
          type: String,
          trim: true,
     },
     avatar: {
          type: String,
     },
     email: {
          type: String,
          trim: true,
     },
     phone_number: {
          type: String,
          trim: true,
     },
     verified: {
          type: Boolean,
          default: false,
     },
     user_type: {
          type: String,
     },
     NIN: {
          type: String,
          trim: true,
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
          trim: true,
     },
     LGA: {
          type: String,
          trim: true,
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
