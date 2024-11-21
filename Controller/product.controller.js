import Product from "../Models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, image } = req.body;

    if (!name || price === undefined || !image) {
      return res
        .status(400)
        .json({ message: "All fields (name, price, image) are required" });
    }

    const newProduct = new Product({ name, price, image });
    await newProduct.save();

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Error in createProduct:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getSingleProduct:", error);
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, price, image } = req.body;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (image !== undefined) updateData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in editProduct:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    const userId = req.user.id;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItemIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      user.cart[existingItemIndex].quantity += quantity;

      await user.save();

      return res.status(200).json({ message: "Cart updated", cart: user.cart });
    } else {
      const newItem = { productId, quantity };

      user.cart.push(newItem);

      await user.save();

      return res
        .status(200)
        .json({ message: "Item added to cart", cart: user.cart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error adding item to cart" });
  }
};
