// Server Side Code

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()

require('./models/db')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const bodyParser = require('body-parser')

require('./passport-config')(passport)

const PORT = process.env.PORT || 3000

const http = app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(flash())

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 3600 * 1000         // 1 hour
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/route'))
app.get('/', (req, res) => {
    res.redirect('/register')
})

// Socket.IO

const io = require('socket.io')(http)
const users = {};
var cnt = 0;
var login_user = ""
const room_map = {};
const online_users = {};
var d;
const flag = {}

io.on('connection', (socket) => {
    // console.log(users)
    
    console.log("Connected...")

    socket.on('new-user-joined', (data, name) => {
        d = data
        if(flag[data.r] == 1){
            online_users[data.r] += 1
        }else{
            flag[data.r] = 1
            online_users[data.r] = 1;
        }
        room_map[socket.id] = data.r
        console.log(online_users)
        console.log(room_map)
        socket.join(data.r);
        console.log(data.r)
        console.log("New User: ", name)
        login_user += name + " "
        cnt += 1
        users[socket.id] = name;
        socket.to(data.r).emit('user-joined', name)
        for (const property in users) {
            console.log(`${property}: ${users[property]}`);
        }
        io.to(socket.id).emit('welcome', name)
        io.in(data.r).emit('onlineusers', online_users[data.r])
        io.in(data.r).emit('roomdata', data.r)
        // io.emit('users-join', users)
    })

    socket.on('message', (msg, data) => {
        socket.to(data.r).emit('message', msg);
        // socket.broadcast.emit('message', msg)
    })

    socket.on('disconnect', name => {
        console.log(users[socket.id]);
        online_users[room_map[socket.id]] -= 1
        socket.to(room_map[socket.id]).emit('left', users[socket.id])
        delete users[socket.id];
        cnt -= 1;
        if(online_users[room_map[socket.id]] == 0){
            delete online_users[room_map[socket.id]]
        }
        io.in(room_map[socket.id]).emit('onlineusers', online_users[room_map[socket.id]])
        delete room_map[socket.id]
        // io.emit('users-left', users)
      });

})