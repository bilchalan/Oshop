import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import {injectStore} from "./redux/axiosPrivate";
injectStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path='/*' element={<App/>}/>
      </Routes>
    </Router>
  </Provider>
);
