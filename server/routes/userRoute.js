import express from 'express';
import { register, login, isAuth, logout } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', logout);
userRouter.get('/is-auth', authUser, isAuth);

export default userRouter;
