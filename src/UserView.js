import React, {Component, useState} from 'react';
import moment from 'moment';
import {Button, Card, Container, Modal, Tab,Dropdown,Menu,Confirm} from "semantic-ui-react";
import {Route, BrowserRouter, Routes, useNavigate} from 'react-router-dom';
import Dashboard from "./Dashboard";
import Advanced from "./Advanced";

const UserView = () =>{
    const [token, setToken] = useState(sessionStorage.getItem("token"));
    const [isAuth, setIsAuth] = useState(!!(token && token !== "undefined"));
    const navigate = useNavigate()

  const handleLogOut = () => {
        sessionStorage.removeItem("token")
        navigate("/")
  }


    const panes = [
        {
            menuItem: 'Dashboard', render : () => <Dashboard/>
        },
        {
            menuItem: 'Advanced', render : () => <Advanced/>
        }
    ]

    return (

        <Container>

            <Menu secundary size={"small"}>
                <Menu.Menu position={'right'}>
                    <Menu.Item>Home</Menu.Item>
                    <Menu.Item onClick={handleLogOut}>Sign Out</Menu.Item>
                </Menu.Menu>
            </Menu>
            <Tab panes={panes}/>
        </Container>
    )

}
export default UserView;
