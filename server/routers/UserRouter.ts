import express from 'express';
import UserController from '../controllers/UserController';

const userRouter = express.Router();
userRouter.post('/reg', UserController.reg);
userRouter.post('/login', UserController.login);

export default userRouter;