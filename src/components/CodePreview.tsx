import React from 'react';

interface CodePreviewProps {
  html: string;
  css: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ html, css }) => {
  const iframeOptions =
    'allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation';

  const htmlStarter = `
    <html>
      <head>
        <style>${css}</style>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              document.write(err);
              console.error(err);
            }
          }, false);
        </script>
      </head>
      <body>
        <div id="root"></div>
        ${html}
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
