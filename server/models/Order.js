const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
    },

    title: {
      type: String,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
    },

    quantity: {
      type: Number,
    },

    productType: {
      type: String,
    },

    downloadUrl: {
      type: String,
    },
  },
  { _id: false },
);

const AddressInfoSchema = new mongoose.Schema(
  {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String,
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
  },

  cartId: {
    type: String,
  },

  cartItems: [CartItemSchema],

  addressInfo: {
    type: AddressInfoSchema,
    default: null,
  },

  orderStatus: {
    type: String,
  },

  paymentMethod: {
    type: String,
  },

  paymentStatus: {
    type: String,
  },

  totalAmount: {
    type: Number,
  },

  orderDate: {
    type: Date,
  },

  orderUpdateDate: {
    type: Date,
  },

  paymentId: {
    type: String,
  },

  payerId: {
    type: String,
  },

  downloadUrlExpiry: {
    type: Date,
  },
});

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
