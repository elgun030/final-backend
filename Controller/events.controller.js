import { Event } from '../Models/events.model.js'; // Modeli doğru yolu ile içe aktar

// Tüm etkinlikleri listeleme
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Etkinlikler alınırken bir hata oluştu.' });
  }
};

// Tek bir etkinliği alma
export const getSingleEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı.' });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Etkinlik alınırken bir hata oluştu.' });
  }
};

// Yeni etkinlik oluşturma
export const createEvent = async (req, res) => {
  const { name, category, image, date, description, mostWatched } = req.body;

  const newEvent = new Event({
    name,
    category,
    image,
    date,
    description,
    mostWatched,
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Etkinlik eklenirken bir hata oluştu.' });
  }
};

// Etkinliği güncelleme
export const editEvent = async (req, res) => {
  const { id } = req.params;
  const { name, category, image, date, description, mostWatched } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        name,
        category,
        image,
        date,
        description,
        mostWatched,
      },
      { new: true } // Güncellenmiş belgeyi döndür
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı.' });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Etkinlik güncellenirken bir hata oluştu.' });
  }
};

// Etkinliği silme
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Etkinlik bulunamadı.' });
    }

    res.status(200).json({ message: 'Etkinlik başarıyla silindi.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Etkinlik silinirken bir hata oluştu.' });
  }
};
