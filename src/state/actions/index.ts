import { ActionType } from '../action-types';

export interface UpdateJavascriptAction {
  type: ActionType.UPDATE_JAVASCRIPT;
  payload: {
    javascript: string;
  };
}

export interface UpdateHtmlAction {
  type: ActionType.UPDATE_HTML;
  payload: {
    html: string;
  };
}

export interface UpdateCssAction {
  type: ActionType.UPDATE_CSS;
  payload: {
    css: string;
  };
}

export interface RenderIframeAction {
  type: ActionType.RENDER_IFRAME;
  payload: {
    srcDoc: string;
  };
}

export interface BundlingStartAction {
  type: ActionType.BUNDLING_START;
  payload: {
    bundle: string;
    error: unknown;
  };
}

export interface BundlingCompleteAction {
  type: ActionType.BUNDLING_COMPLETE;
  payload: {
    bundle: string;
    error: unknown;
  };
}

export type Action =
  | UpdateJavascriptAction
  | UpdateHtmlAction
  | UpdateCssAction
  | RenderIframeAction
  | BundlingStartAction
  | BundlingCompleteAction;
