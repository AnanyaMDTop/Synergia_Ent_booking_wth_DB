// server.js
import express from "express";
import { connectDB } from "./config/db.js";
import { Booking } from "./models/bookings.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json()); // middleware to parse JSON body

// Connect MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Synergia Event Booking API");
});

// 1️⃣ GET all bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// 3️⃣ POST create new booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;

    if (!name || !email || !event) {
      return res
        .status(400)
        .json({ message: "name, email, and event are required fields" });
    }

    const booking = new Booking({ name, email, event, ticketType });
    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 4️⃣ PUT update booking
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(400).json({ message: "Error updating booking", error: error.message });
  }
});

// 5️⃣ DELETE booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 6️⃣ Search booking by email
app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Please provide email to search" });
    }

    const bookings = await Booking.find({ email });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 7️⃣ Filter booking by event
app.get("/api/bookings/filter", async (req, res) => {
  try {
    const { event } = req.query;
    if (!event) {
      return res.status(400).json({ message: "Please provide event to filter" });
    }

    const bookings = await Booking.find({ event: new RegExp(event, "i") });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 8️⃣ GET booking by ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
