
import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import {Link} from 'react-router-dom'

export default class NavbarEmpty extends Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Brand href="#home">
                        <Link to="/">
                            <img alt="remoteSSHLogo" height="28" src={require('../../pictures/logo.svg')}/>
                        </Link>
                    </Navbar.Brand>
                </Navbar>
            </div>
        )
    }
}