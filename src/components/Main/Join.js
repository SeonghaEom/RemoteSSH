import React, {useRef, useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import socket from '../../socket';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Join = (props) => {
    const userRef = useRef();
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const query = useQuery();

    console.log("query ",  query);
 
    const [roomId, setRoomId] = useState(query.get('roomId') || '');
    const [userName, setUserName] = useState('');

    useEffect(() => {

        socket.on('FE-error-user-exist', ({error, roomId, userName}) => {
            if (!error) {
                // console.log("Join ", userName, roomId);
                sessionStorage.setItem('user', userName);
                props.history.push(`/room/${roomId}`);

            } else {
                setErr(error);
                setErrMsg('User name already exist');
            }
        });
    }, [props.history]);

    function clickJoin() {
        if (!roomId || !userName) {
            setErr(true);
            setErrMsg('Enter Room Name or User Name');
        } else {
          // console.log("Join ", userName, roomId);
            socket.emit('BE-check-user', {roomId: roomId, userName});
        }
    }

    return (
        <MainContainer>
            <Row>
                <Label htmlFor="roomName">Room Name</Label>
                <Input value={roomId} type="text" id="roomName" onChange={(e) => {
                    setRoomId(e.currentTarget.value);
                }}/>
            </Row>
            <Row>
                <Label htmlFor="userName">User Name</Label>
                <Input value={userName} type="text" id="userName" onChange={(e) => {
                    setUserName(e.currentTarget.value);
                }}/>
            </Row>
            <JoinButton onClick={clickJoin}> Join </JoinButton>
            {err ? <Error>{errMsg}</Error> : null}
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
