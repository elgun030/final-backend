import { Event } from "../Models/events.model.js"; // Modeli doğru yolu ile içe aktar
import Table from "../Models/table.model.js";
import Ticket from "../Models/ticket.model.js";

// Tüm etkinlikleri listeleme
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Etkinlikler alınırken bir hata oluştu." });
  }
};

// Tek bir etkinliği alma (ID'ye göre)
export const getSingleEvent = async (req, res) => {
  const { id } = req.params; // Etkinlik ID'sini URL'den al

  try {
    const event = await Event.findById(id)
      .populate("tickets") // Ticket'ları popüle et
      .populate("tables"); // Tables'ı popüle et

    if (!event) {
      return res.status(404).json({ message: "Etkinlik bulunamadı." });
    }

    res.status(200).json(event); // Etkinliği JSON olarak döndür
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Etkinlik alınırken bir hata oluştu." });
  }
};

export const createEvent = async (req, res) => {
  const { name, category, image, date, description, mostWatched, tableName } =
    req.body;

  // Yeni etkinliği oluştur
  const newEvent = new Event({
    name,
    category,
    image,
    date,
    description,
    mostWatched,
  });

  try {
    // Etkinliği kaydet
    const event = await newEvent.save();

    // Masayı oluşturun ve name alanını ekleyin
    const tableNumber = (await Table.countDocuments({ event: event._id })) + 1; // Masa numarası artıyor
    const table = new Table({
      name: tableName || `Table ${event.name} - ${tableNumber}`, // Eğer tableName gelmezse, etkinlik ismi ve numara
      number: tableNumber, // Artırılan numara
      capacity: 1, // Kapasite 1 kişi
      event: event._id, // Etkinlik ID'sini burada ekliyoruz
    });

    // Table'ı kaydedin
    const savedTable = await table.save();

    // Ticket modeline uygun ObjectId'leri ve remaining alanını ekleyin
    const ticket = new Ticket({
      name: `${name} - Ticket`,
      table: savedTable._id, // Şimdi table ID'sini geçiyoruz
      limit: 100,
      price: 50,
      createdBy: "64bba365a5f4939b3b47d1a2", // Geçerli bir admin ID'si (örnek)
      event: event._id, // Etkinlik ID'sini burada ekliyoruz
      remaining: 100, // Remaining alanını doldurun
    });

    // Ticket'ı kaydedin
    const savedTicket = await ticket.save();

    // Etkinlik ve ticket/table ilişkilendirme işlemi
    await Event.findByIdAndUpdate(
      event._id,
      {
        $push: { tickets: savedTicket._id, tables: savedTable._id }, // Ticket ve table ID'lerini etkinliğe ekleyin
      },
      { new: true }
    );

    res.status(201).json({ event, ticket: savedTicket, table: savedTable });
  } catch (error) {
    console.error("Error adding event, ticket, and table:", error);
    res.status(500).json({
      message: "Etkinlik, bilet ve masa eklenirken bir hata oluştu.",
      error: error.message,
    });
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
      return res.status(404).json({ message: "Etkinlik bulunamadı." });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res
      .status(500)
      .json({ message: "Etkinlik güncellenirken bir hata oluştu." });
  }
};

// Etkinliği silme
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Etkinlik bulunamadı." });
    }

    res.status(200).json({ message: "Etkinlik başarıyla silindi." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Etkinlik silinirken bir hata oluştu." });
  }
};
