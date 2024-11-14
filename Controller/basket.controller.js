import Cart from "../Models/basket.model.js";
import Product from "../Models/product.model.js"; // Game yerine Product olarak değiştirildi

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId); // Game yerine Product
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "An internal server error occurred",
    });
  }
};

export const getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await Cart.find({ userId }).populate({
      path: "items.productId",
      select: "image name price", // Ürünün resim, isim ve fiyat bilgileri alınıyor
    });
    res.status(200).json(cartItems);
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
        message: "Invalid data provided!", // Buradaki hata mesajı, gelen verinin yanlış olduğunu belirtiyor
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
        message: "Cart item not found!",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart.items[findCurrentProductIndex], // Güncellenmiş öğe verisini döndürüyoruz
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating cart item",
    });
  }
};

// basket.controller.js

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    // İlgili kullanıcının sepetini bulma ve ürün bilgilerini alma
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

    // Ürünü sepetten filtreleyerek çıkarma
    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    // Sepeti güncelleme
    await cart.save();

    // Güncellenmiş ürün bilgilerini alarak yanıt oluşturma
    const populateCartItems = cart.items.map((item) => ({
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
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the cart item.",
    });
  }
};
