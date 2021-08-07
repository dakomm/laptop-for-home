import React, { useEffect, useState } from "react";
import axios from 'axios';
import store from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Calendar, Modal, Select, Col, Row, Button } from 'antd';
import moment from 'moment';
import 'moment/locale/ko';
import './Calendar_Ant.css'
import 'antd/dist/antd.css';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  Table:{
    padding: 5,
  },
  Dialog:{
    fontSize: '1rem',
  }
}));

let idx = 0;

const CalendarAnt = () => {
  const classes = useStyles();
  const [user, setUser] = useState(''); //로그인 user state
  const [date, setDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false); //더블 클릭 시 Modal 띄우기, 닫기
  const [okDialogOpen, setOkDialogOpen] = useState(false); // table 가능 버튼 클릭 시
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false); // table 취소 버튼 클릭 시
  const [dialogMsg, setDialogMsg] = useState(''); // table 버튼 클릭 시 dialogMsg
  const [loginReqDialogOpen, setLoginReqDialogOpen] = useState(false); // 로그인정보 없는 상태에서 table 버튼 클릭 시
  const [impsblDialogOpen, setImpsblDialogOpen] = useState(false); // 예약불가 날짜(과거/7일이후)에서 table 버튼 클릭 시

  const [registerButtonInfo, setRegisterButtonInfo] = useState(); // table 버튼 클릭된 listItem 정보 dialog에 전달
  const [cancelButtonInfo, setCancelButtonInfo] = useState(); // table 버튼 클릭된 listItem 정보 dialog에 전달
  const [dateClicked, setDateClicked] = useState(false); //더블 클릭 시 Modal 띄우기 위해
  const [listData, setListData] = useState([]);

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

  let baseUrl = "http://localhost:8000"

  useEffect(() => {
    resyncDB();
    store.subscribe(()=>{
      const userfromTopAppBar = store.getState().user;
      setUser(userfromTopAppBar);
    })
  },);

  const resyncDB = () => {
    axios
      .get(baseUrl+'/api/listdata/readdb')
      .then((rspn)=>{
        store.dispatch({
          type:'initializecontent',
          listData: rspn.data,
        });
        idx = rspn.data.length;
        setListData(rspn.data);
      });
  }

  function onDateSelect  (value){   //onSelect
    setDate(value);  // 2017-01-25처럼 표시 : selectedValue && selectedValue.format('YYYY-MM-DD')        
    if(dateClicked){
      setIsModalVisible(true);
      setDateClicked(false);
    } 
    setDateClicked(true);
    setTimeout(() => setDateClicked(false), 200);
  }

  const handleGet = (e) => {
    if((date.format('YYYY-MM-DD')>moment().format('YYYY-MM-DD'))&(date.format('YYYY.MM.DD.')<=moment().add(7, 'days').calendar())){
      if(user === ''){
        setLoginReqDialogOpen(true);
        setDialogMsg("로그인이 필요한 서비스입니다. 먼저 로그인하세요!")
      }else{
        setOkDialogOpen(true); 
        setDialogMsg(user + "님, "+date.format('YYYY-MM-DD')+"에 "+e.num+"번 노트북 대여를 신청하시겠어요?");
      }
    }else{
      setImpsblDialogOpen(true); 
      setDialogMsg("파란색 스티커가 표시된 날에만 대여 예약이 가능합니다.");
    }
  };
  const handleCancel = (e) => {
    if((date.format('YYYY-MM-DD')>moment().format('YYYY-MM-DD'))&(date.format('YYYY.MM.DD.')<=moment().add(7, 'days').calendar())){
      setCancelDialogOpen(true);
      setDialogMsg(user + "님, "+date.format('YYYY-MM-DD')+"에 "+e.num+"번 노트북 대여를 취소하시겠습니까?");
    }else{
      setImpsblDialogOpen(true); 
      setDialogMsg("파란색 스티커가 표시된 날에만 대여 예약이 가능합니다.");
    }
  };

  const handleOkDialogConfirmed = () => {
    setOkDialogOpen(false);
    axios.post(
      baseUrl+'/api/listdata/insert',
      {
        id: idx,
        num: registerButtonInfo.num,
        date: date.format('YYYY-MM-DD'),
        getter: user,
      }
    ).then(()=>{
      resyncDB();
    });
  }
  const handleCancelDialogConfirmed = () => {
    setCancelDialogOpen(false);
    console.log("cancelButtonInfo.id=",cancelButtonInfo)
    axios.post(
      baseUrl+'/api/listdata/delete', {
        id: cancelButtonInfo,
      }
    ).then(()=>{
      resyncDB();
    });
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
    }else {
      bookedCnt = 0
      return available = true;
    }
  }

  const tableButtonType = (e)=> {
      // 1. listData 존재
      for(let i=0; i<listData.length; i++){
        if((listData[i].date === date.format('YYYY-MM-DD')) & (listData[i].num === e.num)){
          if(listData[i].getter === user){
            return(
              <Button onClick={()=>{handleCancel(e);setCancelButtonInfo(i)}} danger type="primary" shape="round" size="small" style={{margin:3}}>
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
        <Button onClick={()=>{handleGet(e);setRegisterButtonInfo(e)}} type="primary" shape="round" size="small" style={{margin:3}}>
        가능
        </Button>
      ) 
  }

  function dateCellRender(value) {
    let available = Boolean;
    available = availableDecision(value);
    if((value.format('YYYY-MM-DD')>moment().format('YYYY-MM-DD')) & (value.format("YYYY.MM.DD.")<=moment().add(7, 'days').calendar())){
      if(available){
      return(
        <Grid container direction="column" alignItems="flex-end">
          <Button style={{marginTop: "1em"}} size="small" type="primary" shape="circle">&nbsp;</Button>
        </Grid>
      )}else{return(
        <Grid container direction="column" alignItems="flex-end">
          <Button style={{marginTop: "1em"}} size="small" danger type="primary" shape="circle">&nbsp;</Button>
        </Grid>
      )}
    } 
  };

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
      <DialogTitle disableTypography className={classes.Dialog} id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" autoFocus
          onClick={()=>{handleOkDialogConfirmed();
          }}
        > 네! </Button>
        <Button onClick={()=>{setOkDialogOpen(false)}}>아니요</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={cancelDialogOpen} onClose={()=>{setCancelDialogOpen(false)}} aria-describedby="alert-dialog-description" aria-labelledby="alert-dialog-title">
      <DialogTitle disableTypography className={classes.Dialog} id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" autoFocus
          onClick={()=>{handleCancelDialogConfirmed();
          }}
        > 네! </Button>
        <Button onClick={()=>{setCancelDialogOpen(false)}}>아니요</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={loginReqDialogOpen} onClose={()=>{setLoginReqDialogOpen(false)}} aria-describedby="alert-dialog-description" aria-labelledby="alert-dialog-title">
      <DialogTitle disableTypography className={classes.Dialog} id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" autoFocus
          onClick={()=>{
            setLoginReqDialogOpen(false);
            setIsModalVisible(false)
          }}
        > 확인 </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={impsblDialogOpen} onClose={()=>{setImpsblDialogOpen(false)}} aria-describedby="alert-dialog-description" aria-labelledby="alert-dialog-title">
      <DialogTitle disableTypography className={classes.Dialog} id="alert-dialog-title">{dialogMsg}</DialogTitle>
      <DialogActions>
        <Button color="primary" autoFocus onClick={()=>{setImpsblDialogOpen(false);}}
        > 확인 </Button>
      </DialogActions>
    </Dialog>

    </div>
  )
}

export default (CalendarAnt);
