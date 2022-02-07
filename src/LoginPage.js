import React, {Component, useState} from 'react';
import {Button, Divider, Form, Grid, Header, Modal, Segment, Tab} from 'semantic-ui-react';
import {Route, Navigate, BrowserRouter, Routes, useNavigate} from 'react-router-dom';
import axios from "axios";


const LoginPage = () => {
    require('dotenv').config();
    const url = process.env.REACT_APP_LOGIN_URL || 'http://127.0.0.1:5000/codfish/login';
    const [open, setOpen] = useState(false);
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [isAuth, setIsAuth] = useState(!!(token && token !== "undefined"));
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = (event, newValue) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password})
        };

        console.log(url)
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            sessionStorage.setItem("token", data.access_token)
            setIsAuth(sessionStorage.getItem("token")!=="undefined")

        });
    }

    if (!isAuth) {
        return (
            <Segment><Header dividing textAlign="center" size="huge">Welcome</Header>
            <Segment placeholder>
                <Form>
                            <Form.Input
                                icon='user'
                                iconPosition='left'
                                label='Username'
                                placeholder='Username'
                                maxLength ='40'
                                value = {username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label='Password'
                                type='password'
                                value = {password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <Button content='Login'
                                    primary onClick={() => {
                                        console.log("TEST")
                                        handleLogin()
                                    if (isAuth){
                                        navigate("/user")
                                    }
                                    }}/>
                        </Form>
            </Segment>

        </Segment>
        )
    } else {
        return (<Navigate to="/user" />)
    }

}


export default LoginPage;
