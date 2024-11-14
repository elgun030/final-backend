import NewsSection from "../Models/newsSection.model.js";

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const news = await NewsSection.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single news by id
export const getSingleNews = async (req, res) => {
  try {
    const news = await NewsSection.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new news
export const createNews = async (req, res) => {
  const { image, title, subtitle } = req.body;

  // Validate request
  if (!image || !title || !subtitle) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newNews = new NewsSection({
      image,
      title,
      subtitle,
    });

    await newNews.save();
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Edit news by id
export const editNews = async (req, res) => {
  const { image, title, subtitle } = req.body;

  try {
    const news = await NewsSection.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    news.image = image || news.image;
    news.title = title || news.title;
    news.subtitle = subtitle || news.subtitle;

    await news.save();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete news by id
export const deleteNews = async (req, res) => {
  try {
    const news = await NewsSection.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    await news.remove();
    res.status(200).json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
