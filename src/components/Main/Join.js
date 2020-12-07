import React, {useRef, useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import NavbarEmpty from '../Navbar/NavbarEmpty';
import { v1 as uuid } from "uuid";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Join = (props) => {
  var currentUser = sessionStorage.getItem('user');
    const userRef = useRef();
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const query = useQuery();
 
    const [roomId, setRoomId] = useState(query.get('roomId') || '');
    const [userName, setUserName] = useState(currentUser);

    const [roomList, setRoomList] = useState({}); // {roomId, users}
    const [userList, setUserList] = useState([]);

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

<<<<<<< HEAD

    function clickCreate() {
        sessionStorage.setItem('roomName', roomId);
=======
    useEffect(() => {
      async function fetchData(){
        await fetch(' https://e20f32fed856.ngrok.io/room-list')
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
>>>>>>> 8fc495a7
        const id = uuid();
        props.history.push(`/room/${roomId}`);
    }

    function clickJoin(){

    }

    function clickJoin() {
        sessionStorage.setItem('user', userName);
        // const id = uuid();
        props.history.push(`/room/${roomId}`);
    }

    return (
        <MainContainer>
            <NavbarEmpty/>
<<<<<<< HEAD
            <div className='roomlist-background'>
              <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'start'}}>

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
                                onClick={() => {clickJoin(roomId)}}
                            >Join Table</div>
                        </div>)
                        : <div>The room is empty!</div>)
                }
            </div>
            <div style={{color: 'white', fontSize: '26px', marginTop: '40px'}}>
              <h2 className="join-command">Create a new Room! </h2>
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
              <JoinButton onClick={clickCreate}> create Room </JoinButton>
              {err ? <Error>{errMsg}</Error> : null}
            </div>
        </div>
=======
            
            <h2 className="join-command">Type in either 'cheese' or 'peperoni', or anything and freely switch rooms! </h2>
            <h3 className="join-command"> In developing mode, so if error happens, always reload :p </h3>
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
>>>>>>> 8fc495a7
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
