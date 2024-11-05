import Actor from '../Models/actor.model.js'; // Aktör modelini içe aktar

// Aktör oluşturma
export const createActor = async (req, res) => {
  try {
    const actor = new Actor(req.body);
    await actor.save();
    res.status(201).json(actor);
  } catch (error) {
    res.status(400).json({ message: 'Aktör oluşturulurken bir hata oluştu.', error: error.message });
  }
};

// Tüm aktörleri listeleme
export const getAllActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.status(200).json(actors);
  } catch (error) {
    res.status(500).json({ message: 'Aktörler alınırken bir hata oluştu.', error: error.message });
  }
};

// Belirli bir aktörü alma
export const getActorById = async (req, res) => {
  const { id } = req.params;
  try {
    const actor = await Actor.findById(id);
    if (!actor) {
      return res.status(404).json({ message: 'Aktör bulunamadı.' });
    }
    res.status(200).json(actor);
  } catch (error) {
    res.status(500).json({ message: 'Aktör alınırken bir hata oluştu.', error: error.message });
  }
};

// Aktörü güncelleme
export const updateActor = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedActor = await Actor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedActor) {
      return res.status(404).json({ message: 'Aktör bulunamadı.' });
    }
    res.status(200).json(updatedActor);
  } catch (error) {
    res.status(400).json({ message: 'Aktör güncellenirken bir hata oluştu.', error: error.message });
  }
};

// Aktörü silme
export const deleteActor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedActor = await Actor.findByIdAndDelete(id);
    if (!deletedActor) {
      return res.status(404).json({ message: 'Aktör bulunamadı.' });
    }
    res.status(200).json({ message: 'Aktör başarıyla silindi.' });
  } catch (error) {
    res.status(500).json({ message: 'Aktör silinirken bir hata oluştu.', error: error.message });
  }
};
