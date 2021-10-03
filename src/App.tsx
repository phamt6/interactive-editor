import React, { useEffect, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import UnpkgPathGenerator from './esbuild-plugins/unpkg-path-generator';
import CodePreview from './components/code-preview';

const App: React.FC = () => {
  const [source, setSource] = useState<string>('');
  const [error, setError] = useState<any>(null);

  const initializeEsbuild = async () => {
    try {
      await esbuild.initialize({
        wasmURL: './esbuild.wasm',
      });
    } catch (err) {
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
      plugins: [UnpkgPathGenerator(source)],
    });

    const iframeEl: HTMLIFrameElement | null =
      document.querySelector('#code-preview');

    iframeEl?.contentWindow?.postMessage(builtSrc.outputFiles[0].text, '*');
  };

  return (
    <div className="App">
      <textarea
        value={source}
        onChange={(event) => setSource(event.currentTarget.value)}
      ></textarea>

      <button type="submit" onClick={(event) => handleSubmitBtn(event)}>
        Execute Code
      </button>

      <CodePreview />
    </div>
  );
};

export default App;
