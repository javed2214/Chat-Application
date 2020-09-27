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
const users = {};
var cnt = 0;
var login_user = ""

io.on('connection', (socket) => {
    // console.log(users)
    
    console.log("Connected...")

    socket.on('new-user-joined', name => {
        console.log("New User: ", name)
        login_user += name + " "
        cnt += 1
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
        for (const property in users) {
            console.log(`${property}: ${users[property]}`);
        }
        io.to(socket.id).emit('welcome', name)
        io.emit('onlineusers', cnt)
        io.emit('users-join', users)
    })

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect', name => {
        console.log(users[socket.id]);
        socket.broadcast.emit('left', users[socket.id])
        delete users[socket.id];
        cnt -= 1;
        io.emit('onlineusers', cnt)
        io.emit('users-left', users)
      });

})
