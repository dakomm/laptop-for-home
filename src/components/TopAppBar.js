import React,{ useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, IconButton, } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { green } from '@material-ui/core/colors';
import { Modal, Input, Alert, Divider, Space, Select, Col, Row, message} from 'antd';
import { UserOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

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
  const [user, setUser] = useState('');
  const [userName, setUserName] = useState('');
  const [userID, setUserID] = useState('');
  const [logIO, setLogIO] = useState('log in');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const logInButton = () => {
    if(logIO === 'log in') setIsModalVisible(true);
    else {
      setLogIO('log in');
      setUser(''); 
      setUserName('');
      setUserID('');
    }
  }
  const modalLogInButton = (e) => {
    // if(){  //TODO: userID, name verify!
    // }
    setUser(userName);
    setIsModalVisible(false);
    setLogIO('log out');
  }

  const onNameChange = (e) => {
    setUserName(e.target.value)
  }
  const onIDChange = (e) => {
    setUserID(e.target.value)
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
          <Button color="inherit">{user}</Button>
          <Button variant="outlined" className={classes.logInButton} onClick={()=>{logInButton()}}>{logIO}</Button>
        </Toolbar>
      </AppBar>

      <Modal 
        visible={isModalVisible & (logIO === 'log in')} 
        onCancel={() => {setIsModalVisible(false);}}
        width={'250px'}
        closable
        footer={[
          <Button type="primary" onClick={()=>{modalLogInButton()}}>
            Log In
          </Button>
          ]}
      >
        <Space direction="vertical"><br/>
          <Input placeholder="이름" onChange={onNameChange}prefix={<UserOutlined/>} allowClear/>
          <Input.Password placeholder="사번" onChange={onIDChange} onPressEnter={()=>{modalLogInButton()}} prefix={<UserOutlined/>} allowClear/>
        </Space>
      </Modal>
    </div>
  );
}

export default (TopAppBar);