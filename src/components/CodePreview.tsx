import React from 'react';
import './CodePreview.css';

const CodePreview: React.FC = () => {
  const iframeOptions =
    'allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation';

  const srcDoc = `
    <html>
      <head>
        <script>
          window.addEventListener('error', (event) => {
            event.preventDefault();
            const errorMessage = document.createElement('div');
            errorMessage.innerText = event.error;
            document.body.appendChild(errorMessage);
            console.error(event.error);
          })

          window.addEventListener('message', ({ data }) => {
            if (data.event_id === 'bundled-js') {
              try {
                eval(data.data);
              } catch (err) {
                document.write(err);
                console.error(err);
              }
            } else if (data.event_id === 'css') {
              const stylesheet = document.createElement('style');
              stylesheet.innerText = data.data;
              document.head.appendChild(stylesheet);
            } else {
              const rootEl = document.createElement('div');
              rootEl.id = 'root';
              document.body.innerHTML = data.data;
              document.body.appendChild(rootEl);
            }
            
          }, false);
        </script>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
  `;

  return (
    <iframe
      id="code-preview"
      title="Code Preview"
      sandbox={iframeOptions}
      srcDoc={srcDoc}
    />
  );
};

export default CodePreview;
