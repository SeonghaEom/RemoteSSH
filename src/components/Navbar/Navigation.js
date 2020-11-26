import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Scrollchor from 'react-scrollchor';
import {Link} from 'react-router-dom'

export default class Navigation extends Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Brand href="#home">
                        <Link to="/">
                                <img alt="remoteSSHLogo" height="28" src={require('../../pictures/logo.svg')}/>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav.Link>
                            <Scrollchor className="nav-link" to="#features">Features</Scrollchor>
                        </Nav.Link>
                        <Nav.Link>
                            <Scrollchor className="nav-link" to="#about-us">About Us</Scrollchor>
                        </Nav.Link>
                        {/* <Link to="/login">
                            <button type="button" className="secondary-button">Join Room</button>
                        </Link> */}
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}