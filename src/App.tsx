import React, { useEffect, useState, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';

const App: React.FC = () => {
  const [source, setSource] = useState<string>('');
  const [bundled, setBundled] = useState<string>();
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

    const bundledSource: esbuild.TransformResult = await esbuild.transform(
      source,
      {
        loader: 'ts',
      }
    );

    setBundled(bundledSource.code);
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

      <pre id="bundled-code">{bundled}</pre>
    </div>
  );
};

export default App;
