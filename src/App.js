import React, { Component, useEffect, useState } from "react";
import TopAppBar from "./components/TopAppBar";
import Main from "./components/main";

import { withStyles } from "@material-ui/core";

const styles = theme => ({
  root:{
    width: "100%",
    height: "100%"
  },
  main:{
    height: "50%"
  }
});

export default function App() {
  //const classes = props;
  const classes = styles();

  return (
    <div className="App">
      <TopAppBar/>
      <Main className="main"/>
      
    </div>
  );
}

//export default withStyles(styles)(App);
