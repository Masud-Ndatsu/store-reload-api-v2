import { IShop, IUser } from "../users/user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IToken, ITokenData } from "./auth.interface";
import shopModel from "../shops/shop.model";
import userModel from "../users/user.model";
import { genAuthCode } from "../utils/generate-auth-code";
import { sendMail } from "../utils/send-mail";
import { authCodeExpiration } from "../utils/auth-code-expiration";

export class AuthService {
     public shops = shopModel;
     public users = userModel;

     public async register(userReq: IShop): Promise<any> {
          const { shop_name, password } = userReq;
          const shopExits = await this.shops.findOne({ shop_name });

          if (shopExits) {
               throw new Error("Shop name already exists");
          }
          const salt = await bcrypt.genSalt(10);
          const hashPwd = await bcrypt.hash(password, salt);

          const shop = await this.shops.create({
               ...userReq,
               password: hashPwd,
          });

          const tokenData = this.createToken(shop);
          const cookie = this.createCookie(tokenData);

          await this.users.create({
               shop: shop._id,
          });

          return {
               shop,
               cookie,
               token: tokenData.token,
          };
     }
     public async login(userReq: any) {
          const { shop_name, password } = userReq;
          const [shopExits] = await this.shops.aggregate([
               {
                    $match: {
                         $expr: {
                              $eq: ["$shop_name", shop_name],
                         },
                    },
               },
               {
                    $project: {
                         __v: 0,
                         createdAt: 0,
                         updatedAt: 0,
                    },
               },
          ]);

          if (!shopExits) {
               throw new Error("Shop does not exists");
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

     public resetPassword = async (userReq: any) => {
          const { email } = userReq;
          const userExits = await this.users.findOne({ email });

          if (!userExits) {
               throw new Error("User doesn't exist");
          }

          const code = genAuthCode(6);

          await sendMail({
               email: email,
               subject: "Password Recovery/Reset",
               message: `Dear User you have recetly requested to change your password, provide this code to proceed: ${code}.`,
          });
          const expires = authCodeExpiration();

          await this.shops.findOneAndUpdate(
               {
                    _id: userExits.shop,
               },
               {
                    auth_code: code,
                    auth_code_expires: expires,
               }
          );
          return;
     };
     public resetPasswordVerifyCode = async (userReq: any) => {
          const { code, email } = userReq;

          const user = await this.users.findOne({ email });

          if (!user) {
               throw new Error("");
          }

          const shop = await this.shops.findOne({
               auth_code: code,
               auth_code_expires: { $gt: new Date() },
               _id: user._id,
          });

          if (!shop) {
               throw new Error("");
          }
          return {
               shop,
          };
     };
     public resetPasswordChange = async (userReq: any) => {
          const { email, password, confim_password } = userReq;

          if (password !== confim_password) {
               throw new Error("Invalid password");
          }

          const shopExits = await this.shops.findOne({ email });

          if (!shopExits) {
               throw new Error("Shops not found");
          }

          const salt = await bcrypt.genSalt(10);
          const hashPwd = await bcrypt.hash(password, salt);

          await this.users.findOneAndUpdate(
               {
                    shop: shopExits._id,
               },
               {
                    password: hashPwd,
               }
          );
          return;
     };

     public createToken(shop: any): ITokenData {
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
