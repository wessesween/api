import express from 'express';
import { Car } from '../models/carModel.js';
import multer from 'multer';
import path from 'path';
import Reservation from "../models/reservation.js";


const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));  
  }
});

const upload = multer({ storage: storage });




router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error });
    }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const car = await Car.findById(id);
      if (!car) {
          return res.status(404).json({ message: 'Car not found' });
      }
      res.status(200).json(car);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching car details', error });
  }
});


router.get('/reserved-cars', async (req, res) => {
  try {
      const reservedCars = await Car.find({ availability: false }); 
      return res.status(200).json(reservedCars);
  } catch (error) {
      console.error('Error fetching reserved cars:', error);
      return res.status(500).json({ error: 'Error fetching reserved cars' });
  }
});

router.post("/reserve", async (req, res) => {
  try {
      console.log("Received reservation request:", req.body); // Логируем данные запроса

      const { carId, startDate, endDate, totalPrice } = req.body;

      // Проверяем, пришли ли все данные
      if (!carId || !startDate || !endDate || !totalPrice) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      // Проверяем, есть ли машина
      const car = await Car.findById(carId);
      if (!car) {
          return res.status(404).json({ message: "Car not found" });
      }

      // Создаем новую бронь
      const newReservation = new Reservation({
          car: carId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          totalPrice,
      });

      console.log("Saving reservation:", newReservation); // Лог перед сохранением

      await newReservation.save(); // Сохраняем в базу данных

      // Обновляем статус машины
      car.availability = false;
      await car.save();

      res.status(201).json({ message: "Car reserved successfully", newReservation });
  } catch (error) {
      console.error("Error reserving car:", error);
      res.status(500).json({ message: "Server error", error });
  }
});


router.post('/', upload.single('image'), async (req, res) => {
  console.log('Request body:', req.body);
  const { model, price, availability, description } = req.body;
  
  // Create full URL for the image
  const imageUrl = req.file 
    ? `http://localhost:5555/uploads/${req.file.filename}`
    : null;
    
  const parsedPrice = parseFloat(price);

  try {
      const newCar = new Car({
          model,
          price: parsedPrice,
          availability,
          imageUrl,  // This will now store the complete URL
          description
      });

      await newCar.save();
      res.status(201).json(newCar);
  } catch (error) {
      console.error('Error adding car:', error);
      res.status(500).json({ message: 'Error adding car', error });
  }
});


router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { model, price, availability, imageUrl, description } = req.body;

    try {
        const updatedCar = await Car.findByIdAndUpdate(id, {
            model,
            price,
            availability,
            imageUrl,
            description
        }, { new: true });

        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(500).json({ message: 'Error updating car', error });
    }
});
 

router.put("/reservation/:id", async (req, res) => {
  try {
      const reservationId = req.params.id;
      const { startDate, endDate, totalPrice } = req.body;

      
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
          return res.status(404).json({ message: "Reservation not found" });
      }

      
      reservation.startDate = new Date(startDate);
      reservation.endDate = new Date(endDate);
      reservation.totalPrice = totalPrice;

      
      await reservation.save();

      res.status(200).json({ message: "Reservation updated successfully", reservation });
  } catch (error) {
      console.error("Error updating reservation:", error);
      res.status(500).json({ message: "Server error" });
  }
});



router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCar = await Car.findByIdAndDelete(id);

        if (!deletedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }

        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error });
    }
});

export default router;
