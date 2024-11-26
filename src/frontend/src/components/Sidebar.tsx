


function Sidebar() {
    return (
        <div className={"sidebar-div"}>
            <h2>Options</h2>
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
            <h3>Admin Dashboard</h3>
            <ul>
                <li>
                    <a href={"/admingroups"}>Admin Groups</a>
                </li>
                <li>
                    <a href={"/rolesedit"}>Roles</a>
                </li>
                <li>
                    <a href={"listsedit"}>Lists</a>
                </li>
            </ul>
        </div>
    )
}


export default Sidebar