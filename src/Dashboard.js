import React, {Component, useEffect, useState} from 'react';
import {Tab, Container, Header, Image, List, Modal, Segment} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Cell, Legend, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";
import useWindowSize from "./utils/useWindowSize";
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

const token = sessionStorage.getItem("token");
const monthly_stats_url = process.env.REACT_APP_MONTHLY_STATS_URL || 'http://127.0.0.1:5000/codfish/month';
const annual_stats_url = process.env.REACT_APP_ANNUAL_STATS_URL || 'http://127.0.0.1:5000/codfish/year';

const colors = scaleOrdinal(schemeCategory10).range();

let monthlyData = [];
let annualData = [];

async function getMonthlyStats() {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(monthly_stats_url, requestOptions).then(function
        (response) {
        monthlyData = response.data
    })
}


async function getAnnualStats() {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(annual_stats_url, requestOptions).then(function
        (response) {
        annualData = response.data
    })
}


const Dashboard = () => {

    const panes = [
        { menuItem: 'Mensual', render: () => <Tab.Pane loading={isLoading}>
                <Container centered>
                    <BarChart width={width/5} height={width/4} data={monthlyStats} barSize={50}>
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
                </Container></Tab.Pane>, },
        { menuItem: 'Anual', render: () => <Tab.Pane loading={isLoading}>
                <Container centered>
                    <BarChart width={width/5} height={width/4} data={annualStats} barSize={50}>
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
                    </BarChart></Container></Tab.Pane> },
    ]

    const [monthlyStats, setMonthlyStats] = useState([]);
    const [annualStats, setAnnualStats] = useState([]);
    const [isLoading, setIsLoading] = useState([true]);

    const { width } = useWindowSize();

    useEffect(() => {

        getAnnualStats().then(() => {
            setAnnualStats(annualData)
            console.log("Annual stats" + annualStats)
        })

        getMonthlyStats().then(() => {
            setMonthlyStats(monthlyData)
            console.log("Monthly stats" + monthlyStats)
            setIsLoading(false);
        })



    }, [])

    return (<div>
            {isLoading === true && <Segment loading>
    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
  </Segment>}
        <Segment>


    <Tab panes={panes} />


    </Segment>
    </div>)


}



export default Dashboard;
