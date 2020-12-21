import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const OtherRoom = (props) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function fetchData(){
      await fetch('https://96fdeb27f2d7.ngrok.io/otherrooms')
      // await fetch('https://remote-ssh.graymove.com/otherrooms')
        .then(function(response) {
          return response.json();
      }).then((json) => {
        setRooms(json.rooms);
        json.rooms.forEach((room) => {
          console.log(room);
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