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
            roomCode: "",
            roomPass:""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState({
                image: image
            });
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

        // //clear the component state
        // this.setState({
        //     username: "",
        //     topic: ""
        // });
        
    }

    handleUploadPhoto = e => {
        //for image upload
        const image = this.state.image;
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
            // console.log('photouploaded');
            uploadPhoto.snapshot.ref.getDownloadURL().then((url) => {
                // console.log('file vailable at', url);
                // this.setState(() => ({url}));
                this.setState({
                    url: url
                });
            });
        });
    }

    checkRoomInfo = e => {
        e.preventDefault();
        if (this.state.roomCode == "PizzaMeeting" && this.state.roomPass == "1234") {
            window.location.href = window.location.host + "/join";
        }
        else {
            console.log("wrong info");
        }
    }

    changePage = e => {
        e.preventDefault();

        window.location.pathname = "/topicSuggestion";
        sessionStorage.setItem('user', this.state.username);
        sessionStorage.setItem('roomCode', this.state.roomPass);
        sessionStorage.setItem('roomName', this.state.roomCode);

    }
 
    render() { 
        return (
            <div>
                <NavbarEmpty/>
    
                <Alert className="demo-alert">
                    We are currently in the Demo Phase. Try our features with our trial Meeting room name 
                    <b> PizzaMeeting</b> and given code.
                </Alert>    
    
                <Form className="login-forms" onSubmit={this.addInfo}>
                    <Form.Group controlId="formBasicInfo" className="form-basic">
                        <div>
                        <Form.Label>Username</Form.Label>
                        <Form.Control required type="text" name="username" 
                        onChange={this.updateInput} value={this.state.username}
                        placeholder="Username" />
    
                        <Form.Label>Meeting Room Name</Form.Label>
                        <Form.Control onChange={this.updateInput}  name="roomCode" value={this.state.roomCode} required type="text" placeholder="Example: PizzaMeeting" />
    
                        <Form.Label>Meeting Room Code</Form.Label>
                        <Form.Control onChange={this.updateInput} name="roomPass" value={this.state.roomPass} required type="text" placeholder="" />
                        </div>
    
                        <div className="separator"></div>

                        {/* upload photo */}
                        <div className="photo-upload">
                            <Form.File type="file" onChange={this.handleChange}
                            label="Upload Food Picture" />
                            {(this.state.url == "") ? <div></div> : <img height="100" width="100%" src={this.state.url}/>}
                            <button className="upload-pic" onClick={this.handleUploadPhoto}>Upload Picture</button>
                        </div>
                    </Form.Group>
    
                    <Form.Group controlId="formBasicInfo" className="topic-form">
                        <Form.Label>Any topic suggestions to chat about?</Form.Label>
                        <Form.Control required name="topic" as="textarea" rows={3} onChange={this.updateInput}
                        value={this.state.topic}/>
                    </Form.Group>
                    
                    <div className="form-nav">
                        {/* <Link to="/topicSuggestion">
                            <button className="primary-button">Join Room</button>
                        </Link> : */}
                        <button onClick={this.changePage} className="primary-button">Join Room</button>
                        {/* {(this.state.roomCode == "PizzaMeeting" && this.state.roomPass == "1234") ? 
                            <Link to="/topicSuggestion">
                                <button className="primary-button">Join Room</button>
                            </Link> :
                            <button onClick={e => this.showAlert(e)} className="primary-button">Join Room</button>
                        } */}
                        <Link className="back-mainpage" to="/">Back To Mainpage</Link>
                    </div>
                </Form>
            </div>
        )
    }
}

export default LoginPage;