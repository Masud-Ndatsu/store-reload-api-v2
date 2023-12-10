import { UserNotFound } from "../exceptions";
import { genAuthCode } from "../utils/generate-auth-code";
import { sendMail } from "../utils/send-mail";
import { IUser } from "./user.interface";
import userModel from "./user.model";

export class UserService {
     public users = userModel;
     public accountSetup = async (userReq: IUser) => {
          const { email, _id: id } = userReq;
          const code = genAuthCode(6);
          const user = await this.users.findById(id);

          if (!user) {
               throw new UserNotFound();
          }

          await sendMail({
               email,
               subject: "Verify Your Email Credentials",
               message: `<p>Dear . This is your OTP to very user credentials ${code}</p>`,
          });

          await this.users.updateOne(
               { _id: id },
               {
                    ...userReq,
               }
          );

          return;
     };

     private createWallet = async (userReq: any) => {};
}
