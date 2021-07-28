import React,{ useState } from 'react';
import axios from 'axios';
import store from '../store';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, Snackbar, Grid, Slide} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openFailSnackbar, setOpenFailSnackbar] = useState(false);
  const [snackbarContent, setSnackbarContent] = useState('');

  let baseUrl = "http://localhost:8000"

  // useEffect(() => {    
  // },[]);

  const logInButton = () => {
    if(logIO === 'log in') setIsModalVisible(true);
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
  const modalLogInButton = async () => {
    var chkUserResult = await ChkUserInfo(userID)
    if(chkUserResult !== false){ 
      store.dispatch({
        type: 'changeuser',
        user: chkUserResult,
      });
      setIsModalVisible(false);
      setLogIO('log out');
      setSnackbarContent(chkUserResult+'님, Welcome!');  
      setOpenSnackbar(true);
      setTimeout(()=>{setOpenSnackbar(false)},1800);
    }else{
      setIsModalVisible(false);
      setOpenFailSnackbar(true);
      setTimeout(()=>{setOpenFailSnackbar(false)},6000);
      console.log("failed",chkUserResult, userID)
    }
  }

  const onIDChange = (e) => {
    setUserID(e.target.value)
  }

  // const resyncDB = async (name,id) => {
  //   await axios 
  //     .get(baseUrl+'/api/membersinfo/readdb')
  //     .then(async(rspn) => {
  //       for(let i=0; i<rspn.data.length; i++){
  //         console.log(rspn.data[i].user_name);
  //         console.log(rspn.data[i].user_id);
  //         console.log(name,id);
  //         console.log(name === rspn.data[i].user_name & id === rspn.data[i].user_id)
  //         if(name === rspn.data[i].user_name & id === rspn.data[i].user_id){
  //            await setUser(name);
  //         }
  //       }
  //     });
  // }
  const ChkUserInfo = async (id) => {
    const dbResult = await axios.post(baseUrl+'/api/membersinfo/chkuserinfo',
    {id: id}
    );
    console.log(dbResult.data)
    if(dbResult.data !== false){
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
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
          LAPTOP for YOU
          </Typography>
          <Button color="inherit">{store.getState().user}</Button>
          <Button variant="outlined" className={classes.logInButton} onClick={()=>{logInButton()}}>{logIO}</Button>
        </Toolbar>
      </AppBar>

      <Modal
        visible={isModalVisible & (logIO === 'log in')} 
        onCancel={() => {setIsModalVisible(false);}}
        width={'250px'}
        closable
        footer={[
          <Grid container direction="column" alignItems="center">
            <Button type="primary" onClick={()=>{modalLogInButton()}}> Log In </Button>
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