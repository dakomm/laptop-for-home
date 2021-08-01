import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TopAppBar from "./components/TopAppBar";
import History from "./components/history";
import CalendarAnt from "./components/Calendar_Ant"
import store from './store';

const useStyles = makeStyles((theme) => ({
  root:{
    width: "100%",
    height: "100%"
  },
}));

export default function App() {
  const classes = useStyles();
  const [isOpenHistory, setIsOpenHistory] = useState(false); // store에서 가져온 값 when 메뉴아이콘 clicked

  useEffect(() => {
    store.subscribe(()=>{
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
