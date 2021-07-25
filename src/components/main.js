import React, { Component, useEffect, useState } from "react";

import CalendarAnt from "./Calendar_Ant";

import { withStyles } from "@material-ui/core";
// import {
//     Button, InputAdornment , Grid, TextField, Fab,
//     Dialog, DialogActions, DialogContent, DialogTitle,
//   } from "@material-ui/core";
// import MaterialUIPickers from "./DatePicker";
// import Typography from '@material-ui/core/Typography';

// import { Calendar, momentLocalizer } from 'react-big-calendar'
// import BigCalendar from 'react-big-calendar';
import moment from 'moment'
// import events from './events';
// import "react-big-calendar/lib/css/react-big-calendar.css";

// import 'antd/dist/antd.css';
// import { Calendar, Badge } from 'antd';

//import DatePicker, { registerLocale } from "react-datepicker";
// registerLocale("ko", ko);
// import getYear from "date-fns/getYear";
// import getMonth from "date-fns/getMonth";

moment.locale('ko');
// const localizer = momentLocalizer(moment)

const styles = theme => ({
    root:{
    },
});

const Main = (props) => {
    const {classes} = props;

    useEffect(() => {

    }, []);

    return(
      <main>
        
        <CalendarAnt/>

{/* https://fullcalendar.io/docs/month-view */}

        {/* TODO : <DatePicker/> */}
        {/* TODO : 하루만 체크박스 */}
        {/* TODO : 확정/취소/에러 시 alert 추가 */}
      </main>
    );
}

export default withStyles(styles)(Main);
