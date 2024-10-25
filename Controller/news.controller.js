import News from "../Models/news.model.js"; // Model dosyanızın yoluna göre ayarlayın

// Tüm haberleri al
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Tek bir haberi al
export const getSingleNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// Yeni haber oluştur
export const createNews = async (req, res) => {
  const { title, image } = req.body;

  if (!title || !image) {
    return res.status(400).json({ message: "Title and image are required" });
  }

  const news = new News({
    title,
    image,
  });

  try {
    const savedNews = await news.save();
    res.status(201).json(savedNews);
  } catch (error) {
    res.status(500).json({ message: "Error creating news", error });
  }
};

// Haberi güncelle
export const editNews = async (req, res) => {
  const { title, image } = req.body;

  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { title, image },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(500).json({ message: "Error updating news", error });
  }
};

// Haberi sil
export const deleteNews = async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting news", error });
  }
};
