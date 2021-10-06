import React, { useEffect, useState } from 'react';
import * as codemirror from 'codemirror';
import { Controlled as ControlledEditor } from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../state';
import { useDispatch } from 'react-redux';

interface CodePanelI {
  sourceType: string;
}

const CodePanel: React.FC<CodePanelI> = ({ sourceType }) => {
  const DELAY_AFTER_LAST_INPUT = 1000;

  const [source, setSource] = useState<string>('');

  const dispatch = useDispatch();

  const { updateJavascript, updateHtml, updateCss } = bindActionCreators(
    actionCreators,
    dispatch
  );

  const handleChange = (
    editor: codemirror.Editor,
    data: codemirror.EditorChange,
    value: string
  ) => {
    setSource(value);
  };

  useEffect(() => {
    const update = async () => {
      if (sourceType === 'html') {
        updateHtml(source);
      } else if (sourceType === 'css') {
        updateCss(source);
      } else if (sourceType === 'javascript') {
        await updateJavascript(source);
      }
    };

    const timeout = setTimeout(() => {
      update();
    }, DELAY_AFTER_LAST_INPUT);

    return () => clearTimeout(timeout);
  }, [source, sourceType]);

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
