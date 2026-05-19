const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { generateEbookDownloadUrl } = require("../../helpers/cloudinary");

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const preference = new Preference(client);

    const preferenceData = {
      items: cartItems.map((item) => ({
        id: item.productId,
        title: item.title,
        unit_price: Number(
          (item.salePrice > 0 ? item.salePrice : item.price).toFixed(2),
        ),
        quantity: item.quantity,
        currency_id: "ARS",
      })),
      back_urls: {
        success: `${process.env.CLIENT_URL}/shop/payment-success`,
        failure: `${process.env.CLIENT_URL}/shop/payment-failure`,
        pending: `${process.env.CLIENT_URL}/shop/payment-pending`,
      },
      notification_url: `${process.env.SERVER_URL}/api/shop/order/webhook`,
    };

    const preferenceResponse = await preference.create({
      body: preferenceData,
    });

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod: "mercadopago",
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      approvalURL: preferenceResponse.init_point,
      orderId: newOrder._id,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error al crear la orden",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    const payment = new Payment(client);
    const paymentInfo = await payment.get({ id: paymentId });

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    if (paymentInfo.status === "approved") {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paymentId = paymentId;
    } else {
      order.paymentStatus = paymentInfo.status;
    }

    // Descontar stock solo para físicos
    for (let item of order.cartItems) {
      if (item.type !== "ebook") {
        let product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Producto no encontrado: ${item.title}`,
          });
        }
        product.totalStock -= item.quantity;
        await product.save();
      }
    }

    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Pago confirmado",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error al capturar el pago",
    });
  }
};

const generateEbookDownloadLink = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    if (order.paymentStatus !== "paid") {
      return res.status(403).json({
        success: false,
        message: "El pago no fue confirmado",
      });
    }

    const cartItem = order.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!cartItem || cartItem.type !== "ebook") {
      return res.status(404).json({
        success: false,
        message: "Ebook no encontrado en la orden",
      });
    }

    const product = await Product.findById(productId);
    if (!product?.ebookFile) {
      return res.status(404).json({
        success: false,
        message: "Archivo del ebook no encontrado",
      });
    }

    const { url, expiresAt } = generateEbookDownloadUrl(product.ebookFile);

    res.status(200).json({
      success: true,
      url,
      expiresAt,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error al generar el link",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron órdenes",
      });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Orden no encontrada",
      });
    }

    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  generateEbookDownloadLink,
};
