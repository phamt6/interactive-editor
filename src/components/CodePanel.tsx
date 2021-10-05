import React from 'react';
import * as codemirror from 'codemirror';
import { Controlled as ControlledEditor } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';

interface CodePanelI {
  sourceType: string;
  source: string;
  setSource: React.Dispatch<React.SetStateAction<string>>;
}

const CodePanel: React.FC<CodePanelI> = ({ sourceType, source, setSource }) => {
  const handleChange = (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string
  ) => {
    setSource(value);
  };

  return (
    <div>
      <div className="panel-title">{sourceType}</div>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={source}
        options={{
          lineWrapping: true,
          mode: sourceType,
          theme: 'material',
          lineNumbers: true,
        }}
      />
    </div>
  );
};

export default CodePanel;
