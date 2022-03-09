import React, { useEffect, useState} from 'react';
import {Tab,  Segment, Button} from "semantic-ui-react";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import axios from "axios";
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { useNavigate } from 'react-router-dom';;

const daily_stats_url = process.env.REACT_APP_DAILY_STATS_URL || 'http://127.0.0.1:5000/codfish/day';
const monthly_stats_url = process.env.REACT_APP_MONTHLY_STATS_URL || 'http://127.0.0.1:5000/codfish/month';
const annual_stats_url = process.env.REACT_APP_ANNUAL_STATS_URL || 'http://127.0.0.1:5000/codfish/year';
const update_stats_url = process.env.REACT_APP_SYNC_URL || 'http://127.0.0.1:5000/codfish/update'

const colors = scaleOrdinal(schemeCategory10).range();

let dailyData = [];
let monthlyData = [];
let annualData = [];


async function GetDashboardStats(token) {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(annual_stats_url, requestOptions).then(function
        (response) {
        annualData = response.data

    }).catch((error) => {
        console.log('error: ' + error);
        this.setState({requestFailed: true});
        localStorage.removeItem('token');
    });

    await axios.get(monthly_stats_url, requestOptions).then(function
        (response) {
        monthlyData = response.data
    });

     await axios.get(daily_stats_url, requestOptions).then(function
        (response) {
        dailyData = response.data
    });


}

async function UpdateStats(token) {

    const requestOptions = {
        headers: { Authorization: "Bearer " + token }
    };

    await axios.get(update_stats_url, requestOptions).then(function
        (response) {
    }).catch(() => {
        localStorage.removeItem("token");
    });

    await GetDashboardStats(token);
}


const Dashboard = () => {

    let navigate = useNavigate();

    const panes = [
        { menuItem: 'Diario', render: () => <Tab.Pane loading={isLoading}>
                <ResponsiveContainer centered width={'99%'} height={400}>
                    <BarChart data={dailyData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day_month"/>
                        <YAxis domain={[0, 1000]}/>
                        <Tooltip />
                        {/*<Legend />*/}
                        <Bar dataKey="day_income" fill="#8884d8"  label={{ position: 'top' }}>
                            {dailyStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer></Tab.Pane>, },
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
    const [dailyStats, setDailyStats] = useState([]);
    const [isLoading, setIsLoading] = useState([true]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    useEffect(() => {

        if (token == null) {
            navigate("/")
        }

        UpdateStats(token).then(() => {
            setDailyStats(dailyData);
                setAnnualStats(annualData);
                setMonthlyStats(monthlyData);
                setIsLoading(false);
        }).catch(() => {
            navigate("/")
        })

    }, [isLoading])

    return (<div>
        <Segment>
            <Tab panes={panes} />
            <Button content='Refresh'
            primary onClick={() => {
                setIsLoading(true);
            }} onKeyPress={()=>{
                setIsLoading(true);
            }}/>
        </Segment>
    </div>)


}



export default Dashboard;
