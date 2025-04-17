const express = require('express')
const { readdirSync } = require('fs')
const app = express()
const cookieParser = require('cookie-parser')
const { configDotenv } = require('dotenv').config()
const cors = require('cors')
const body = require('body-parser')
const { Server } = require('socket.io');
const sequelize = require('./app/connection/sequelize')
const users = require('./app/models/users')
const otp = require('./app/models/otp')
const specialization = require('./app/models/specialization')
const doctors = require('./app/models/doctors')
const doctorsAvailability = require('./app/models/doctorsAvailability')
const healthCentre = require('./app/models/healthCentre')
const disease = require('./app/models/disease')


const port = process.env.SERVER_PORT || 9000

app.use(express.json())
app.use(
    cors({
        origin: '*',
    }),
)


app.use(body.json({ limit: '10mb' }))
app.use(body.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))


readdirSync('./app/routes').map((route) =>
    app.use('/api', require('./app/routes/' + route))
)
const http = require('http')

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`New socket connected: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room: ${roomId}`);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', ({ roomId, offer }) => {
        socket.to(roomId).emit('offer', { sender: socket.id, offer });
    });

    socket.on('answer', ({ roomId, answer }) => {
        socket.to(roomId).emit('answer', { sender: socket.id, answer });
    });

    socket.on('ice-candidate', ({ roomId, candidate }) => {
        socket.to(roomId).emit('ice-candidate', { sender: socket.id, candidate });
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
})
app.listen(port, () => console.log(`listening to port:${process.env.SERVER_PORT} `))