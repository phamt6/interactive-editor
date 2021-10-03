import React from 'react';

const CodePreview: React.FC = () => {
  const iframeOptions =
    'allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation';

  const htmlStarter = `
    <html>
      <head>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data);
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
      srcDoc={htmlStarter}
    />
  );
};

export default CodePreview;
