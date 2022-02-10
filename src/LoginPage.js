import React, {useState} from 'react';
import {Button, Form, Header, Segment} from 'semantic-ui-react';
import {Navigate, useNavigate} from 'react-router-dom';


const LoginPage = () => {
    require('dotenv').config();
    const url = process.env.REACT_APP_LOGIN_URL || 'http://127.0.0.1:5000/codfish/login';
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuth, setIsAuth] = useState(!!(token && token !== "undefined"));
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = () => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password})
        };

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            localStorage.setItem("token", data.access_token)
            setIsAuth(localStorage.getItem("token")!=="undefined")

        });
    }

    if (!isAuth) {
        return (
            <Segment loading={isLoading}><Header dividing textAlign="center" size="huge">Welcome</Header>
            <Segment placeholder>

                <Form>
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
