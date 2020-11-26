import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/lib/integration/react';
import { persistor, store } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import 'semantic-ui-css/semantic.min.css'

const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true,
};

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};
ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ReactReduxFirebaseProvider {...rrfProps}>
              <React.StrictMode>
                <App />
              </React.StrictMode>,
          </ReactReduxFirebaseProvider>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
