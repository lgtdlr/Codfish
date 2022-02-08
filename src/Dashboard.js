import React, {Component, useEffect, useState} from 'react';
import {Tab, Container, Header, Image, List, Modal, Segment, Button} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import {useNavigate} from 'react-router-dom';

const monthly_stats_url = process.env.REACT_APP_MONTHLY_STATS_URL || 'http://127.0.0.1:5000/codfish/month';
const annual_stats_url = process.env.REACT_APP_ANNUAL_STATS_URL || 'http://127.0.0.1:5000/codfish/year';
const update_stats_url = process.env.REACT_APP_SYNC_URL || 'http://127.0.0.1:5000/codfish/update'

const colors = scaleOrdinal(schemeCategory10).range();

let monthlyData = [];
let annualData = [];


async function getMonthlyStats(token) {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(monthly_stats_url, requestOptions).then(function
        (response) {
        monthlyData = response.data
    })
}


async function getAnnualStats(token) {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(annual_stats_url, requestOptions).then(function
        (response) {
        annualData = response.data
    })
}

async function updateStats(token) {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(update_stats_url, requestOptions).then(function
        (response) {
    })
}


const Dashboard = () => {

    const navigate = useNavigate();

    const panes = [
        { menuItem: 'Mensual', render: () => <Tab.Pane loading={isLoading}>
                <ResponsiveContainer centered width={'99%'} height={400}>
                    <BarChart data={monthlyData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month_year"/>
                        <YAxis domain={[0, 4000]}/>
                        <Tooltip />
                        {/*<Legend />*/}
                        <Bar dataKey="month_income" fill="#8884d8"  label={{ position: 'top' }}>
                            {monthlyStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer></Tab.Pane>, },
        { menuItem: 'Anual', render: () => <Tab.Pane loading={isLoading}>
                <ResponsiveContainer centered width={'99%'} height={400}>
                    <BarChart data={annualData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis domain={[0, 20000]}/>
                        <Tooltip />
                        {/*<Legend />*/}
                        <Bar dataKey="year_income" fill="#8884d8" label={{ position: 'top' }}>
                            {annualStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                            ))}
                        </Bar>
                    </BarChart></ResponsiveContainer></Tab.Pane> },
    ]

    const [monthlyStats, setMonthlyStats] = useState([]);
    const [annualStats, setAnnualStats] = useState([]);
    const [isLoading, setIsLoading] = useState([true]);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleUpdate = () => {

        setIsLoading(true);

        updateStats(token).then(() => {
            navigate("/user")
        })
    }

    useEffect(() => {

        getAnnualStats(token).then(() => {
            setAnnualStats(annualData)
            console.log("Annual stats" + annualStats)
            setIsLoading(false);
        })

        getMonthlyStats(token).then(() => {
            setMonthlyStats(monthlyData)
            console.log("Monthly stats" + monthlyStats)
            setIsLoading(false);
        })


    }, [])

    return (<div>
        <Segment>
            <Tab panes={panes} />
            <Button content='Refresh'
            primary onClick={() => {
                handleUpdate()
            }} onKeyPress={()=>{
                handleUpdate()
            }}/>
        </Segment>
    </div>)


}



export default Dashboard;
