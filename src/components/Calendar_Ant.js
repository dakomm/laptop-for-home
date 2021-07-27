import React, { Component, useEffect, useState } from "react";
import store from '../store';
import { makeStyles, fade, rgbToHex } from '@material-ui/core/styles';
import { Grid, GridList, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText} from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Calendar, Modal, Alert, List, Divider, Space, Select, Radio, Col, Row, Typography, Button, Badge, Popover, message} from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
import './Calendar_Ant.css'
import 'antd/dist/antd.css';
import { DomainDisabledRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  Table:{
    padding: 5,
  }
}));

const CalendarAnt = () => {
  const classes = useStyles();
  const [user, setUser] = useState(''); //로그인 user state
  const [date, setDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false); //더블 클릭 시 Modal 띄우기, 닫기
  const [okDialogOpen, setOkDialogOpen] = useState(false); // table 가능 버튼 클릭
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false); // table 취소 버튼 클릭
  const [registerButtonInfo, setRegisterButtonInfo] = useState(); // table 버튼 클릭된 listItem 정보 dialog에 전달
  const [cancelButtonInfo, setCancelButtonInfo] = useState(); // table 버튼 클릭된 listItem 정보 dialog에 전달
  const [dateClicked, setDateClicked] = useState(false); //더블 클릭 시 Modal 띄우기 위해
  const [dialogMsg, setDialogMsg] = useState(''); // table 버튼 클릭 시 dialogMsg
  const [loginReqDialogOpen, setLoginReqDialogOpen] = useState(false);
  const [selectedID, setSelectedID] = useState(); 
  const [listData, setListData] = useState([
    {id:0, num: '65', date: '2021-07-28', getter: 'dk'},
    {id:1, num: '65', date: '2021-07-30', getter: 'dk'},
    {id:2, num: '65', date: '2021-07-05', getter: 'dk'},
    {id:3, num: '66', date: '2021-07-05', getter: 'dk'},
    {id:4, num: '66', date: '2021-07-28', getter: 'dk'},
    {id:5, num: '70', date: '2021-07-28', getter: 'dk'},
    {id:6, num: '75', date: '2021-07-28', getter: 'dk'},
    {id:7, num: '65', date: '2021-07-28', getter: 'dk'},
    {id:8, num: '65', date: '2021-07-28', getter: 'dk'},
    {id:9, num: '65', date: '2021-07-28', getter: 'dk'},
    {id:10, num: '65', date: '2021-07-28', getter: 'dk'},

  ]);

  const listItem = [
      {no:1, num: '65'},
      {no:2, num: '66'},
      {no:3, num: '70'},
      {no:4, num: '75'},
      {no:5, num: '77'},
      {no:6, num: '82'},
      {no:7, num: '85'},
      {no:8, num: '86'}
  ];

  useEffect(() => {
    // resyncDB();
    store.subscribe(()=>{
      const userfromStore = store.getState().userName;
      setUser(userfromStore);
      console.log(userfromStore);
    })
  },[]);

  // const resyncDB = () => {
  //   axios
  //     .get(baseUrl+'/api/todolist/readdb')
  //     .then((rspn)=>{
  //       for(let i=0; i<rspn.data.length; i++){
  //         let dateObj = new Date(rspn.data[i].due);
  //         rspn.data[i].due = dateObj.toLocaleDateString("ko-KR", {timeZone: "Asia/Seoul"});
  //       }
  //       store.dispatch({
  //         type:'initializecontent',
  //         todoList: rspn.data,
  //       });
  //       idx = rspn.data.length;
  //     });
  // }

  function onDateSelect  (value){   //onSelect
    setDate(value);  // 2017-01-25처럼 표시 : selectedValue && selectedValue.format('YYYY-MM-DD')        
    if(dateClicked){
      setIsModalVisible(true);
      setDateClicked(false);
    } 
    setDateClicked(true);
    setTimeout(() => setDateClicked(false), 200);
  }

  const dateFilteredList = (date) => {
    return listData.filter((e => e.date === date));
  }

  const handleGet = (date,e) => {
    if(user === ''){
      setLoginReqDialogOpen(true);
      setDialogMsg("로그인이 필요한 서비스입니다. 먼저 로그인하세요!")
      return;
    // }else if({/*date <= moment().format(YYYY-MM-DD)*/}){
    //   return;
    }else{
      setOkDialogOpen(true); 
      setDialogMsg(user + "님, "+date+"에 "+e.num+"번 노트북 대여를 신청하시겠어요?");
    }
  };

  const handleCancel = (date,e) => {

    setCancelDialogOpen(true);
    setDialogMsg(user + "님, "+date+"에 "+e.num+"번 노트북 대여를 취소하시겠습니까?");
  }

  const availableDecision = (date) => {
    let bookedCnt = 0
    let available = Boolean
    for(let i=0; i<listData.length; i++){
      if((listData[i].date === date.format('YYYY-MM-DD'))){
        bookedCnt = bookedCnt + 1;
      }
    }
    if(bookedCnt >= 8){
      bookedCnt = 0
      return available = false;
    }else return available = true;
  }

  const tableButtonType = (e)=> {
      // 1. listData 존재
      for(let i=0; i<listData.length; i++){
        if((listData[i].date === date.format('YYYY-MM-DD')) & (listData[i].num === e.num)){
          if(listData[i].getter === user){
            return(
              <Button onClick={()=>{handleCancel(date.format('YYYY-MM-DD'),e);setCancelButtonInfo(e)}} danger type="primary" shape="round" size="small" style={{margin:3}}>
                취소
              </Button>
            )
          } else if((listData[i].getter !== '') & (listData[i].getter !== user)){
            return(
              <Button disabled shape="round" size="small" style={{margin:3}}>
              {listData[i].getter}
              </Button>
            )
          }
        }
      }
      // 2. listData 없음
      return(
        <Button onClick={()=>{handleGet(date.format('YYYY-MM-DD'),e);setRegisterButtonInfo(e)}} type="primary" shape="round" size="small" style={{margin:3}}>
        가능
        </Button>
      ) 
            // setListData(listData.map(item=> item.id === id ? ({...item, getter : user}): item))
  } 

  function dateCellRender(value) {
    let available = Boolean;
    available = availableDecision(value);
    if((value > moment()) & (moment().add(7, 'days').calendar() >= value.format("YYYY.MM.DD."))& available){
      return(
        <Grid container direction="column" alignItems="flex-end">
          <Button style={{marginTop: "1em"}} size="small" type="primary" shape="circle">&nbsp;</Button>
        </Grid>
      )
    } 
  };

  const getListData = (value) => {
    let listData;
    // listData = [
    //   {id:'0', date: '2021-07-21', giver: 'DK', getter: ''},
    //   {id:'1', date: '2021-07-01', giver: 'AA', getter: 'BBB'},
    // ];
    return (listData || []);
  }

  return(
    <div className="site-calendar-customize-header-wrapper">
    <Calendar 
      fullscreen={true}
      headerRender={({ value, type, onChange, onTypeChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];
        const current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
          current.month(i);
          months.push(localeData.monthsShort(current));
        }

        for (let index = start; index < end; index++) {
          monthOptions.push(
            <Select.Option className="month-item" key={`${index}`}>
              {months[index]}
            </Select.Option>,
          );
        }
        const month = value.month();
        const year = value.year();
        const options = [];
        for (let i = moment().year() - 1; i < moment().year() + 2; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>,
          );
        }
        
        return (
          <div style={{ padding: 8 }}>
            <Row gutter={8}>    {/* Year, Month Row의 Padding값(px) */}
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  className="my-year-select"
                  bordered={false}
                  onChange={newYear => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                  value={String(year)}
                >
                  {options}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  dropdownMatchSelectWidth={false}
                  bordered={false}
                  value={String(month)}
                  onChange={selectedMonth => {
                    const newValue = value.clone();
                    newValue.month(parseInt(selectedMonth, 10));
                    onChange(newValue);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
              <Col>
                <Button ghost
                    type="primary" 
                    size="small"
                    onClick={()=>{setDate(moment());}} // selectable calendar 참고
                >
                    Today
                </Button>
              </Col>
            </Row>
          </div>
        );
      }}
      value={moment(date)} 
      onSelect={(value)=>{onDateSelect(value)}}
      dateCellRender={dateCellRender}
      zIndex={0}
    />

    <Modal centered
      title={date.format('YYYY-MM-DD')}
      visible={isModalVisible} 
      onCancel={() => {setIsModalVisible(false)}}
      width={'300px'}
      closable
      footer={null}
    >
      <TableContainer style={{ marginTop: "-16px"}}>
        <Table stickyHeader>
          <TableHead ><TableRow>
            <TableCell align="center" style={{fontWeight:"bolder",padding:"10px"}}>No.</TableCell>
            <TableCell align="center" style={{fontWeight:"bolder",padding:"10px"}}>자산번호</TableCell>
            <TableCell align="center" style={{fontWeight:"bolder",padding:"10px"}}>현황</TableCell>
          </TableRow></TableHead>
          <TableBody >
            {listItem.map((e) => (
              <TableRow key={e.no} >
                <TableCell className={classes.Table} align="center">{e.no} </TableCell>
                <TableCell className={classes.Table} align="center">{e.num}</TableCell>
                <TableCell className={classes.Table} align="center">{tableButtonType(e)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        </Table>
      </TableContainer>
      
    </Modal>
    
    <Dialog open={okDialogOpen} onClose={()=>{setOkDialogOpen(false)}} aria-describedby="alert-dialog-description" aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" 
          onClick={()=>{
            setOkDialogOpen(false);
            setListData([...listData, {id:listData.length, num:registerButtonInfo.num, date:date.format('YYYY-MM-DD'), getter:user}]);
          }}
        > 네! </Button>
        <Button onClick={()=>{setOkDialogOpen(false)}}>아니요</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={cancelDialogOpen} onClose={()=>{setCancelDialogOpen(false)}} aria-describedby="alert-dialog-description" aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" autoFocus
          onClick={()=>{
            setCancelDialogOpen(false);
          }}
        > 네! </Button>
        <Button onClick={()=>{setCancelDialogOpen(false)}}>아니요</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={loginReqDialogOpen} onClose={()=>{setLoginReqDialogOpen(false)}} aria-describedby="alert-dialog-description" aria-labelledby="alert-dialog-title">
      <DialogTitle id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" autoFocus
          onClick={()=>{
            setLoginReqDialogOpen(false);
            setIsModalVisible(false)
          }}
        > 확인 </Button>
      </DialogActions>
    </Dialog>

    </div>
  )
}

export default (CalendarAnt);
