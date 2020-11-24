import React, { Component } from 'react'
import * as firebase from 'firebase'
require('firebase/app');

export default class TopicCard extends Component {
    constructor(props) {
        super();
        this.state = {
            topic: props.topic,
            dislikes: props.dislikes, 
            likes: props.likes,
            id: props.id,
            likedClicked: false,
            dislikeClicked: false,
        }
    }

    addLike = e => {
        e.preventDefault();
        //add to the firebase data
        if (!this.state.dislikeClicked){
            this.setState({
                likedClicked: !this.state.likedClicked
            });
            if (this.state.likedClicked) {
                firebase.database().ref("Topics").child(this.state.id).set({
                    topic: this.state.topic,
                    likes: this.state.likes -1,
                    dislikes: this.state.dislikes 
                });
                this.setState({
                    likes: this.state.likes - 1
                })
            }
            else {
                firebase.database().ref("Topics").child(this.state.id).set({
                    topic: this.state.topic,
                    likes: this.state.likes + 1,
                    dislikes: this.state.dislikes 
                });
                this.setState({
                    likes: this.state.likes + 1
                })
            }
        }
    }

    addDislike = e => {
        e.preventDefault();
        //add top the firebase data
        if (!this.state.likedClicked){
            this.setState({
                dislikeClicked: !this.state.dislikeClicked
            });
            if (this.state.dislikeClicked) {
                firebase.database().ref("Topics").child(this.state.id).set({
                    topic: this.state.topic,
                    likes: this.state.likes,
                    dislikes: this.state.dislikes - 1
                });
                this.setState({
                    dislikes: this.state.dislikes - 1
                })
            }
            else {
                firebase.database().ref("Topics").child(this.state.id).set({
                    topic: this.state.topic,
                    likes: this.state.likes,
                    dislikes: this.state.dislikes + 1
                });
                this.setState({
                    dislikes: this.state.dislikes + 1
                })
            }
        }
    }

    render() {
        return (
            <div className="topic-card">
                <li className="topic-item">{this.state.topic}</li>
                <div>
                    <button onClick={this.addLike}>
                        {this.state.likedClicked ? 
                        <img height={24} src={require('../../pictures/thumbs-up-clicked.png')}/> :
                        <img height={24} src={require('../../pictures/thumbs-up-unclicked.png')}/>}
                    </button>
                    <button onClick={this.addDislike} className="dislike-button">
                        {this.state.dislikeClicked ? 
                        <img height={24} src={require('../../pictures/thumbs-up-clicked.png')}/> :
                        <img height={24} src={require('../../pictures/thumbs-up-unclicked.png')}/>}
                    </button>
                </div>
            </div>
        )
    }
}

