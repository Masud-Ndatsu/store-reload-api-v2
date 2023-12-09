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
     shop: {
          type: String,
     },
});

export default model("users", schema);
