import React, { Component } from 'react'
import NavbarEmpty from '../Navbar/NavbarEmpty'
import TopicCard from '../TopicSuggestion/TopicCard'

//for firestore
import firebase from '../../firebase'

export default class TopicSuggestion extends Component {
    constructor() {
        super();
        this.state = {
            topics: []
        }
    }
    //getting items from firestore
    // const db = firebase.firestore();
    // db.collection("Topics").get().then((snapshot) => {
    //     snapshot.docs.forEach(doc => {
    //         console.log(doc.data());
    //         console.log(doc.id);
    //         // <TopicCard topic = {doc.data().topic} 
    //         // dislike =  {doc.data().dislikes} 
    //         // like = {doc.data().likes}/>
    //         items.push({
    //             topic: doc.data().topic,
    //             dislikes: doc.data().dislikes,
    //             likes: doc.data().likes,
    //             id: doc.id,
    //         });
    //     });
    //     console.log(items);
    // })

    // componentDidMount() {
    //     const db = firebase.firestore();
    //     db.collection("Topics").get().then((snapshot) => {
    //         snapshot.docs.forEach(doc => {
    //             let topicItems = {... doc}
    //             topicItems = {
    //                 topic: doc.data().topic,
    //                 dislikes: doc.data().dislikes,
    //                 likes: doc.data().likes,
    //                 id: doc.id,
    //             };
    //             this.setState({
    //                 topics: {...topicItems},
    //             });
    //         });
    //     });
    //     console.log("finished mounting");
    //     console.log(this.state.topics);
    // }

    componentDidMount() {
         //getting items from firestore
         const db = firebase.firestore();
        //  db.collection("Topics").get().then((snapshot) => {
        //      snapshot.docs.forEach(doc => {
        //         this.setState = {
        //             topics: {...doc.data()}
        //         }
        //         console.log(doc.data(), doc.id);
        //      });
        //  });
        db.collection("Topics").onSnapshot((snapshot) => {
            let topicList = [];
            snapshot.forEach((doc) => {
                topicList.push([doc.data(), doc.id]);
                // console.log(doc.data());
            })
            this.setState({
                topics: topicList
            })
        })
    }

    render() {
        return (
            <div>
                <NavbarEmpty/>
                <div id="topic-container">
                    {this.state.topics.length > 0 ? (
                        this.state.topics.map(key => (
                            <TopicCard id={key[1]} topic={key[0].topic}
                            dislikes={key[0].dislikes} likes={key[0].likes}/>
                        ))
                    ) : (
                        <p>No Topic has been added</p>
                    )}
                </div>
            </div>
        )
    }
}
