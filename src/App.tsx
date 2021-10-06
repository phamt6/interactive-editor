import React, { useEffect, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import './App.css';

import { Provider } from 'react-redux';
import { store } from './state';
import Editor from './components/Editor';

const App: React.FC = () => {
  const [esbuildReady, setEsbuildReady] = useState<boolean>(false);

  const [error, setError] = useState<any>(null);

  const initializeEsbuild = async () => {
    try {
      await esbuild.initialize({
        wasmURL: './esbuild.wasm',
      });

      setEsbuildReady(true);
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    initializeEsbuild();
  }, []);

  return (
    <Provider store={store}>
      <div className="App">
        {error && <div>An error has occured: {error.message}</div>}

        {esbuildReady && !error && <Editor />}
      </div>
    </Provider>
  );
};

export default App;
