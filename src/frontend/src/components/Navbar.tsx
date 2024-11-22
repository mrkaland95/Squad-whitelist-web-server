import '../css/styles.css'


function Navbar() {
    return (<nav className="nav-container">
        <a href="/" className="site-title">
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

    </nav>)
}



export default Navbar

