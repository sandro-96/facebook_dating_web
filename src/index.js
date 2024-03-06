import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Constants from './components/Utils/Constant';

console.info('process.env', process.env);

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
const ignoreTokenLinks = ['/oauth2/google/login/process'];
axios.interceptors.request.use(function (config) {
    console.info('config.url ' + config.url);
    let isIgnorePath = false;

    for (let i = 0; i < ignoreTokenLinks.length; i++) {
        if (config.url.startsWith(ignoreTokenLinks[i])) {
            isIgnorePath = true;
            break;
        }
    }

    console.info('config.url isIgnorePath ' + isIgnorePath);
    if (isIgnorePath) return config;

    config.headers.Authorization = sessionStorage.getItem(Constants.LOCAL_STORAGE.AUTHORIZATION) || sessionStorage.getItem(Constants.LOCAL_STORAGE.TOKEN) || '';

    return config;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
