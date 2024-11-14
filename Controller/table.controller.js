import Table from "../Models/table.model.js";
import Ticket from "../Models/ticket.model.js";

export const createTable = async (req, res) => {
  try {
    const { name, capacity, price } = req.body;

    // Verilerin geçerliliğini kontrol et
    if (!name || !capacity || !price) {
      return res.status(400).json({ error: "Lütfen tüm alanları doldurun." });
    }

    // Yeni Table objesini oluştur
    const newTable = new Table({
      name,
      capacity,
      price,
    });

    // Table'ı kaydet
    await newTable.save();

    // Table ile ilişkilendirilmiş yeni Ticket oluştur
    const newTicket = new Ticket({
      name: `${name} Ticket`, // Örnek: Table adı ile Ticket adı oluşturuluyor
      table: newTable._id, // Yeni oluşturulan Table ID'si
      limit: capacity, // Kapasiteyi Ticket'ın limitine koyuyoruz
      price: price, // Fiyatı da Table'ın fiyatından alıyoruz
      createdBy: req.userId, // Admin ID'si (giriş yapan admin)
      remaining: capacity, // Başlangıçta tüm biletler mevcut
      status: "available", // Başlangıçta biletler "available" olacak
    });

    // Ticket'ı kaydet
    await newTicket.save();

    // Table'a oluşturulan Ticket'ı ekle
    newTable.tickets.push(newTicket._id);
    await newTable.save();

    // Başarı mesajı ve oluşturulan Table ile Ticket verilerini gönder
    res.status(201).json({
      message: "Masa ve bilet başarıyla oluşturuldu.",
      table: newTable,
      ticket: newTicket,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Tüm masaları listele
export const listTables = async (req, res) => {
  try {
    const tables = await Table.find();
    res.status(200).json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Belirli bir masanın biletlerini listele
export const getTableTickets = async (req, res) => {
  try {
    const { tableId } = req.params;

    const table = await Table.findById(tableId).populate("tickets");

    if (!table) {
      return res.status(404).json({ error: "Masa bulunamadı." });
    }

    res.status(200).json(table.tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
