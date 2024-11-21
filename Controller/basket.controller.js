import Cart from "../Models/basket.model.js";
import Product from "../Models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    const productPrice = product.price;
    cart.totalAmount += quantity * productPrice;

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
    });
  }
};

export const getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image name price",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart items" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present!",
      });
    }

    const existingItem = cart.items[findCurrentProductIndex];
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const productPrice = product.price;

    cart.totalAmount -= existingItem.quantity * productPrice;
    existingItem.quantity = quantity;
    cart.totalAmount += existingItem.quantity * productPrice;

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image name price",
    });

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId ? item.productId.price : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the cart item.",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image name price",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    const product = await Product.findById(productId);
    const productPrice = product ? product.price : 0;
    cart.totalAmount -= productPrice;

    await cart.save();

    const populatedItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      name: item.productId ? item.productId.name : "Product not found",
      price: item.productId ? item.productId.price : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatedItems,
      },
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the cart item.",
    });
  }
};
