import React from 'react';
import logo from '../logo.svg';
import '../css/App.css';
import DiscordAuthentication from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Home from "./Home";
import {Route, Routes} from "react-router-dom";
import Profile from "./not-implemented/Profile";
import Admin from "./not-implemented/Admin";
import Whitelist from "./not-implemented/Whitelist";

function App() {
  return (
    <div className="app-container">
        <Navbar></Navbar>
        <div className="body">
            <Sidebar></Sidebar>
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user" element={<Admin />} />
                    <Route path="/whitelist" element={<Whitelist />} />
                </Routes>
            </div>
        </div>
    </div>
  );
}

export default App;
