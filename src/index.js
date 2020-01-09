const express = require('express')
const http = require('http');
const path = require('path')
const socketio = require('socket.io');
const Filter = require('bad-words');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { generateMessage, generateLocationMessages } = require('./utils/messages')
const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3000;
const io = socketio(server)

const fs = require('fs');
const publicDiretoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDiretoryPath))


io.on('connection', (socket) => {
    console.log("new connection found");



    socket.on('join', ({ username, room }, cb) => {

        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return cb(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        cb()
    })

    socket.on('sendMessage', (message, cb) => {
        const filter = new Filter()
        const user = getUser(socket.id);
        if (filter.isProfane(message)) {
            return cb('profanity is not allowed')
        }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        cb('delivered!')

    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
    socket.on('sendLocation', ({ latitude, longitude }, cb) => {
        const user = getUser(socket.id)
        const url = `https://google.com/maps?q=${latitude},${longitude}`
        io.to(user.room).emit('locationMessage', generateLocationMessages(user.username, url))
        cb('location shared')
    })
})

server.listen(port, () => {
    console.log("server started on port", port);
})