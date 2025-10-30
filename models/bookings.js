// models/booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  event: { type: String, required: true, trim: true },
  ticketType: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model("Booking", bookingSchema);
