


function Sidebar() {
    return (
        <div className={"sidebar-div"}>
            <h2>Options</h2>
            <ul>
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
    )
}


export default Sidebar