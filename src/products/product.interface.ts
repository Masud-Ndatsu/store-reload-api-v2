import { Request, Express } from "express";
export interface IProduct {
     _id: string;
     name: string;
     description: string;
     category: string;
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
