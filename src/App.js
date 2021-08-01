import React, { Component, useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TopAppBar from "./components/TopAppBar";
import Main from "./components/main";
import History from "./components/history";
import CalendarAnt from "./components/Calendar_Ant"
import store from './store';



import { withStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root:{
    width: "100%",
    height: "100%"
  },

}));

export default function App() {
  const classes = useStyles();
  const [user, setUser] = useState(''); // store에서 가져온 값
  const [isOpenHistory, setIsOpenHistory] = useState(false); // store에서 가져온 값 when 메뉴아이콘 clicked


  useEffect(() => {
    store.subscribe(()=>{
      const userfromTopAppBar = store.getState().user;
      setUser(userfromTopAppBar);
      const isOpenHistoryfromTopAppBar = store.getState().open;
      setIsOpenHistory(isOpenHistoryfromTopAppBar);
    })
  },[]);

  return (
    <div className="App">
      <TopAppBar />
      <div>
        {isOpenHistory ? <History/> : <CalendarAnt/>}
      </div>
    </div>
  );
}

//export default withStyles(styles)(App);
