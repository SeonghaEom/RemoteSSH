import React, {useEffect, useState} from "react";
import firestore from "../config/fbconfig";
import { useHistory } from 'react-router-dom';
import socket from '../socket';

const RoomList = ({ display, roomId, goToScreen }) => {

    const [roomList, setRoomList] = useState([]); // {roomId, users}
    const [userList, setUserList] = useState([]);
    let history = useHistory()


    useEffect(() => {
      async function fetchData(){
        await fetch('https://3.35.238.94:9000/room-list')
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


    function drawUsers(users){
      return (
        <div className='roomlist-container-user'>
          
          {(users.length > 0
            ? users.map((userinfo) =>
                <div className= 'room-list'
                    // onHover={() => {
                    //     history.push('/join?roomId=' + roomuser.roomId);
                >
                    {userinfo.info.userName}
                </div>)
            : <div>The room is empty!</div>)}
        </div>
      )
    };

    function Close(){
      // goToScreen;
      history.go(0);
    }

// Room list from server
        // fetch('http://localhost:9000/room-list').then(r =>
        //     r.json()
        // ).then(roomList => {
        //     setRoomList(roomList);
        // })

        return <div className='roomlist-background'>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>
                <div className="close" onClick={(e) => {
                  goToScreen(e);
                  history.go(0);
                }}></div>
                <div style={{color: 'white', fontSize: '26px', marginTop: '40px'}}>
                  Change Tables
                </div>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}} >
                {
                    (userList.length > 0
                        ? userList.map((roomuser) =>
                        <div className="roomlist-container">
                            <div className="roomlist-roomId">
                              {roomuser.roomId}
                            </div>
                            <div >
                                
                                {drawUsers(roomuser.users)}
                            </div>
                            <div className="join-table"
                                onClick={() => {
                                    history.replace(roomuser.roomId);
                                    socket.emit('BE-leave-room', ({ roomId, leaver: socket.id}));
                                    // window.location.href='room/' + roomuser.roomId;
                                    history.go(0);
                                    
                                }} 
                            >Join Table</div>
                        </div>)
                        : <div>The room is empty!</div>)
                }
            </div>
        </div>
    }
;


export default RoomList;
