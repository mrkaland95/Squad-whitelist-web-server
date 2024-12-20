import React, {useState} from 'react';
import '../css/styles.css';
import '../css/table.css'
import DiscordAuthentication from "./Login";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Home from "../pages/Home";
import {Route, Routes} from "react-router-dom";
import Profile from "../pages/Profile";
import User from "../pages/User";
import Whitelist from "../pages/Whitelist";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AdminGroups from "../pages/AdminGroups";
import RoleEdit from "../pages/RoleEdit";
import ListEdit from "../pages/ListEdit";
import SidebarNew from "./sidebar/SidebarNew";


const queryClient = new QueryClient();

function App() {
    const [sideBarOpen, setSideBarOpen] = useState(true);

    function toggleSideBar() {
        setSideBarOpen(!sideBarOpen);
    }

    return (
    <QueryClientProvider client={queryClient}>
    <div className="app-container">
        <Navbar onToggleSideBar={toggleSideBar}></Navbar>
        <div className="body">
            <SidebarNew open={sideBarOpen}/>
            <div className="content-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/whitelist" element={<Whitelist />} />
                    <Route path="/admingroups" element={<AdminGroups />} />
                    <Route path="/rolesedit" element={<RoleEdit />} />
                    <Route path="/listsedit" element={<ListEdit />} />
                </Routes>
            </div>
        </div>
    </div>
    </QueryClientProvider>
    );
}

export default App;
