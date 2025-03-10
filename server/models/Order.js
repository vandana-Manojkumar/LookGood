// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: String,
//   cartId: String,
//   cartItems: [
//     {
//       productId: String,
//       title: String,
//       image: String,
//       price: String,
//       quantity: Number,
//     },
//   ],
//   addressInfo: {
//     addressId: String,
//     address: String,
//     city: String,
//     pincode: String,
//     phone: String,
//     notes: String,
//   },
//   orderStatus: String,
//   paymentMethod: String,
//   paymentStatus: String,
//   discount: Number,
//   totalAmount: Number,
//   orderDate: Date,
//   orderUpdateDate: Date,
//   paymentId: String,
//   payerId: String,
// });

// module.exports = mongoose.model("Order", OrderSchema);







const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  addressInfo: {
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["paypal", "stripe", "cash"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0
  },
  promoCode: {
    type: String,
    default: null
  },
  freeGift: {
    type: Number,
    default: null
  },
  orderDate: {
    type: Date,
    default: Date.now,
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
});

module.exports = mongoose.model("Order", OrderSchema);