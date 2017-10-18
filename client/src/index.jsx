import App from './screens/App.jsx';
import React from 'react';
import ReactDom from 'react-dom';
import { setup } from 'wolkenkit-ux';
import wolkenkit from 'wolkenkit-client';

import './index.css';

setup.client();

wolkenkit.connect({ host: 'local.wolkenkit.io', port: 3000 }).
  then(api => {
    ReactDom.render(<App api={ api } />, window.document.querySelector('.react-app'));
  });
