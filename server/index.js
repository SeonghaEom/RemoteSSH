// server/index.js

'use strict';

const express = require('express');
const fs = require('fs');
// const morgan = require('morgan');
const path = require('path');

const app = express();
const cors = require('cors');

// var options = {
//     key:  fs.readFileSync('../ryans-key.pem'),
//     cert: fs.readFileSync('../ryans-cert.pem')
// };

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const https = require('https').createServer(options, app);
// const io = require('socket.io')(https);


const PORT = process.env.PORT || 9000; // use 9000 port
// const PORT = 443;
// const PORT2 = 443;

var corsOptions = {
  origin: 'https://remote-ssh.herokuapp.com',
  //  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, '../build')));
app.get('/health', function(req, res) {
  res.send('Hello Sir')
})
// app.get('/', (req, res, next) => res.sendFile(__dirname + '../public/index.html'));
// app.use('/static', express.static(__dirname + '/public'));

Set.prototype.intersection = function(setB) {
  var intersection = new Set();
  for (var elem of setB) {
    if (this.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
}

// Socket
const users = {};

const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", roomID => {
      console.log(socket.id, "join room", roomID);
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(socketID => socketID !== socket.id);
        console.log("users in this room ", usersInThisRoom);
        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        console.log("socketToRoom ", socketToRoom);
        console.log("users ", users);
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(socket.id, "is disconnected socketToRoom", socketToRoom);
        
        const roomID = socketToRoom[socket.id];
        let room = users[roomID]; //all connected peer sockets
        if (room) {
            room = room.filter(socketID => socketID !== socket.id);
            console.log("room ", room);
            users[roomID] = room;
            room.forEach(socketID => {
              io.to(socketID).emit("user left", socket.id);
            })
        }
        console.log("disconnect users", users);
    });

});

http.listen(PORT, () => {

  console.log(`App listening on port ${PORT}!`);

});



// send createdRooms and socketList
// app.get('/otherrooms', (req, res) => {
//   res.send({
//     "rooms": createdRooms,
//     "users": socketList,
//   });
// });

app.get('/room-list', (req, res) => {
  // const rawRoomIds = Object.keys(io.sockets.adapter.rooms);
  // res.json([...new Set(rawRoomIds).intersection(new Set(createdRooms))]);
  res.json(users);
});
