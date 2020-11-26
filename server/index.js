// server/index.js

'use strict';

const express = require('express');
const fs = require('fs');
// const morgan = require('morgan');
const path = require('path');

const app = express();
const cors = require('cors');


const https = require('http').createServer(app);
const io = require('socket.io')(https);


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


let createdRooms = {};



// Setup logger
// app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));



// Serve static assets
// app.use(express.static(path.resolve(__dirname, '..', 'build')));


// Always return the main index.html, so react-router render the route in the client
//   모든 request에 대해서 build폴더 아래 index.html을 보내도록 되어 있는데,
//       이부분을 수정하여 server side 프로그래밍을 한다.



// Socket
io.on('connection', (socket) => {
  console.log(`New User connected: ${socket.id}`);

  socket.on('disconnect', (roomId) => {
    if (createdRooms[roomId]){
      createdRooms[roomId].splice(socket.id, 1);
    }
    socket.disconnect();

    console.log('User disconnected!', createdRooms);

  });

  socket.on('BE-check-user', ({ roomId, userName }) => {
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (createdRooms[roomId][client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error: error, roomId: roomId, userName: userName });
    });
  });

  /**
   * Join Room
   */
  socket.on('BE-join-room', ({ roomId, userName }) => {
    // Socket Join RoomName

    socket.join(roomId);
    // socketList[socket.id] = { userName, video: true, audio: true };
    if (typeof createdRooms[roomId] == "undefined"){
      createdRooms[roomId] = { } // create new room
    }

    createdRooms[roomId][socket.id] = { userName, video: true, audio: true };
    console.log("be-join-room createdRooms ", createdRooms);
    // console.log("io sockets", io.sockets);
    // Set User List
    io.sockets.in(roomId).clients((err, clients) => {
      try {
        console.log("clients ", clients, "in room ", roomId);
        const users = [];
        clients.forEach((client) => {
          // Add User List
          users.push({ userId: client, info: createdRooms[roomId][client] });
        });
        // console.log("all users ", users);
        socket.broadcast.to(roomId).emit('FE-user-join', users);
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit('FE-error-user-exist', { err: true, roomId: roomId, userName: userName });
      }
    });
  });

  socket.on('BE-get-all-users', (roomId) => {
    io.sockets.in(roomId).clients((err, clients) => {
      try {
        const users = [];
        console.log(clients);
        clients.forEach((client) => {
          // Add User List
          users.push({ userId: client, info: createdRooms[roomId][client] });
        });
        console.log("all users in", roomId, users);
        socket.emit('FE-show-all-users', {roomId: roomId, users: users});
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {

      }
    });
  })

  socket.on('BE-call-user', ({ userToCall, from, signal, roomId }) => {
    io.to(roomId).emit('FE-receive-call', {
      signal,
      from,
      info: createdRooms[roomId][socket.id],
      roomId: roomId,
    });
  });

  socket.on('BE-accept-call', ({ signal, to }) => {
    io.to(to).emit('FE-call-accepted', {
      signal,
      answerId: socket.id,
    });
  });

  // socket.on('BE-send-message', ({ roomId, msg, sender }) => {
  //   io.sockets.in(roomId).emit('FE-receive-message', { msg, sender });
  // });

  socket.on('BE-leave-room', ({ roomId, leaver }) => {
    delete createdRooms[roomId][leaver];
    socket.broadcast
        .to(roomId)
        .emit('FE-user-leave', { userId: socket.id, userName: leaver });
    io.sockets.sockets[leaver].leave(roomId);
  });

  // socket.on('BE-toggle-camera-audio', ({ roomId, switchTarget }) => {
  //   if (switchTarget === 'video') {
  //     socketList[socket.id].video = !socketList[socket.id].video;
  //   } else {
  //     socketList[socket.id].audio = !socketList[socket.id].audio;
  //   }
  //   socket.broadcast
  //       .to(roomId)
  //       .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
  // });
});

https.listen(PORT, () => {

  console.log(`App listening on port ${PORT}!`);

});



// send createdRooms and socketList
app.get('/otherrooms', (req, res) => {
  res.send({
    "rooms": createdRooms,
    "users": socketList,
  });
});

app.get('/room-list', (req, res) => {
  // const rawRoomIds = Object.keys(io.sockets.adapter.rooms);
  // res.json([...new Set(rawRoomIds).intersection(new Set(createdRooms))]);
  res.json(Object.keys(createdRooms));
});
