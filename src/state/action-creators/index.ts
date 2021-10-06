import * as esbuild from 'esbuild-wasm';
import { Dispatch } from 'redux';
import UnpkgPathGenerator from '../../esbuild-plugins/unpkg-path-generator';
import { ActionType } from '../action-types';
import {
  UpdateCssAction,
  UpdateHtmlAction,
  RenderIframeAction,
  Action,
} from '../actions';

export const updateHtml = (html: string): UpdateHtmlAction => {
  return {
    type: ActionType.UPDATE_HTML,
    payload: {
      html,
    },
  };
};

export const updateCss = (css: string): UpdateCssAction => {
  return {
    type: ActionType.UPDATE_CSS,
    payload: {
      css,
    },
  };
};

export const renderIframe = (srcDoc: string): RenderIframeAction => {
  return {
    type: ActionType.RENDER_IFRAME,
    payload: {
      srcDoc,
    },
  };
};

export const updateJavascript = (javascript: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLING_START,
      payload: {
        bundle: '',
        error: '',
      },
    });

    try {
      const bundledJavascript = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [UnpkgPathGenerator(javascript)],
      });

      dispatch({
        type: ActionType.BUNDLING_COMPLETE,
        payload: {
          bundle: bundledJavascript.outputFiles[0].text,
          error: '',
        },
      });
    } catch (error: unknown) {
      dispatch({
        type: ActionType.BUNDLING_COMPLETE,
        payload: {
          bundle: '',
          error,
        },
      });
    }
  };
};
