import React,{ useState, useEffect } from 'react';
import axios from 'axios';
import store from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Snackbar, Grid, Slide} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { History, Event } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { Modal, Input, Divider, Space, Select, Col, Row, message} from 'antd';
import { UserOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
function SlideTransition(props) {
  return <Slide {...props} direction="down"/>;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  AppBar: {
    backgroundColor : "#447a9c",
  },
  menuButton: {
    color: '#ffb10a',
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: '#ffb10a',
    fontWeight: 'bold',
  },
  logInButton: {
    color: '#ffb10a',
    borderColor: '#ffb10a',
    marginLeft: theme.spacing(1),
    padding : theme.spacing(1)
  }
}));

const TopAppBar = () => {
  const classes = useStyles();
  const [user, setUser] = useState(''); // db에 존재하는 유저면 확정됨
  // const [userName, setUserName] = useState(''); //로그인창 onChange 시 바뀌는 tmp입력값
  const [userID, setUserID] = useState(''); //로그인창 onChange 시 바뀌는 tmp입력값
  const [logIO, setLogIO] = useState('log in');
  const [isLogInModalVisible, setIsLogInModalVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openFailSnackbar, setOpenFailSnackbar] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');
  const [isOpenHistory, setIsOpenHistory] = useState(false);

  let baseUrl = "http://localhost:8000"


  const logInButton = () => {   // TopAppBar의 로그인/로그아웃 버튼 클릭 시 
    if(logIO === 'log in') setIsLogInModalVisible(true);
    if(logIO === 'log out') {
      setLogIO('log in');
      setUserID('');
      store.dispatch({
        type: 'changeuser',
        user: '',
      });
      setOpenSnackbar(true);
      setTimeout(()=>{setOpenSnackbar(false)},1800);
      setSnackbarContent('Logged Out!');  
      console.log("log out",user, userID)

    }
  }
  const modalLogInButton = async () => {  // 로그인 창에서 login 버튼 클릭 시
    var chkUserResult = await ChkUserInfo(userID) // user 이름 또는 false 리턴
    if(chkUserResult !== false){  // user 정보 일치 시
      store.dispatch({
        type: 'changeuser',
        user: chkUserResult,
      });
      setIsLogInModalVisible(false);
      setLogIO('log out');
      setSnackbarContent(chkUserResult+'님, Welcome!');  
      setOpenSnackbar(true);
      setTimeout(()=>{setOpenSnackbar(false)},1800);
    }else{                        // user 정보 불일치 시
      setOpenFailSnackbar(true);
      setTimeout(()=>{setOpenFailSnackbar(false)},6000);
      console.log("failed",chkUserResult, userID)
    }
  }

  const onIDChange = (e) => {
    setUserID(e.target.value)
  }

  const ChkUserInfo = async (id) => {
    const dbResult = await axios.post(baseUrl+'/api/membersinfo/chkuserinfo',
    {id: id}
    );
    console.log(dbResult.data)
    if(dbResult.data !== false){    // user 정보 일치 시
      return dbResult.data;
    }else{
      return false;
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.AppBar}>
        <Toolbar >
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            {isOpenHistory ? 
              <History onClick={()=>{setIsOpenHistory(false); store.dispatch({type: 'openHistory', open:false});}}/> 
            : <Event onClick={()=>{setIsOpenHistory(true); store.dispatch({type: 'openHistory', open:true});}}/>}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          LAPTOP for YOU
          </Typography>
          <Button color="inherit">{store.getState().user}</Button>
          <Button variant="outlined" className={classes.logInButton} onClick={()=>{logInButton()}}>{logIO}</Button>
        </Toolbar>
      </AppBar>

      <Modal
        visible={isLogInModalVisible & (logIO === 'log in')} 
        onCancel={() => {setIsLogInModalVisible(false);}}
        width={'250px'}
        closable
        footer={[
          <Grid container direction="column" alignItems="center">
            <Button type="primary" autoFocus onClick={()=>{modalLogInButton()}}>Log In</Button>
          </Grid>
        ]}
      >
        <Space direction="vertical"><br/>
          <Input placeholder="사번" value={userID} onChange={onIDChange} onPressEnter={()=>{modalLogInButton()}} prefix={<UserOutlined/>} required allowClear/>
        </Space>
      </Modal>

      <Snackbar open={openSnackbar}>
        <Alert severity="success" TransitionComponent={SlideTransition}>{snackbarContent}</Alert>
      </Snackbar>
      <Snackbar open={openFailSnackbar}>
        <Alert severity="success" TransitionComponent={SlideTransition}>Log In Failed : 입력 정보를 확인하세요. 문의:김다경 연구</Alert>
      </Snackbar>

    </div>
  );
}

export default (TopAppBar);