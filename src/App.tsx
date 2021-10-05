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

  const [error, setError] = useState<any>(null);

  const initializeEsbuild = async () => {
    try {
      await esbuild.initialize({
        wasmURL: './esbuild.wasm',
      });
    } catch (err) {
      console.log(`An error has occurred while initializing esbuild: ${err}`);
      setError(err);
    }
  };

  useEffect(() => {
    initializeEsbuild();
  }, []);

  const handleSubmitBtn = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (error) return; // Don't do anything if esbuild failed to init

    const builtSrc = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [UnpkgPathGenerator(javascript)],
    });

    const iframeEl: HTMLIFrameElement | null =
      document.querySelector('#code-preview');

    iframeEl?.contentWindow?.postMessage(builtSrc.outputFiles[0].text, '*');
  };

  return (
    <div className="App">
      <Split
        direction="vertical"
        sizes={[50, 10, 40]}
        style={{ height: '100vh' }}
      >
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

        <button type="submit" onClick={(event) => handleSubmitBtn(event)}>
          Execute Code
        </button>

        <CodePreview html={html} css={css} />
      </Split>
    </div>
  );
};

export default App;
