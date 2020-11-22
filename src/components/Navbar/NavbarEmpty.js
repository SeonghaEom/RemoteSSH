import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'

export default class NavbarEmpty extends Component {
    render() {
        return (
            <div>
                <Navbar>
                    <Navbar.Brand href="#home">
                        <img alt="remoteSSHLogo" height="28" src={require('../../pictures/logo.svg')}/>
                    </Navbar.Brand>
                </Navbar>
            </div>
        )
    }
}
