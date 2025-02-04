
import mongoose from "mongoose";


const carSchema = new mongoose.Schema({
    model: { type: String, required: true },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    imageUrl: { type: String },
    description: { type: String },
});


export const Car = mongoose.model('Car', carSchema, 'rent');


