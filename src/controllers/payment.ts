import { stripe } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility_class.js";


export const createPaymentIntent=TryCatch(async(req,res,next)=>{
    const {amount}=req.body;
    if(!amount){
        return next(new ErrorHandler("Please enter Amount",400));
    }
    const paymentIntent=await stripe.paymentIntents.create({amount:Number(amount*100),currency:"inr"});
    // if(!paymentIntent) return next(new ErrorHandler("hello",200));
    return res.status(201).json({success:true,clientSecret:paymentIntent.client_secret,})
})

export const newCoupon=TryCatch(async(req,res,next)=>{
    const {code,amount}=req.body;
    const coupon=await Coupon.create({code,amount});
    if(!coupon||!amount){
        return next(new ErrorHandler("Please enter all the fields",400));
    }
    return res.status(201).json({success:true,message:`Coupon ${code} created Successfully`})
});

export const applyDiscount=TryCatch(async(req,res,next)=>{
    const {coupon}=req.query;
    const discount=await Coupon.findOne({code:coupon});
    if(!discount){
        return next(new ErrorHandler("Invalid coupon code",400));
    }
    return res.status(200).json({success:true,discount:discount.amount})
});

export const allCoupons=TryCatch(async(req,res,next)=>{
    const coupons=await Coupon.find({});
    return res.status(200).json({success:true,coupons})
});

export const deleteCoupon=TryCatch(async(req,res,next)=>{
    const {id}=req.params;
    const coupon=await Coupon.findByIdAndDelete(id);
    if(!coupon){
        return next(new ErrorHandler("Invalid Coupon ID",400));
    }
    return res.status(200).json({success:true,message:`Coupon ${coupon?.code} deleted Successfully`})
});