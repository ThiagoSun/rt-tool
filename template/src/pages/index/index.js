import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/createStore';
import registerServiceWorker from '../../registerServiceWorker';
import './index.less';

const store = createStore(window.__INITIAL_STATE__);

const MOUNT_NODE = document.getElementById('root');

let render = () => {
  const App = require('./container/App').default;
  const routes = require('./routes/index').default(store);

  ReactDOM.render(
    <App store={store} routes={routes} />,
    MOUNT_NODE
  )
};
// Development Tools
// ------------------------------------
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    render();
    // const renderApp = render
    //
    // render = () => {
    //   try {
    //     renderApp()
    //   } catch (e) {
    //     console.error(e)
    //   }
    // }

    // Setup hot module replacement
    module.hot.accept([
        './routes/index',
      ], () =>
        setImmediate(() => {
          ReactDOM.unmountComponentAtNode(MOUNT_NODE)
          render()
        })
    )
  }
}

// Let's Go!
// ------------------------------------
if (process.env.NODE_ENV !== 'test') render()

registerServiceWorker();
