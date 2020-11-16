import { combineReducers } from 'redux';
import sampleReducer from './sampleReducer';
import history from './historyReducer';
import stepNumber from './stepNumberReducer';
import xIsNext from './playerReducer';
// import reducerName from 'reducerFilePath';

export default combineReducers({
    // reducerName   * make sure to import reducerFile
    history,
    stepNumber,
    xIsNext
});