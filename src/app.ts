//importing routes
import express from "express";
import userRoute from "./routes/user.js"//user wali app
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import productRoute from "./routes/products.js"
import orderRoute from "./routes/order.js"
import NodeCache from "node-cache"
import {config} from "dotenv"
import morgan from "morgan"
import paymentRoute from "./routes/payment.js"
import dashboardRoute from "./routes/stats.js"
import Stripe from "stripe";
import cors from "cors"


config({
    path:"./.env"
});

const port=process.env.PORT||3000;
const mongoURI=process.env.MONGO_URI || "";
const stripeKey=process.env.STRIPE_KEY||"";


connectDB(mongoURI);
export const stripe=new Stripe(stripeKey);
export const myCache=new NodeCache();


const app=express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
//routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/payment",paymentRoute);
app.use("/api/v1/dashboard",dashboardRoute);





app.get("/",(req,res)=>{
    res.send("working!");
});

//to create a static folder in express
app.use("/uploads",express.static("uploads"));
app.use(errorMiddleware);
app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port}`)
})