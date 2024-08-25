import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import 'assets/third-party/apex-chart.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// project import
import ContextGlobal from 'GlobalContext';
import { store } from 'store';
import App from './App';

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter basename="/">
        <ContextGlobal>
          <App />{' '}
        </ContextGlobal>
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>
);
