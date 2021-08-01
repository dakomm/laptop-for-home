import {createStore} from 'redux';

export default createStore(function(state,action){
  if(state === undefined){
    return {
      user:'',
      // listData:[]
    };
  }
  switch(action.type){
    case 'changeuser':
      state.user = action.user;
      return state;

    case 'initializeListData':
      state.listData = [];
      for(var i=0; i<action.listData.length; i++){
        state = {
          listData: [...state.listData, action.listData[i]]
        };
      }
      return state;
      
    case 'openHistory':
      state.open = action.open;
      return state;

    // case 'loginReq':
    //   state.loginReq = action.loginReq;
    //   console.log(state.loginReq)
    //   return state;
     
    default:
      return state;
  }
}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
