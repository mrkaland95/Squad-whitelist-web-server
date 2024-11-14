import React from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import DiscordAuthentication from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function App() {
  return (
    <div className="app-container">
        <Navbar></Navbar>
        <div className="body">
            <Sidebar></Sidebar>
            <div className="content">
                <p>
                Squad Whitelist Management page
                </p>
                <DiscordAuthentication></DiscordAuthentication>
            </div>
        </div>
    </div>
  );
}

export default App;
