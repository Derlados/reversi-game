import { Response } from "express";
import mongoose from "mongoose";
import HttpException from "../exceptions/HttpException";
import User from "../models/User";
import UserService from "../services/UserService";

class UserController {

    async reg(req: any, res: Response) {
        const { googleId, username } = req.body;
        try {
            const newUser = await UserService.reg(googleId, username);
            return res.json(newUser);
        } catch (err) {
            res.status(err.statusCode ?? 500).json({ message: err.message });
        }
    }

    async login(req: any, res: Response) {
        const { googleId } = req.body;
        try {
            const user = await UserService.login(googleId);
            return res.json(user);
        } catch (err) {
            res.status(err.statusCode ?? 500).json({ message: err.message });
        }
    }
}

export default new UserController();
