import React from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {Link} from 'react-router-dom'
import Navbar from 'react-bootstrap/Navbar'
import Alert from 'react-bootstrap/Alert'

export default function LoginPage() {
    return (
        <div>]
            <Navbar>
                <Navbar.Brand href="#home">
                    <img alt="remoteSSHLogo" height="28" src={require('../../pictures/logo.svg')}/>
                </Navbar.Brand>
            </Navbar>

            <Alert className="demo-alert">
                We are currently in the Demo Phase. Try our features with our trial meeting room code: 
                <b> PizzaMeeting</b>.
            </Alert>    

            <Form className="login-forms">
                <Form.Group controlId="formBasicInfo" className="form-basic">
                    <div>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" />

                    <Form.Label>Meeting Room Code</Form.Label>
                    <Form.Control type="text" placeholder="Example: 1234" />

                    <Form.Label>Meeting Room Password</Form.Label>
                    <Form.Control type="text" placeholder="Example: 1234" />
                    </div>

                    <div className="separator"></div>

                    <div className="photo-upload">
                    <Form.File id="exampleFormControlFile1" label="Example file input" />
                    </div>
                </Form.Group>

                <Form.Group controlId="formBasicInfo" className="topic-form">
                    <Form.Label>Any topic suggestions to chat about?</Form.Label>
                    <Form.Control as="textarea" rows={3} />
                </Form.Group>
                
                <div className="form-nav">
                    <button className="primary-button">Join Room</button>
                    <Link href="">Back To Mainpage</Link>
                </div>
            </Form>
        </div>
    )
}
