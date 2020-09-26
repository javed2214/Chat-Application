const express = require('express')
const app = express()

const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listning on Port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket.IO

const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log("Connected...")

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    // socket.on('disconnect', (msg) => {
    //     socket.broadcast.emit('disconnect', msg);
    //     delete msg.user
    // });
})