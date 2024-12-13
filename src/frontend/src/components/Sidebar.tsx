import React, {useState} from "react";
import ToggleButton from "./Toggle-Button";


function Sidebar() {
    const [userCollapse, setUserCollapse] = useState(false);
    const [adminCollapse, setAdminCollapse] = useState(false);

    function toggleAdminDash() {
        setAdminCollapse(!adminCollapse);
    }

    return (
        <div className={"sidebar-div"}>
            <div className={"sidebar-div elements"}>

            <h2>Options</h2>
            <div className={"sidebar-users-div"}>
                <ul>
                    <li>
                        <div>TODO MANAGE USER DROPDOWN HERE</div>
                    </li>
                    <li>
                        <a href={"/profile"}>Profile</a>
                    </li>
                    <li>
                        <a href={"/user"}>User</a>
                    </li>
                    <li>
                        <a href={"/whitelist"}>Whitelist</a>
                    </li>
                </ul>
            </div>
            {/*<h3 onClick={toggleAdminDash}>Admin Dashboard</h3>*/}
            <button onClick={toggleAdminDash}>Admin Dashboard</button>
            <ul>
                <li>
                    <a href={"/admingroups"}>Admin Groups</a>
                </li>
                <li>
                    <a href={"/rolesedit"}>Special Roles</a>
                </li>
                <li>
                    <a href={"/listsedit"}>Lists Endpoints</a>
                </li>
            </ul>
            </div>
        </div>
    )
}


export default Sidebar