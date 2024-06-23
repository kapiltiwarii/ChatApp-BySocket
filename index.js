const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const app = express();
const server = createServer(app);
const io = new Server(server);
app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('index')
})
let users = {}
io.on('connection',(socket)=>{
  socket.on('join',(username)=>{
    users[socket.id]=username
    socket.broadcast.emit('user connected',username)
    io.emit('update users',Object.values(users));
  })
  socket.on('chat message', (msg) => {
    const messageData = {
        username: users[socket.id],
        message: msg
    };
    io.emit('chat message', messageData);
});

socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('user disconnected', username);
    io.emit('update users', Object.values(users));
    // console.log('user disconnected');
});
})
server.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});