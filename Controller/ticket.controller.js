import Ticket from "../Models/ticket.model.js";
import User from "../Models/user.model.js";
import Event from "../Models/events.model.js";

export const createTicket = async (req, res) => {
  try {
    const { name, table, limit, price, createdBy, eventId } = req.body;

    console.log("Received data:", req.body); // Gelen veriyi kontrol et

    // Verilerin geçerliliğini kontrol et
    if (!name || !table || !limit || !price || !createdBy || !eventId) {
      return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
    }

    // Etkinliği kontrol et
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Etkinlik bulunamadı." });
    }

    // Yeni Ticket objesini oluştur
    const newTicket = new Ticket({
      name,
      table,
      limit,
      price,
      createdBy,
      eventId, // Etkinliği ilişkilendiriyoruz
      remaining: limit, // Başlangıçta remaining, limit kadar olacak
    });

    // Bileti veritabanına kaydet
    await newTicket.save();

    // Başarı mesajı ve yeni bilet verisini gönder
    res.status(201).json({
      message: "Bilet başarıyla oluşturuldu.",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error during ticket creation:", error); // Hata logu
    res.status(500).json({ error: error.message });
  }
};

export const buyTicket = async (req, res) => {
  try {
    const { ticketId, userId } = req.body;

    if (!ticketId || !userId) {
      return res.status(400).json({ error: "ticketId ve userId gereklidir." });
    }

    const ticket = await Ticket.findById(ticketId).populate("eventId"); // Etkinlikle birlikte ticket'ı bul
    if (!ticket) {
      return res.status(404).json({ error: "Bilet bulunamadı." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Kullanıcı bulunamadı." });
    }

    // Bilet limitini kontrol et ve satın alma işlemini yap
    if (ticket.remaining > 0) {
      ticket.remaining -= 1; // Bilet satıldı, remaining değeri azaltılacak

      // users dizisini kontrol et ve kullanıcıyı ekle
      if (!ticket.users) {
        ticket.users = []; // Eğer users dizisi tanımlı değilse, başlatıyoruz
      }

      ticket.users.push(userId); // Kullanıcıyı ticket'ın users dizisine ekle

      await ticket.save(); // Biletin kalan sayısı güncelleniyor

      res.status(200).json({ message: "Bilet başarıyla alındı." });
    } else {
      res.status(400).json({ error: "Bilet kalmadı." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listTickets = async (req, res) => {
  try {
    const { userId } = req.body;

    // Admin kontrolü
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Yönetici yetkiniz yok." });
    }

    // Tüm biletleri al
    const tickets = await Ticket.find().populate("eventId"); // Etkinlik bilgisiyle birlikte biletleri al

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ error: "Hiç bilet bulunamadı." });
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const { userId } = req.params;

    // Kullanıcıya ait biletleri veritabanından al
    const tickets = await Ticket.find({ users: userId });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ error: "Kullanıcının hiç bileti yok." });
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const checkAdmin = async (req, res, next) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: "Yönetici yetkiniz yok." });
  }

  next();
};

// ticket.controller.js

export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId, status } = req.body;

    if (!ticketId || !status) {
      return res.status(400).json({ error: "ticketId ve status gereklidir." });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Bilet bulunamadı." });
    }

    ticket.status = status; // Biletin durumunu güncelle
    await ticket.save();

    res.status(200).json({ message: "Bilet durumu güncellendi." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventTickets = async (req, res) => {
  const { eventId } = req.params;
  console.log("Received eventId:", eventId); // eventId'yi log'layın

  try {
    const tickets = await Ticket.find({ eventId });
    console.log("Tickets found:", tickets); // Bulunan biletleri log'layın

    if (tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this event." });
    }

    return res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching tickets." });
  }
};
