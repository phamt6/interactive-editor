import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Split from 'react-split';
import { RootState } from '../state';
import CodePanel from './CodePanel';
import CodePreview from './CodePreview';

const Editor: React.FC = () => {
  const { bundle, html, css } = useSelector((state: RootState) => state.editor);

  useEffect(() => {
    const renderIframe = async () => {
      const iframeEl: HTMLIFrameElement | null =
        document.querySelector('#code-preview');

      if (!iframeEl || !iframeEl.contentWindow) return;

      const jsMessage = {
        event_id: 'bundled-js',
        data: bundle,
      };

      const cssMessage = { event_id: 'css', data: css };
      const htmlMessage = { event_id: 'html', data: html };

      // HTML has to be posted first to ensure DOM manipulation
      iframeEl.contentWindow.postMessage(htmlMessage, '*');
      iframeEl.contentWindow.postMessage(cssMessage, '*');
      iframeEl.contentWindow.postMessage(jsMessage, '*');
    };

    renderIframe();
  }, [bundle, html, css]);

  return (
    <Split direction="vertical" style={{ height: '100vh' }}>
      <Split
        className="flex"
        direction="horizontal"
        sizes={[33, 33, 33]}
        minSize={[50, 50, 50]}
      >
        <CodePanel sourceType="javascript" />
        <CodePanel sourceType="css" />
        <CodePanel sourceType="html" />
      </Split>
      <CodePreview />
    </Split>
  );
};

export default Editor;
