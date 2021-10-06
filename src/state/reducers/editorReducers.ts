import { ActionType } from '../action-types';
import { Action } from '../actions';

interface EditorState {
  loading: boolean;
  bundle: string;
  html: string;
  css: string;
  error: unknown;
}

const initialEditorState = {
  loading: true,
  bundle: '',
  html: '',
  css: '',
  error: '',
};

const editorReducer = (
  state: EditorState = initialEditorState,
  action: Action
): EditorState => {
  switch (action.type) {
    case ActionType.UPDATE_HTML:
      return {
        ...state,
        html: action.payload.html,
      };
    case ActionType.UPDATE_CSS:
      return {
        ...state,
        css: action.payload.css,
      };
    case ActionType.BUNDLING_START:
      return {
        ...state,
        bundle: action.payload.bundle,
        error: action.payload.error,
      };
    case ActionType.BUNDLING_COMPLETE:
      return {
        ...state,
        bundle: action.payload.bundle,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export default editorReducer;
