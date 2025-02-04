import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['in-progress', 'confirmed', 'rejected', 'pending'], 
        default: 'pending' 
    },
});

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation; 
