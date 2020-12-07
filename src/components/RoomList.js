import React, {useEffect, useState, useRef} from "react";
import firestore from "../config/fbconfig";
import { useHistory } from 'react-router-dom';
import io from "socket.io-client";

const RoomList = ({ display, roomId, goToScreen, switchRoom}) => {

    const [roomList, setRoomList] = useState({}); // {roomId, users}
    const [userList, setUserList] = useState([]);
    let history = useHistory()
    const socketRef = useRef();


    useEffect(() => {
      async function fetchData(){
        await fetch('https://e20f32fed856.ngrok.io/room-list')
        // await fetch('https://remote-ssh.graymove.com/room-list')
          .then(function(response) {
            return response.json();
        }).then((json) => {
          // console.log("roomlist ", Object.keys(json));
          // console.log("userlist ", Object.values(json));
          // setRoomList(Object.keys(json));
          // setUserList(Object.values(json));
          setRoomList(json);
        })}
      fetchData();

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
                    {userinfo.userName}
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
                    (Object.keys(roomList).length > 0
                        ? Object.keys(roomList).map((roomId, idx) =>
                        <div className="roomlist-container">
                            <div className="roomlist-roomId">
                              {roomId}
                            </div>
                            <div >
                                
                                {drawUsers(roomList[roomId])}
                            </div>
                            <div className="join-table"
                                onClick={() => {switchRoom(roomId)}}
                            >Join Table</div>
                        </div>)
                        : <div>The room is empty!</div>)
                }
            </div>
        </div>
    }
;


export default RoomList;
