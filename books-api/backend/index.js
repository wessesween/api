import express, { request, response } from "express"
import {mongoDBURI, PORT} from "./config.js"
import mongoose from "mongoose"
import {Book} from './models/bookModel.js'
import booksRoute from './routes/booksRoute.js'
import cors from 'cors'


const app = express()

app.use(express.json())

app.use(cors())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type']
}))

app.get('/', (req, res) => {
    console.log(req)
    return res.status(200).send('Welcome!')
})

app.use('/books', booksRoute)



mongoose.connect(mongoDBURI)
.then(() => {
    console.log('App connected to database')
    app.listen(PORT, () => {
        console.log(`App is listenig port: ${PORT}`)
    })
})
.catch((error) => {
    console.log(error)
})