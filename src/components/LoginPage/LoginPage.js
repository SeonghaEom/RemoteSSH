import React from 'react'
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Alert from 'react-bootstrap/Alert'
import NavbarEmpty from '../Navbar/NavbarEmpty'

//for firebase
// import firebase from '../../config/fbconfig'
import storage from '../../config/fbconfig'
import firestore from '../../config/fbconfig'
import * as firebase from 'firebase'

class LoginPage extends React.Component {
    constructor() { 
        super();
        this.state = {
            username: "",
            topic: "",
            image: null,
            url: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({image}));
        }
    }

    updateInput = e => { 
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addInfo = e => { 
        e.preventDefault();
        const userRef = firebase.database().ref('User');
        const user = {
            name: this.state.username,
        }
        userRef.push(user);

        const topicRef = firebase.database().ref('Topics');
        const topic = {
            topic: this.state.topic,
            likes: 0,
            dislikes: 0,
        }
        topicRef.push(topic);

        //clear the component state
        this.setState({
            username: "",
            topic: ""
        });
    }

    handleUploadPhoto = e => {
        //for image upload
        const {image} = this.state;
        // const uploadPhoto = storage.ref(`foodImages/${this.state.username}`).put(image);
        const uploadPhoto = firebase.storage().ref().child(`foodImages/${this.state.username}`).put(image);
        uploadPhoto.on('state_changed', 
        (snapshot) => {
            //show progress of upload

        },
        (error) => {
            console.log(error);
        }, 
        () => {
            // complete upload
            console.log('photouploaded');
            uploadPhoto.snapshot.ref.getDownloadURL().then((url) => {
                console.log('file vailable at', url);
                this.setState({url});
            });
        });
    }
 
    render() { 
        return (
            <div>
                <NavbarEmpty/>
    
                <Alert className="demo-alert">
                    We are currently in the Demo Phase. Try our features with our trial meeting room code: 
                    <b> PizzaMeeting</b>.
                </Alert>    
    
                <Form className="login-forms" onSubmit={this.addInfo}>
                    <Form.Group controlId="formBasicInfo" className="form-basic">
                        <div>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" 
                        onChange={this.updateInput} value={this.state.username}
                        placeholder="Username" />
    
                        <Form.Label>Meeting Room Code</Form.Label>
                        <Form.Control type="text" placeholder="Example: 1234" />
    
                        <Form.Label>Meeting Room Password</Form.Label>
                        <Form.Control type="text" placeholder="Example: 1234" />
                        </div>
    
                        <div className="separator"></div>

                        {/* upload photo */}
                        <div className="photo-upload">
                            <Form.File type="file" onChange={this.handleChange}
                            label="Example file input" />
                            <img height="100" width="100%" src={this.state.url} alt="uploadedPicture"/>
                            <button onClick={this.handleUploadPhoto}>Choose Picture</button>
                        </div>
                    </Form.Group>
    
                    <Form.Group controlId="formBasicInfo" className="topic-form">
                        <Form.Label>Any topic suggestions to chat about?</Form.Label>
                        <Form.Control name="topic" as="textarea" rows={3} onChange={this.updateInput}
                        value={this.state.topic}/>
                    </Form.Group>
                    
                    <div className="form-nav">
                        <button className="primary-button">Join Room</button>
                        <Link href="">Back To Mainpage</Link>
                    </div>
                </Form>
            </div>
        )
    }
}

export default LoginPage;