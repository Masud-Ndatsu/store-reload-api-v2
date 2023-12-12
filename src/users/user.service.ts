import axios from "axios";
import { UserCodeExpired } from "../exceptions";
import { authCodeExpiration } from "../utils/auth-code-expiration";
import { genAuthCode } from "../utils/generate-auth-code";
import { sendMail } from "../utils/send-mail";
import { IUser } from "./user.interface";
import userModel from "./user.model";

export class UserService {
     public users = userModel;
     public accountSetup = async (userReq: IUser) => {
          const { email, _id: id } = userReq;

          const code = genAuthCode(6);
          const codeExpires = authCodeExpiration();

          const [, user] = await Promise.all([
               sendMail({
                    email,
                    subject: "Verify Your Email Credentials",
                    message: `<p>Dear user. This is your OTP to very user credentials ${code}</p>`,
               }),

               this.users.findOneAndUpdate(
                    { _id: id },
                    {
                         first_name: userReq.first_name ?? "",
                         last_name: userReq.last_name ?? "",
                         email: userReq.email,
                         phone_number: userReq.phone_number ?? "",
                         gender: userReq.gender ?? "",
                         NIN: userReq.NIN ?? "",
                         auth_code: code ?? "",
                         auth_code_expires: codeExpires,
                    }
               ),
          ]);

          const apiReq = {
               email: user?.email,
          };

          await this.createWallet();
          return;
     };

     public createWallet = async () => {
          // const res = await axios.post(
          //      process.env.MONNIFY_BASE_URL!,
          //      {},
          //      {
          //           headers: {},
          //      }
          // );
          // console.log({});
     };

     public async update(userReq: IUser) {}

     public async verify(userReq: IUser) {
          const { auth_code, _id: userId } = userReq;

          const user = await this.users.findOne({
               _id: userId,
               auth_code,
               auth_code_expires: { $gt: Date.now() },
          });

          if (!user) {
               throw new UserCodeExpired();
          }
          await this.users.findOneAndUpdate(
               {
                    _id: userId,
                    auth_code,
               },
               {
                    verified: true,
               }
          );

          return;
     }
}
