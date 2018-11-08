import App from './screens/App.jsx';
import React from 'react';
import ReactDom from 'react-dom';
import wolkenkit from 'wolkenkit-client';
import { Application, ThemeProvider } from 'thenativeweb-ux';

wolkenkit.connect({ host: 'local.wolkenkit.io', port: 3000 }).
  then(api => {
    const app = (
      <ThemeProvider theme='wolkenkit'>
        <Application>
          <Application.Services />
          <App api={ api } />
        </Application>
      </ThemeProvider>
    );

    ReactDom.render(app, window.document.querySelector('#root'));
  });
