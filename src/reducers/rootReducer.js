import { combineReducers } from 'redux';
import sampleReducer from './sampleReducer';
// import {firebaseReducer} from "react-redux-firebase";
// import {firestoreReducer} from "redux-firestore";

export default combineReducers({
    // reducerName   * make sure to import reducerFile
    // firebase: firebaseReducer,
    // firestore: firestoreReducer,
    sampleReducer
});