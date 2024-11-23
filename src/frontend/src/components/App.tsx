import React from 'react';
import logo from '../logo.svg';
import '../css/styles.css';
import DiscordAuthentication from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Home from "../pages/Home";
import {Route, Routes} from "react-router-dom";
import Profile from "../pages/Profile";
import User from "../pages/User";
import Whitelist from "../pages/Whitelist";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient();

function App() {
  return (
  <QueryClientProvider client={queryClient}>
    <div className="app-container">
        <Navbar></Navbar>
        <div className="body">
            <Sidebar></Sidebar>
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/whitelist" element={<Whitelist />} />
                </Routes>
            </div>
        </div>
    </div>
  </QueryClientProvider>
  );
}

export default App;
