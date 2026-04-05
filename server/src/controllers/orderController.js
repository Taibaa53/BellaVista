import { prisma } from "../lib/prisma.js";
import { sendOrderEmailToAdmin } from "../services/email.js";

export async function createOrder(req, res, next) {
  try {
    const {
      customerName,
      phone,
      address,
      orderType,
      items,
      totalAmount,
    } = req.body;

    if (!customerName || !phone || !orderType || !Array.isArray(items)) {
      return res.status(400).json({
        error: "customerName, phone, orderType, and items[] are required",
      });
    }

    if (orderType === "Delivery" && (!address || !String(address).trim())) {
      return res
        .status(400)
        .json({ error: "address is required for delivery orders" });
    }

    const total = Number(totalAmount);
    if (Number.isNaN(total) || total < 0) {
      return res.status(400).json({ error: "invalid totalAmount" });
    }

    const order = await prisma.order.create({
      data: {
        customerName: String(customerName).trim(),
        phone: String(phone).trim(),
        address:
          orderType === "Delivery"
            ? String(address).trim()
            : null,
        orderType,
        items,
        totalAmount: total,
      },
    });

    const created = {
      ...order,
      createdAt: order.createdAt.toISOString(),
    };

    try {
      await sendOrderEmailToAdmin(created);
    } catch (emailErr) {
      console.error("[email] Failed:", emailErr.message);
    }

    res.status(201).json(order);
  } catch (e) {
    next(e);
  }
}

export async function listOrders(_req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (e) {
    next(e);
  }
}
