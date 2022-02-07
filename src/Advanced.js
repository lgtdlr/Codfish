import React, {Component, useState} from 'react';
import {Button, Divider, Form, Grid, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import {Route, Navigate, BrowserRouter, Routes, useNavigate} from 'react-router-dom';
import axios from "axios";
import moment from "moment";


const Advanced = () => {
    const url = process.env.REACT_APP_SELECTED_PERIOD_STATS_URL || 'http://127.0.0.1:5000/codfish/range'
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [isAuth, setIsAuth] = useState(!!(token && token !== "undefined"));

    const handleChange = () => {
        const requestOptions = {
        headers: { Authorization: "Bearer " + token }};
        const range = {
        }
        axios.put(url, range, requestOptions).catch(function (error) {
            console.log(error);
        })
    }

    return(<div></div>
)


}
export default Advanced;