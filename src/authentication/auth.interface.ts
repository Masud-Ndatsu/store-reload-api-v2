import { Request } from "express";
import { IUser } from "../users/user.interface";

export interface IToken {
     _id: string;
}

export interface ITokenData {
     token: string;
     expiresIn: number;
}

export interface IRequestWithUser extends Request {
     user?: IUser;
}
