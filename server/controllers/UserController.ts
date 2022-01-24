import { Response } from "express";
import mongoose from "mongoose";
import HttpException from "../exceotions/HttpException";
import User from "../models/User";
import UserService from "../services/UserService";

class UserController {

    async reg(req: any, res: Response) {
        const { googleId, username } = req.body;
        try {
            const newUser = await UserService.reg(googleId, username);
            return res.json(newUser);
        } catch (err) {
            res.status(err.statusCode ?? 500).json({ mesasge: err.message });
        }

    }
}

export default new UserController();
