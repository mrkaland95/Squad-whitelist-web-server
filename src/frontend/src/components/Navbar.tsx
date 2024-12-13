import '../css/styles.css'


function Navbar({onToggleSideBar}: any) {
    return (
    <nav className="nav-container">
        <a href="/" className="site-title" style={{textDecoration: 'none', color: 'white'}}>
            Test Name
        </a>
        <ul>
            <li>
                <a href={"/profile"}>profile</a>
            </li>
            <li>
                <a href={"/user"}>user</a>
            </li>
        </ul>
        <button onClick={onToggleSideBar}>Collapse</button>
        <div>
            <a href={"#"}>Login With Discord</a>
        </div>
    </nav>)
}



export default Navbar

