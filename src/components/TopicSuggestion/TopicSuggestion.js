import React, { Component, useState, useEffect } from 'react'
import NavbarEmpty from '../Navbar/NavbarEmpty'
import TopicCard from './TopicCard'
import {Link} from 'react-router-dom'

//for firebase
// import firebase from '../../config/fbconfig'
import storage from '../../config/fbconfig'
import firestore from '../../config/fbconfig'
import * as firebase from 'firebase'
// require('firebase/database');

export default function TopicSuggestion() {
    const [topicList, setTopicList] = useState();

    //load topics from database
    useEffect(() => {
        const topicRef = firebase.database().ref('Topics');
        topicRef.on("value", (snapshot) => {
            console.log(snapshot.val());
            const topics = snapshot.val();
            const topicList = [];
            for (let id in topics) {
                topicList.push({id, ... topics[id]});
            }
            console.log(topicList);
            setTopicList(topicList);
        });
    }, []);

    return (
        <div className="topic-suggestion">
            <NavbarEmpty/>
            <div id="topic-container">
                {topicList ? topicList.map((item, index) =>
                <TopicCard topic={item.topic} dislikes={item.dislikes} likes={item.likes} id={item.id}/>
                ) : ' '}
            </div>
            <Link to="/join">
                <button className="primary-button proceed-room">Proceed to Room</button>
            </Link>
        </div>
    )
}
