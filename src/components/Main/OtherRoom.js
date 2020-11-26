import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import socket from '../../socket';

const OtherRoom = (props) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData(){
      await fetch('http://3.35.238.94:9000/otherrooms')
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