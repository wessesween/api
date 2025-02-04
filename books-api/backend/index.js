import express from "express";
import { mongoDBURI, PORT } from "./config.js";
import mongoose from "mongoose";
import carsRoute from './routes/carsRoute.js';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';
import { Car } from "./models/carModel.js";
import Reservation from "./models/reservation.js";
import contactRoutes from './routes/contactRoutes.js'





const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
app.use('/api', contactRoutes);
app.use('/api/contact', contactRoutes);

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.get('/', (req, res) => {
    return res.status(200).send('Welcome to the Car Rental Service!');
});

app.get('/cars/reserved-cars', async (req, res) => {
    try {
        console.log('Fetching reserved cars...');
        // Найти автомобили с availability: false (зарезервированные)
        const reservedCars = await Reservation.find().populate('car');  // Заполняем информацию о машине
        console.log('Reserved cars fetched:', reservedCars);  // Это покажет полную структуру данных
        res.status(200).json(reservedCars);  // Отправка данных клиенту
    } catch (error) {
        console.error('Error fetching reserved cars:', error.message);
        res.status(500).json({ error: error.message });  // Ошибка сервера
    }
});

app.put('/cars/reservation/:id/status', async (req, res) => {
    const { status } = req.body; // Новый статус, который нужно установить
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true } // Вернем обновленный объект
        );

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.json(reservation); // Отправим обновленную резервацию
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.delete('/cars/reservation/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Находим резервацию по ID
        const reservation = await Reservation.findById(id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Удаляем резервацию
        await Reservation.deleteOne({ _id: id });

        // Обновляем статус машины (если нужно вернуть доступность)
        const car = await Car.findById(reservation.car);
        if (car) {
            car.availability = true;
            await car.save();
        }

        res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.error('Error deleting reservation:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});



app.use('/cars', carsRoute);

mongoose.connect(mongoDBURI)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });
