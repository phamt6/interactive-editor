import { combineReducers } from 'redux';
import editorReducer from './editorReducers';

const reducers = combineReducers({
  editor: editorReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;
