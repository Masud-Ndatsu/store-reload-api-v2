import { IShop, IUser } from "../users/user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IToken, ITokenData } from "./auth.interface";
import shopModel from "../shops/shop.model";

export class AuthService {
     public shopUser = shopModel;

     public async register(userReq: IShop) {
          const { shop_name, password } = userReq;
          const userExits = await this.shopUser.findOne({ shop_name });

          if (userExits) {
               throw new Error("User with email already exists");
          }
          const salt = await bcrypt.genSalt(10);
          const hashPwd = await bcrypt.hash(password, salt);

          const shop = await this.shopUser.create({
               ...userReq,
               password: hashPwd,
          });

          const tokenData = this.createToken(shop);
          const cookie = this.createCookie(tokenData);

          return {
               shop,
               cookie,
               token: tokenData.token,
          };
     }
     public async login(userReq: any) {
          const { shop_name, password } = userReq;
          const shopExits = await this.shopUser.findOne({ shop_name });

          if (!shopExits) {
               throw new Error("User with shop name does not exists");
          }

          const vp = await bcrypt.compare(password, shopExits.password);

          if (!vp) {
               throw new Error("Incorrect password");
          }

          const tokenData = this.createToken(shopExits);
          const cookie = this.createCookie(tokenData);

          return {
               cookie,
               shop: shopExits,
               token: tokenData.token,
          };
     }

     private createToken(shop: any): ITokenData {
          const expiresTime = 60 * 5;
          const secret = process.env.JWT_SECRET!;

          const payload: IToken = {
               _id: shop._id,
          };
          return {
               expiresIn: expiresTime,
               token: jwt.sign(payload, secret, { expiresIn: expiresTime }),
          };
     }

     public createCookie(tokenData: ITokenData): string {
          return `Authorization=${tokenData.token}; HttpOnly; MaxAge=${tokenData.expiresIn}`;
     }
}
