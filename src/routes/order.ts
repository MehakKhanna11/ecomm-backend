import express from "express"
import { adminOnly } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, processOrder } from "../controllers/order.js";


const app=express.Router();

//route /api/v1/user/new
app.post("/new",newOrder);


app.get("/my",myOrders);

app.get("/all",adminOnly,allOrders);

app.route("/:id").get(getOrderDetails).put(adminOnly,processOrder).delete(adminOnly,deleteOrder);

export default app;
