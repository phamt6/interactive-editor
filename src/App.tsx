import React, { useEffect, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import UnpkgPathGenerator from './esbuild-plugins/unpkg-path-generator';
import CodePreview from './components/CodePreview';
import './App.css';

import CodePanel from './components/CodePanel';
import Split from 'react-split';

const App: React.FC = () => {
  const [javascript, setJavascript] = useState<string>('');
  const [html, setHtml] = useState<string>('');
  const [css, setCss] = useState<string>('');
  const [esbuildReady, setEsbuildReady] = useState<boolean>(false);

  const [error, setError] = useState<any>(null);

  const initializeEsbuild = async () => {
    try {
      await esbuild.initialize({
        wasmURL: './esbuild.wasm',
      });

      setEsbuildReady(true);
    } catch (err) {
      console.log(`An error has occurred while initializing esbuild: ${err}`);
      setError(err);
    }
  };

  useEffect(() => {
    initializeEsbuild();
  }, []);

  useEffect(() => {
    const updateJs = async () => {
      if (error) return; // Don't do anything if esbuild failed to init

      const iframeEl: HTMLIFrameElement | null =
        document.querySelector('#code-preview');

      if (!iframeEl || !iframeEl.contentWindow) return;

      const builtSrc = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [UnpkgPathGenerator(javascript)],
      });

      const jsMessage = {
        event_id: 'bundled-js',
        data: builtSrc.outputFiles[0].text,
      };
      const cssMessage = { event_id: 'css', data: css };
      const htmlMessage = { event_id: 'html', data: html };

      // HTML has to be posted first to ensure DOM manipulation
      iframeEl.contentWindow.postMessage(htmlMessage, '*');
      iframeEl.contentWindow.postMessage(cssMessage, '*');
      iframeEl.contentWindow.postMessage(jsMessage, '*');
    };

    const timeout = setTimeout(updateJs, 500);
    return () => clearTimeout(timeout);
  }, [javascript, css, html, error]);

  return (
    <div className="App">
      {esbuildReady && (
        <Split direction="vertical" style={{ height: '100vh' }}>
          <Split
            className="flex"
            direction="horizontal"
            sizes={[33, 33, 33]}
            minSize={[50, 50, 50]}
          >
            <CodePanel
              sourceType="javascript"
              source={javascript}
              setSource={setJavascript}
            />
            <CodePanel sourceType="css" source={css} setSource={setCss} />
            <CodePanel sourceType="html" source={html} setSource={setHtml} />
          </Split>

          {/* <button type="submit" onClick={(event) => handleSubmitBtn(event)}>
          Execute Code
        </button> */}

          <CodePreview />
        </Split>
      )}
    </div>
  );
};

export default App;
