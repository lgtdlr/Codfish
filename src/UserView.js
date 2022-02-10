import React, {useState} from 'react';
import {Container, Tab, Menu} from "semantic-ui-react";
import {useNavigate} from 'react-router-dom';
import Dashboard from "./Dashboard";
import Advanced from "./Advanced";

const UserView = () =>{
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuth, setIsAuth] = useState(!!(token && token !== "undefined"));
    const navigate = useNavigate()


    const handleLogOut = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    if (!isAuth) {
        handleLogOut();
    }


    const panes = [
        {
            menuItem: 'Dashboard', render : () => <Dashboard/>
        }
        // ,
        // {
        //     menuItem: 'Advanced', render : () => <Advanced/>
        // }
    ]

    return (

        <Container>

            <Menu secundary size={"small"}>
                <Menu.Menu position={'right'}>
                    {/*<Menu.Item>Home</Menu.Item>*/}
                    <Menu.Item onClick={handleLogOut}>Sign Out</Menu.Item>
                </Menu.Menu>
            </Menu>
            <Tab panes={panes}/>
        </Container>
    )

}
export default UserView;
