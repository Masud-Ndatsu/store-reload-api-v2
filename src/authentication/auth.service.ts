import { IUser } from "../users/user.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IToken, ITokenData } from "./auth.interface";
import userModel from "../users/user.model";
import { genAuthCode } from "../utils/generate-auth-code";
import { sendMail } from "../utils/send-mail";
import { authCodeExpiration } from "../utils/auth-code-expiration";
import {
     InvalidCredentials,
     UserAlreadyExists,
     UserNotFound,
} from "../exceptions";

export class AuthService {
     public users = userModel;

     public async register(userReq: IUser): Promise<any> {
          const { shop_name, password } = userReq;
          const userExits = await this.users.findOne({ shop_name });

          if (userExits) {
               throw new UserAlreadyExists();
          }
          const salt = await bcrypt.genSalt(10);
          const hashPwd = await bcrypt.hash(password, salt);

          const user = await this.users.create({
               ...userReq,
               password: hashPwd,
          });

          const tokenData = this.createToken(user);
          const cookie = this.createCookie(tokenData);

          return {
               user,
               cookie,
               token: tokenData.token,
          };
     }
     public async login(userReq: IUser) {
          const { shop_name, password } = userReq;
          const [userExits] = await this.users.aggregate([
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

          if (!userExits) {
               throw new UserNotFound();
          }

          const vp = await bcrypt.compare(password, userExits.password);

          if (!vp) {
               throw new InvalidCredentials();
          }

          const tokenData = this.createToken(userExits);
          const cookie = this.createCookie(tokenData);
          delete userExits.password;
          return {
               cookie,
               user: userExits,
               token: tokenData.token,
          };
     }

     public resetPassword = async (userReq: any) => {
          const { email } = userReq;
          const userExits = await this.users.findOne({ email });

          if (!userExits) {
               throw new UserNotFound();
          }

          const code = genAuthCode(6);
          const expires = authCodeExpiration();

          await Promise.all([
               sendMail({
                    email: userExits.email,
                    subject: "Password Recovery/Reset",
                    message: `Dear User you have recetly requested to change your password, provide this code to proceed: ${code}.`,
               }),

               this.users.findOneAndUpdate(
                    {
                         _id: userExits._id,
                    },
                    {
                         auth_code: code,
                         auth_code_expires: expires,
                    }
               ),
          ]);
          return;
     };
     public resetPasswordVerifyCode = async (userReq: {
          code: string;
          email: string;
     }) => {
          const { code, email } = userReq;

          const user = await this.users.findOne({
               email,
               auth_code: code,
               auth_code_expires: { $gt: new Date() },
          });

          if (!user) {
               throw new UserNotFound();
          }
          return {
               user,
          };
     };
     public resetPasswordChange = async (userReq: any) => {
          const { email, password, confirm_password } = userReq;

          if (password !== confirm_password) {
               throw new InvalidCredentials();
          }

          const userExits = await this.users.findOne({ email });

          if (!userExits) {
               throw new UserNotFound();
          }

          const salt = await bcrypt.genSalt(10);
          const hashPwd = await bcrypt.hash(password, salt);

          await this.users.findOneAndUpdate(
               {
                    _id: userExits._id,
               },
               {
                    password: hashPwd,
               }
          );
          return;
     };

     public createToken(user: any): ITokenData {
          const expiresTime = 60 * 60;
          const secret = process.env.JWT_SECRET!;

          const payload: IToken = {
               _id: user._id,
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
