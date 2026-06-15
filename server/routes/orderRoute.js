import express from 'express';
import authUser from '../middlewares/authUser.js';
import authSeller from '../middlewares/authSeller.js'
import {getAllOrders,getUserOrders,placeOrderCOD, placeOrderStripe} from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/all', authUser, getAllOrders); 
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;
