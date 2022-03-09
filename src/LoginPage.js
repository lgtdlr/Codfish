import React, {useState} from 'react';
import {Button, Form, Header, Message, Segment} from 'semantic-ui-react';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from "axios";

const login_url = process.env.REACT_APP_LOGIN_URL || 'http://127.0.0.1:5000/codfish/login';

async function handleLogin(username, password) {

    const requestBody = { username: username, password: password};
    console.log(username)
    await axios.post(login_url, requestBody).then(function
        (response) {
        if (response.status === 200) {
            localStorage.setItem("token", response.data.access_token)
        }

    }).catch((error) => {
        console.log('error: ' + error);
        this.setState({requestFailed: true});
    });
}


const LoginPage = () => {
    require('dotenv').config();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuth, setIsAuth] = useState(!!(token && token !== "undefined"));
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // const handleLogin = () => {
    //
    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ username: username, password: password})
    //     };
    //
    //     fetch(login_url, requestOptions)
    //     .then(response => response.json())
    //     .then(data => {
    //         localStorage.setItem("token", data.access_token)
    //         setIsAuth(localStorage.getItem("token")!=="undefined")
    //     });
    // }

    if (!isAuth) {
        return (
            <Segment loading={isLoading}><Header dividing textAlign="center" size="huge">Codfish</Header>
            <Segment placeholder>

                <Form error>
                            <Message
                              error
                              header='Incorrect login'
                              content='Re-enter your username and password.'
                              hidden={!isError}
                            />
                            <Form.Input
                                icon='user'
                                iconPosition='left'
                                label='Nombre de usuario'
                                placeholder='Nombre'
                                maxLength ='40'
                                value = {username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                            <Form.Input
                                icon='lock'
                                iconPosition='left'
                                label='Contraseña'
                                placeholder='******'
                                type='password'
                                value = {password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />

                            <Button content='Login'
                                    primary onClick={() => {
                                        setIsLoading(true);
                                        handleLogin(username, password).then(_ => {
                                            if (localStorage.getItem("token") !== null) {
                                                navigate("/user")
                                            }
                                        }).catch(_ => {
                                            setIsLoading(false);
                                            setIsError(true);
                                            setUsername('');
                                            setPassword('');
                                        });
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
