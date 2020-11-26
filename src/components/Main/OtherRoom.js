import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import socket from '../../socket';

const OtherRoom = (props) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData(){
      // await fetch('https://e92d9cbad3d1.ngrok.io/otherrooms')
      await fetch('https://remote-ssh.graymove.com/otherrooms')
        .then(function(response) {
          return response.json();
      }).then((json) => {
        setRooms(json.rooms);
        json.rooms.forEach((room) => {
          console.log(room);
          socket.emit('BE-get-all-users', room);
        })
      })}
    fetchData();
    // console.log(rooms);
    
  }, []);

  return(
    <div> {rooms} </div>
  )
};

export default OtherRoom;