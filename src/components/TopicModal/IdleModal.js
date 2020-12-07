import React, {useEffect, useState}  from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import firestore from '../../config/fbconfig';
import * as firebase from 'firebase';

export const IdleTimeOutModal = ({showModal, handleClose}) => {
    const [topicList, setTopicList] = useState();
    const [idx, setIdx] = useState(0);

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


    console.log(topicList ? topicList[idx]['topic'] : "Let's talk about favorite restaurant!");
    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Topic Suggestions</Modal.Title>
            </Modal.Header>
            <Modal.Body>{topicList ? topicList[idx]['topic'] : "Let's talk about favorite restaurant!"}</Modal.Body>
            <Modal.Footer>
            <Button variant="danger" onClick={() => {
              idx >= topicList.length -1 ?
              setIdx(0):
              setIdx(idx + 1);}}>
                Next
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Select
            </Button>
            </Modal.Footer>
        </Modal>
    )
}