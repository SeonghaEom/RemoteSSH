import React, { Component } from 'react'

export default class TopicCard extends Component {
    constructor(props) {
        super();
        this.state = {
            topic: props.topic,
            dislikes: props.dislikes, 
            likes: props.likes,
            id: props.id
        }
    }
    render() {
        // console.log("hello");
        return (
            <div>
                <li className="topic-item">{this.state.topic}</li>
                <button>Like</button>
                <button>Dislike</button>
            </div>
        )
    }
}
