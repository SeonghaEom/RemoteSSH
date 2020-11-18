import React from 'react';

import logo from './logo.svg';
import './App.scss';
import { connect } from 'react-redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import Join from './components/Main/Join';
import Room from './components/Room/Room'
import styled from 'styled-components';
import RoomList from "./components/RoomList";


const mapStateToProps = state => ({
  ...state
})

function App() {

  
  return (
    <BrowserRouter>
      <div className="App">
      </div>
        <AppContainer>
            <Switch>
                <Route exact path="/room-list" component={RoomList} />
                <Route exact path="/join" component={Join} />
                <Route exact path="/room/:roomId" component={Room} />
            </Switch>
        </AppContainer>
    </BrowserRouter>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
  color: white;
  background-color: #454552;
  text-align: center;
`;

export default connect(mapStateToProps, null)(App);
