import Gallery from "../Models/gallery.model.js";

export const getAllGallery = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Sayfa numarasını alır, varsayılan 1
  const limit = parseInt(req.query.limit) || 7; // Sayfa başına görüntülenecek öğe sayısı, varsayılan 7
  const skip = (page - 1) * limit; // Hangi veriler atlanacak?

  try {
    const totalCount = await Gallery.countDocuments(); // Toplam belge sayısı
    const galleries = await Gallery.find()
      .skip(skip) // Atlanacak veriler
      .limit(limit); // Sadece belirtilen sayıda veri al

    res.status(200).json({
      galleries,
      totalCount, // Toplam veri sayısı
      totalPages: Math.ceil(totalCount / limit), // Toplam sayfa sayısı
      currentPage: page, // Şu anki sayfa
    });
  } catch (err) {
    res.status(500).json({
      message: "Veriler alınırken bir hata oluştu",
      error: err.message,
    });
  }
};

// Tek bir galeri resmini getirir
export const getSingleGallery = async (req, res) => {
  const { id } = req.params; // Parametre olarak ID alıyoruz
  try {
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Galeri resmi bulunamadı" });
    }
    res.status(200).json(gallery);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Resim alınırken bir hata oluştu", error: err.message });
  }
};

// Yeni bir galeri resmi ekler
export const createGallery = async (req, res) => {
  const { Image } = req.body; // Gelen istekten Image alınıyor
  try {
    const newGallery = new Gallery({ Image });
    await newGallery.save();
    res
      .status(201)
      .json({ message: "Galeri resmi başarıyla eklendi", gallery: newGallery });
  } catch (err) {
    res.status(500).json({
      message: "Galeri resmi eklenirken bir hata oluştu",
      error: err.message,
    });
  }
};

// Mevcut bir galeri resmini düzenler
export const editGallery = async (req, res) => {
  const { id } = req.params; // Parametre olarak ID alıyoruz
  const { Image } = req.body; // Güncellenmiş resim
  try {
    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { Image },
      { new: true }
    );
    if (!updatedGallery) {
      return res.status(404).json({ message: "Galeri resmi bulunamadı" });
    }
    res.status(200).json({
      message: "Galeri resmi başarıyla güncellendi",
      gallery: updatedGallery,
    });
  } catch (err) {
    res.status(500).json({
      message: "Galeri resmi güncellenirken bir hata oluştu",
      error: err.message,
    });
  }
};

// Galeri resmini siler
export const deleteGallery = async (req, res) => {
  const { id } = req.params; // Parametre olarak ID alıyoruz
  try {
    const deletedGallery = await Gallery.findByIdAndDelete(id);
    if (!deletedGallery) {
      return res.status(404).json({ message: "Galeri resmi bulunamadı" });
    }
    res.status(200).json({ message: "Galeri resmi başarıyla silindi" });
  } catch (err) {
    res.status(500).json({
      message: "Galeri resmi silinirken bir hata oluştu",
      error: err.message,
    });
  }
};
