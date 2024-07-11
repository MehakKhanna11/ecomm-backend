import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility_class.js";
import { myCache } from "../app.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    } = req.body;
    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subtotal ||
      !tax ||
      // !shippingCharges ||
      // !discount ||
      !total
    ) {
      return next(new ErrorHandler("Please enter all the fields", 400));
    }
    const order = await Order.create({
      shippingInfo,
      orderItems,
      user,
      subtotal,
      tax,
      shippingCharges,
      discount,
      total,
    });
    await reduceStock(orderItems);
    const temp = order.orderItems.map(i => String(i.productId));
    invalidateCache({
      product: true,
      order: true,
      admin: true,
      userId: user,
      productId: temp,
    });
    res
      .status(201)
      .json({ success: true, message: "Order placed successfully" });
  }
);

export const myOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;
  const key = `my-orders-${user}`;
  let orders;
  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({ user: user });
    myCache.set(key, JSON.stringify(orders));
  }
  res.status(200).json({ success: true, orders });
});

export const allOrders = TryCatch(async (req, res, next) => {
  const key = `all-orders`;
  let orders;
  if (myCache.has(key)) orders = JSON.parse(myCache.get(key) as string);
  else {
    orders = await Order.find({}).populate("user", "name");
    myCache.set(key, JSON.stringify(orders));
  }
  res.status(200).json({ success: true, orders });
});

export const getOrderDetails = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const key = `order-${id}`;
  let order;
  if (myCache.has(key)) order = JSON.parse(myCache.get(key) as string);
  else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    myCache.set(key, JSON.stringify(order));
  }
  res.status(200).json({ success: true, order });
});

export const processOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  if (order.status === "Processing") {
    order.status = "Shipped";
  } else if (order.status === "Shipped") {
    order.status = "Delivered";
  } else {
    order.status = "Delivered";
  }
  await order.save();
  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  res
    .status(200)
    .json({ success: true, message: "Order processed successfully" });
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }
  await order.deleteOne();
  invalidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderId: String(order._id),
  });
  res
    .status(200)
    .json({ success: true, message: "Order deleted successfully" });
});
