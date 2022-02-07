import React from 'react';
import ReactDOM from 'react-dom';
import {Route, BrowserRouter, Routes} from 'react-router-dom';
import './index.css';
import 'fomantic-ui-css/semantic.css';
import UserView from "./UserView";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<LoginPage/>} />
            <Route exact path="/user" element={<UserView/>} />
            <Route exact path="/dashboard" element={<Dashboard/>} />
        </Routes>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
