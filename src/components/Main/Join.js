import React, {useRef, useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import NavbarEmpty from '../Navbar/NavbarEmpty';
import { v1 as uuid } from "uuid";
import Volumesquare from './Volumesquare.js'


function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Join = (props) => {
  var currentUser = sessionStorage.getItem('user');
  const currentRoomCode = sessionStorage.getItem('roomCode');
  const [userName, setUserName] = useState(currentUser);
    const userRef = useRef();
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const query = useQuery();
 
    const [roomId, setRoomId] = useState(currentRoomCode || '');
    

    const [roomList, setRoomList] = useState({}); // {roomId, users}
    const [userList, setUserList] = useState([]);


    
    useEffect(() => {
      async function fetchData(){
        await fetch('https://96fdeb27f2d7.ngrok.io/room-list')
        // await fetch('https://remote-ssh.graymove.com/room-list')
          .then(function(response) {
            return response.json();
        }).then((json) => {
          console.log("users in server ", json);
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
            ? users.map((user) =>
                <div>
                <div className= 'room-list'
                    // onHover={() => {
                    //     history.push('/join?roomId=' + roomuser.roomId);
                >
                    {user}
                </div>
                <Volumesquare/>
                </div>)
            : <div>The room is empty!</div>)}
        </div>
      )
    };

    useEffect(() => {
      async function fetchData(){
        await fetch(' https://96fdeb27f2d7.ngrok.io/room-list')
        // await fetch('https://remote-ssh.graymove.com/room-list')
          .then(function(response) {
            return response.json();
        }).then((json) => {
          console.log("join json", json);
          setRoomList(json);
          
        })}
      fetchData();

    }, []);


    function clickCreate() {
        sessionStorage.setItem('user', userName);
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    function clickJoin() {
        sessionStorage.setItem('user', userName);
        // const id = uuid();
        props.history.push(`/room/${roomId}`);
    }

    function switchRoom(roomId) {
        sessionStorage.setItem('user', userName);
        // const id = uuid();
        props.history.push(`/room/${roomId}`);
    }

    return (
        <MainContainer>
            <NavbarEmpty/>
            
            <h2 className="join-command">You can create a new room or enter existing rooms! </h2>
            <Row id="room-input">
                <Label htmlFor="roomName">Room Name</Label>
                <Input value={roomId} type="text" id="roomName" onChange={(e) => {
                    setRoomId(e.currentTarget.value);
                }}/>
            </Row>
            <Row id="user-input">
                <Label htmlFor="userName">User Name</Label>
                <Input value={userName} type="text" id="userName" onChange={(e) => {
                    setUserName(e.currentTarget.value);
                }}/>
            </Row>
            <JoinButton onClick={clickJoin}> Join </JoinButton>
            <JoinButton onClick={clickCreate}> Create </JoinButton>
            {err ? <Error>{errMsg}</Error> : null}
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}} >
                {
                    (Object.keys(roomList).length > 0
                        ? Object.keys(roomList).map((eachRoom, idx) =>
                        <div className="roomlist-container">
                            <div className="roomlist-roomId">
                              {eachRoom}
                            </div>
                            <div >
                                
                                {drawUsers(roomList[eachRoom])}
                            </div>
                            <div className="join-table"
                                onClick={() => {switchRoom(eachRoom)}}
                            >Join Table</div>
                        </div>)
                        : <div>The room is empty!</div>)
                }
            </div>
        </MainContainer>
    );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 15px;
  line-height: 35px;
`;

const Label = styled.label``;

const Input = styled.input`
  width: 150px;
  height: 35px;
  margin-left: 15px;
  padding-left: 10px;
  outline: none;
  border: none;
  border-radius: 5px;
`;

const Error = styled.div`
  margin-top: 10px;
  font-size: 20px;
  color: #e85a71;
`;

const JoinButton = styled.button`
  height: 40px;
  margin-top: 35px;
  outline: none;
  border: none;
  border-radius: 15px;
  color: #d8e9ef;
  background-color: #4ea1d3;
  font-size: 25px;
  font-weight: 500;

  :hover {
    background-color: #7bb1d1;
    cursor: pointer;
  }
`;

export default Join;
