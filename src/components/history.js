import React,{ useEffect, useState } from 'react';
import axios from 'axios';
import store from '../store';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Paper, Box, Tab, Tabs, Typography, Select, MenuItem, InputLabel, InputBase, FormControl, List, ListItem, Button, Snackbar, Grid} from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { Close, ExpandLess, ExpandMore } from '@material-ui/icons';
import {  } from '@material-ui/lab';
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  InputLabel: {
    width: '100px',
  },
  margin: {
    margin: theme.spacing(1),
  },
  Table:{
    padding: 5,
  },

}));

const History = () => {
  const classes = useStyles();
  const [user, setUser] = useState(''); // store에서 가져온 값
  // const [isOpenHistory, setIsOpenHistory] = useState(false); // store에서 가져온 값 when 메뉴아이콘 clicked
  const [listByGetter, setListByGetter] = useState([]); // server에서 받아온 배열
  const [listByNum, setListByNum] = useState([]); // server에서 받아온 배열
  const [selectedNum, setSelectedNum] = useState(''); // select에서 선택한 num
  // const [loginReq, setLoginReq] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isUserOk, setIsUserOk] = useState(false);
 
  
  const listItem = [
    {no:0, num: '65'},
    {no:1, num: '66'},
    {no:2, num: '70'},
    {no:3, num: '75'},
    {no:4, num: '77'},
    {no:5, num: '82'},
    {no:6, num: '85'},
    {no:7, num: '86'}
];
  let baseUrl = "http://localhost:8000"

  useEffect(() => {
    store.subscribe(()=>{
      const userfromTopAppBar = store.getState().user;
      setUser(userfromTopAppBar);
      userfromTopAppBar==='' ?  setIsUserOk(false) : setIsUserOk(true);
    })
  },[]);

  useEffect(() => {
    setListByNum([]);
    console.log("1")
    axios
      .post(baseUrl+'/api/listdata/listupbynum',{num: selectedNum})
      .then((rspn)=>{
        console.log("listupbynum의 rspn:",rspn.data)
        for(let i=0; i<rspn.data.length; i++){
          setListByNum([...listByNum, rspn.data[i]]);
          console.log("2")

        }
      });
  },[selectedNum]);

  const resyncDB = () => {
    axios
      .post(baseUrl+'/api/listdata/listupbygetter',{getter: user})
      .then((rspn)=>{
        console.log("listupbygetter의 rspn:",rspn.data)
        for(let i=0; i<rspn.data.length; i++){
          setListByGetter([...listByGetter, rspn.data[i]]);
        }
      });
    axios
      .post(baseUrl+'/api/listdata/listupbynum',{num: selectedNum})
      .then((rspn)=>{
        console.log("listupbynum의 rspn:",rspn.data)
        for(let i=0; i<rspn.data.length; i++){
          setListByNum([...listByNum, rspn.data[i]]);
        }
      });
  }

  const myHistory = () => {
    if(user !== ''){
      // store.dispatch({
      //   type: 'loginReq',
      //   loginReq: loginReq,
      // });
      console.log("나의 히스토리 클릭")
      
    }
  }

  const laptopHistory = () => {
    
    console.log("selected listByNum: ",listByNum)
    if(selectedNum !== ''){
      return(
        <TableContainer >
          <Table stickyHeader>
            <TableHead ><TableRow>
              <TableCell align="center" style={{fontWeight:"bolder",padding:"10px"}}>자산번호</TableCell>
              <TableCell align="center" style={{fontWeight:"bolder",padding:"10px"}}>Date</TableCell>
              <TableCell align="center" style={{fontWeight:"bolder",padding:"10px"}}>예약자</TableCell>
            </TableRow></TableHead>
            <TableBody >
              {listByNum.map((e) => (
                <TableRow key={e.id} >
                  <TableCell className={classes.Table} align="center">{e.num} </TableCell>
                  <TableCell className={classes.Table} align="center">{e.date}</TableCell>
                  <TableCell className={classes.Table} align="center">{e.getter}</TableCell>
                </TableRow>
              ))}
          </TableBody>
          </Table>
        </TableContainer>
      );
    }
  }

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleNumChange = (event) => {
    setSelectedNum(event.target.value);
  };

  return(
    <div className={classes.root}>
      <Paper square>
        <Tabs value={tabValue}
          indicatorColor="primary" textColor="primary"
          onChange={handleChange}
        >
          <Tab label="노트북 별 History" {...a11yProps(0)}/>
          <Tab label="나의 History" {...a11yProps(1)} disabled={!isUserOk}/>
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <FormControl className={classes.margin}>
          <InputLabel id="num-label" className={classes.InputLabel}>노트북 번호</InputLabel>
          <Select
            labelId="num-label"
            id="num-select"
            value={selectedNum}
            onChange={handleNumChange}
            input={<BootstrapInput style={{width:'100px'}} />}
          >
            <MenuItem dense><em>None</em></MenuItem>
            {listItem.map((e) => {
                return(<MenuItem dense value={e.num}>{e.num}</MenuItem>);
              })}
          </Select>
        </FormControl>
        {laptopHistory()}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {myHistory()}
      </TabPanel>

    </div>
  );
}
export default (History);

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={1}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system','BlinkMacSystemFont','"Segoe UI"','Roboto','"Helvetica Neue"','Arial',
      'sans-serif','"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);