const express = require('express')


const app = express()

const http = require('http')
const cors = require('cors')



require('dotenv').config()

// Db connection
require('./config/db.js')

const { Server } = require('socket.io')

// Routes
const ChatRoute = require('./Routes/ChatRoute')
const MessageRoute = require('./Routes/MessageRoute')
const userRoutes = require('./routes/users')

app.use(cors())

// body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.use('/chat',ChatRoute)
app.use('/message',MessageRoute)
app.use('/users', userRoutes)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})


io.on("connection", (socket) => {
    console.log('User Connected :>> ', socket.id);
    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data)
    })
    socket.on("disconnect", () => {
        console.log('User Disconnected :>> ', socket.id);
    })
})


server.listen(3001, () => {
    console.log('server running :>> ');
})

