export interface IUser {
     _id: string;
     first_name: string;
     last_name: string;
     email: string;
     gender: string;
     avatar: string;
     phone_number: string;
     verified: boolean;
     user_type: string;
     shop_name: string;
     password: string;
     LGA: string;
     NIN: string;
     address: string;
     auth_code: string;
     auth_code_expires: Date;
     reset_token: string;
}
