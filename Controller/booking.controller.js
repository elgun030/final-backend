import Booking from "../Models/booking.model.js";
import Event from "../Models/event.model.js";

export const bookSeat = async (req, res) => {
  const { userId, eventId, seatNumbers, quantity } = req.body;

  if (
    !userId ||
    !eventId ||
    !seatNumbers ||
    seatNumbers.length === 0 ||
    !quantity
  ) {
    console.log("Invalid request body:", req.body);
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    let successfullyBooked = [];
    let failedToBook = [];

    for (const seatNumber of seatNumbers) {
      const seat = event.availableSeats.find(
        (seat) =>
          seat.seatNumber &&
          seatNumber &&
          seat.seatNumber.toLowerCase() === seatNumber.toLowerCase()
      );

      if (!seat) {
        failedToBook.push({ seatNumber, reason: "Seat not found" });
        continue;
      }

      if (seat.isBooked) {
        failedToBook.push({ seatNumber, reason: "Seat already booked" });
        continue;
      }

      const existingBooking = await Booking.findOne({
        userId,
        eventId,
        seatNumber,
      });

      if (existingBooking) {
        failedToBook.push({
          seatNumber,
          reason: "Already booked by this user",
        });
        continue;
      }

      seat.isBooked = true;
      successfullyBooked.push(seatNumber);
    }

    await event.save();

    const newBookings = successfullyBooked.map((seatNumber) => ({
      userId,
      eventId,
      seatNumber,
      status: "booked",
      quantity,
    }));

    await Booking.insertMany(newBookings);

    res.status(201).json({
      message: "Seats booking completed",
      successfullyBooked,
      failedToBook,
    });
  } catch (error) {
    console.error("Error booking seats:", error);
    res.status(500).json({
      message: "Error booking seats",
      error: error.message,
    });
  }
};

export const getUserBookings = async (req, res) => {
  const { userId } = req.params;

  try {
    const bookings = await Booking.find({ userId }).populate(
      "eventId",
      "name date price"
    );

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        message: "No bookings found for this user",
      });
    }

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

export const getBookingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).populate("eventId");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

export const deleteBooking = async (req, res) => {
  const { userId, bookingId } = req.params;

  try {
    // Kullanıcının belirli bir rezervasyonunu buluyoruz
    const booking = await Booking.findOne({ _id: bookingId, userId });

    if (!booking) {
      return res.status(404).json({
        message:
          "Booking not found or you do not have permission to delete this booking",
      });
    }

    // İlgili event üzerinde rezervasyon yapılan koltuğu "isBooked" olarak false yapıyoruz
    const event = await Event.findById(booking.eventId);

    if (event) {
      const seat = event.availableSeats.find(
        (seat) =>
          seat.seatNumber.toLowerCase() === booking.seatNumber.toLowerCase()
      );

      if (seat) {
        seat.isBooked = false;
        await event.save(); // Event'teki değişiklikleri kaydediyoruz
      }
    }

    // Rezervasyonu siliyoruz
    await Booking.deleteOne({ _id: bookingId });

    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Error deleting booking",
      error: error.message,
    });
  }
};
