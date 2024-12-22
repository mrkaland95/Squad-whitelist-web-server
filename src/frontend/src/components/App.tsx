import React, {useState} from 'react';
import '../css/styles.css';
import '../css/table.css'
import '../css/globals.css'
import Home from "../pages/Home";
import {Navigate, Route, Routes} from "react-router-dom";
import Profile from "../pages/Profile";
import User from "../pages/User";
import Whitelist from "../pages/Whitelist";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AdminGroups from "../pages/AdminGroups";
import RoleEdit from "../pages/RoleEdit";
import ListEdit from "../pages/ListEdit";
import SidebarNew from "./sidebar/Sidebar";
import {NavBar} from "./navbar/NavBar";
import AuthProvider, {useAuth} from "./AuthProvider";
import user from "../pages/User";


const queryClient = new QueryClient();

function App() {
    const [sideBarOpen, setSideBarOpen] = useState(true);

    function toggleSideBar() {
        setSideBarOpen(!sideBarOpen);
    }

    return (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <div className="app-container">
                <NavBar sidebarOpen={sideBarOpen} sidebarToggleCb={toggleSideBar}></NavBar>
                <div className="body">
                    <SidebarNew open={sideBarOpen}/>
                    <div className="content-container">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/profile" element={<AuthenticatedRoute element={<Profile />} />} />
                            <Route path="/user" element={<AuthenticatedRoute element={<User />} />} />
                            <Route path="/whitelist" element={<AuthenticatedRoute element={<Whitelist />} />} />
                            <Route path="/admingroups" element={<AdminAuthorizedRoute element={<AdminGroups />} />} />
                            <Route path="/rolesedit" element={<AdminAuthorizedRoute element={<RoleEdit />} />} />
                            <Route path="/listsedit" element={<AdminAuthorizedRoute element={<ListEdit />} />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </AuthProvider>
    </QueryClientProvider>
    );
}

function AuthenticatedRoute({ element }: any) {
    const user = useAuth().user?.isAuthenticated

    if (!user) {
        return <Navigate to={"/"}/>
    }

    return element
}

function AdminAuthorizedRoute({ element }: any) {
    const isAdmin = useAuth().user?.isAdmin

    if (!isAdmin) {
        return <Navigate to={"/"}/>
    }

    return element
}



export default App;
