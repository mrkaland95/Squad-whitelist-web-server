import React from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import DiscordAuthentication from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";



function App() {
  return (
    <div className="App">
      <header className="App-header">


        {/*<img src={logo} className="App-logo" alt="logo" />*/}

        {/*<p>*/}
        {/*  Edit <code>src/App.tsx</code> and save to reload.*/}
        {/*</p>*/}
      </header>
    <div className={"content-body"}>
        <Navbar></Navbar>
        <Sidebar></Sidebar>
        <DiscordAuthentication></DiscordAuthentication>
    <div> Squad Whitelist Management page</div>

    </div>
    </div>
  );
}

export default App;
