import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Page from './components/Page';

interface RequireImport {
  default: any;
}

document.addEventListener('DOMContentLoaded', () => {
  const render = (Component: any) => {
    ReactDOM.render(
      <AppContainer><Component /></AppContainer>,
      document.getElementById('react-root'));
  };

  render(Page);

  if (module.hot) {
    module.hot.accept('./components/Page', () => {
      const NextPage = require<RequireImport>('./components/Page').default;
      render(NextPage);
    });
  }
});
