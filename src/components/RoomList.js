import React, {useEffect, useState} from "react";
import firestore from "../config/fbconfig";
import { useHistory } from 'react-router-dom';

const RoomList = () => {

        const [roomList, setRoomList] = useState([{roomId: "pizza", roomName: "Pizza"}]);

        // useEffect(() => {
        //     firestore.collection('studyrooms').get()
        //         .then((snapshot) => {

        //             const rows = [];
        //             snapshot.forEach((doc) => {
        //                 rows.push(doc.data());
        //             });
        //             return rows;
        //         }).then(roomList => {
        //         setRoomList(roomList);
        //     });
        // }, []);

        const history = useHistory();

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
                    (roomList.length > 0
                        ? roomList.map((room) =>
                            <div
                                onClick={() => {
                                    history.push('/join?roomId=' + room.roomId);
                                }}
                                style={{backgroundColor: '#222', width: 300, padding: 10, margin: 20, borderRadius: 20}}
                            >
                                {room.roomName}
                            </div>)
                        : <div>Loading</div>)
                }
            </div>
        </div>
    }
;


export default RoomList;
