import React, {useState} from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import '../css/dropdown.css'

function CustomDropDownMenu({buttonText, children}: dropDownProps) {
    const[menuOpen, setMenuOpen] = useState(false)

    function toggleMenu() {
        setMenuOpen(!menuOpen)
    }

    return (
    <div className={`dropdown-menu-wrapper ${menuOpen ? 'open': ''}`}>
        <button
            type="button"
            onClick={toggleMenu}
            title={buttonText}
            className={"dropdown-menu-button"}>

            <span>{buttonText}</span>
            <div className={"dropdown-menu-button-icon"}><IoMdArrowDropdown/></div>
        </button>
        <div className={`dropdown-menu-wrapper content ${menuOpen ? 'open' : ''}`}>
            {children}
        </div>
    </div>
    )
}

function CustomDropDownItem() {
    return (
    <div>

    </div>)
}

interface dropDownProps {
    buttonText?: string
    children?: React.ReactNode
}


export default CustomDropDownMenu;