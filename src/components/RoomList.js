import React, {useEffect, useState} from "react";
import firestore from "../config/fbconfig";
import { useHistory } from 'react-router-dom';
import socket from '../socket';

const RoomList = ({ display, roomId, goToScreen }) => {

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
        <div className='roomlist-container-user'>
          
          {(users.length > 0
            ? users.map((userinfo) =>
                <div className= 'room-list'
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

        return <div className='roomlist-background'>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>
                <div className="close" onClick={goToScreen}></div>
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
                                    history.push('room/'+ roomuser.roomId);
                                    
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
