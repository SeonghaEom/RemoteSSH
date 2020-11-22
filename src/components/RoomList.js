import React, {useEffect, useState} from "react";
import firestore from "../config/fbconfig";
import { useHistory } from 'react-router-dom';
import socket from '../socket';

const RoomList = () => {

    const [roomList, setRoomList] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
      async function fetchData(){
        await fetch('http://localhost:9000/room-list')
          .then(function(response) {
            return response.json();
        }).then((json) => {
          setRoomList(json);
          json.forEach((roomId) => {
            socket.emit('BE-get-all-users', roomId);
          })
        })}
      fetchData();
      socket.on('FE-show-all-users', ({roomId, users}) => {
        setUserList((preList) => {
          
          preList = preList.concat({
              roomId: roomId,
              users: users,
          })
          console.log(preList);
          return preList;
        })
      });

    }, []);

    const history = useHistory();

    function drawUsers(users){
      return (
        <div>
          {(users.length > 0
            ? users.map((userinfo) =>
                <div
                    // onHover={() => {
                    //     history.push('/join?roomId=' + roomuser.roomId);
                >
                    {userinfo.info.userName}
                </div>)
            : <div>Loading</div>)}
        </div>
      )
    }

// Room list from server
        // fetch('http://localhost:9000/room-list').then(r =>
        //     r.json()
        // ).then(roomList => {
        //     setRoomList(roomList);
        // })

        return <div style={{display: 'flex', alignItems: 'start', flexDirection: 'column'}}>
            <h1 style={{margin: 20}}>Rooms</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>
                {
                    (userList.length > 0
                        ? userList.map((roomuser) =>
                            <div
                                onClick={() => {
                                    history.push('/join?roomId=' + roomuser.roomId);
                                }}
                                style={{backgroundColor: '#222', width: 300, padding: 10, margin: 20, borderRadius: 20}}
                            >
                                {roomuser.roomId}
                                {drawUsers(roomuser.users)}
                            </div>)
                        : <div>Loading</div>)
                }
            </div>
        </div>
    }
;


export default RoomList;
