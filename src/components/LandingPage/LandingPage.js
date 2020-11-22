import React from 'react'
// import Navbar from '../Navbar/Navbar'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Scrollchor from 'react-scrollchor';
import {Link} from 'react-router-dom'
import Navigation from '../Navbar/Navigation'

// import Button from 'react-bootstrap/Button'

export default function LandingPage() {
    return (
        <div id="landingPage" style={{overflow: "auto"}}>
            <Navigation/>

            <div className="intro">
                <h1>Lets Sig Sa Hae Together!</h1>
                <p>Eat Together with your Friends Online from anywhere.</p>
                <Link to="/join">
                    <button className="primary-button">Get Started</button>
                </Link>
                <img className="min-vh-80" 
                src={require('../../pictures/intro.svg')}/>
            </div>

            <div id="features">
                <h1>Features</h1>
                <div className="feature-point">
                    <h2>Wish List</h2>
                    <p>Interested in what your friends are eating? 
                        Save Them in your wish list!</p>
                <img className="min-vh-80" 
                src={require('../../pictures/feature-wishlist.svg')}/>
                </div>

                <div className="feature-point">
                    <h2>Topic suggestion</h2>
                    <p>Don’t know what to talk about? Our system will suggest a topic for you!</p>
                <img className="min-vh-80" 
                src={require('../../pictures/feature-topic.svg')}/>
                </div>

                <div className="feature-point">
                    <h2>Volume control</h2>
                    <p>Listen to what your friends are saying in the other room and control the volume.</p>
                <img className="min-vh-80" 
                src={require('../../pictures/feature-volume.svg')}/>
                </div>
            </div>

            <div id="about-us">
                <h1>About us</h1>
                <p>Special thanks to Professor Juho Kim and the staff of CS473 for the mentoring of this project. 
                    This is our final project please give us A+, please.</p>
            </div>

            <footer className="landing-footer">
                <small>Copyright  &copy;2020. RemoteSSH</small>
            </footer> 
        </div>
    )
}
