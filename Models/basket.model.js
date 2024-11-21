import mongoose from "mongoose";

// Cart Schema
const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

CartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce((acc, item) => {
    return acc + (item.productId.price * item.quantity || 0);
  }, 0);
  next();
});

CartSchema.pre("updateOne", function (next) {
  if (this._update.items) {
    this._update.totalAmount = this._update.items.reduce((acc, item) => {
      return acc + (item.productId.price * item.quantity || 0);
    }, 0);
  }
  next();
});

export default mongoose.model("Cart", CartSchema);
