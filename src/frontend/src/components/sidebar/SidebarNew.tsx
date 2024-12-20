import React, {useState} from "react";
import { GoHomeFill } from "react-icons/go";
import './sidebar.css'
import {IoChevronDown} from "react-icons/io5";
import { FaUser } from "react-icons/fa";

function Sidebar({open}: SideBarProps) {
    return (
        <div className={`sidebar-container ${open ? 'open' : ''}`}>
            <nav>
                <SideBarAnchorElement buttonText={"Home"} href={"/"} icon={<GoHomeFill/>}/>
                <SidebarDropDownElement buttonText={"User"} icon={<FaUser/>}>
                    <SideBarAnchorElement buttonText={"Profile"} href={"/profile"}/>
                    <SideBarAnchorElement buttonText={"User"} href={"/user"}/>
                    <SideBarAnchorElement buttonText={"Whitelist"} href={"/whitelist"}/>
                </SidebarDropDownElement>

                <SidebarDropDownElement buttonText={"Server Dashboard"}>
                    <SideBarAnchorElement buttonText={"Admin Groups"} href={"/admingroups"}/>
                    <SideBarAnchorElement buttonText={"Discord Roles"} href={"/admingroups"}/>
                    <SideBarAnchorElement buttonText={"List Endpoints"} href={"/listsedit"}/>
                </SidebarDropDownElement>
            </nav>
        </div>
    )
}

function SideBarDividerElement() {
    return (<div className={"sidebar-divider"}></div>)
}

function SideBarAnchorElement({buttonText, href, icon}: SideBarAnchorProps) {
    return (
    <li className={"sidebar-anchor-list"}>
        <a href={href} className={"sidebar-anchor"}>
            <span className={`anchor-icon`}>{icon}</span>
            <span className={`anchor-text`}>{buttonText}</span>
        </a>
    </li>
    )
}

/**
 * Component that represents a dropdown menu embedded within the sidebar.
 * @param buttonText
 * @param children
 * @param icon Icon displayed to left of the text.
 * @param openState {boolean}
 */
function SidebarDropDownElement({buttonText, children, icon, openState}: SideBarDropDownProps) {
    if (!openState) {
        openState = false
    }
    const [menuOpen, setMenuOpen] = useState(openState)

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    return (
    <div className={`sidebar-dropdown-wrapper ${menuOpen ? "open" : ""}`}>
        <button onClick={toggleMenu} className={`sidebar-dropdown-button ${menuOpen ? "open" : ""}`}>
            <span className={`menu-icon`}>
                {icon}
            </span>
            <span className={"sidebar-dropdown-text"}>
                {buttonText}
            </span>
            <span className={`sidebar-dropdown-icon ${menuOpen ? "open" : ""}`}>
                <IoChevronDown/>
            </span>
        </button>
        <ul className={`sidebar-menu-content ${menuOpen ? "open" : ""}`}>
            {children}
        </ul>
    </div>
    )
}

interface SideBarProps {
    open: boolean;
}

interface SideBarAnchorProps {
    buttonText: string;
    icon?: React.ReactNode;
    href: string;
}

interface SideBarDropDownProps {
    children?: React.ReactNode;
    buttonText: string;
    icon?: React.ReactNode;
    openState?: boolean;
}


export default Sidebar