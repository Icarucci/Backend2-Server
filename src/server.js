import express from 'express'
import userRouter from './routes/users.routes.js'
import mongoose from 'mongoose'


const app = express()
const PORT = 8080

mongoose.connect('mongodb+srv://ignaciocarucci:EMR0Q9b3rZGViZbd@backend2.y4q03.mongodb.net/?retryWrites=true&w=majority&appName=Backend2')
.then(() => {
    console.log('Conexión exitosa a MongoDB')
})


app.use(express.json())
app.use('/api/users', userRouter)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})


// Rutas
