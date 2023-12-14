import { Request, Express } from "express";
import { Types } from "mongoose";
export interface IProduct {
     _id: string;
     name: string;
     description: string;
     category: Types.ObjectId;
     type: string;
     images: string[];
     price: number;
     tags: string[];
     inventory: number;
     manufacturer: string;
     ratings: object[];
     featured: boolean;
     is_active: boolean;
     reviews: string[];
}
