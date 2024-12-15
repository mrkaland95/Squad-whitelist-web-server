import React, {useState} from "react";
import { IoChevronDown } from "react-icons/io5";
import '../css/dropdown.css'



function ExpandableDropdown({buttonTitle, buttonText, children}: DropDownProps) {
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const chevronSize = 20


    if (!dropDownOpen) {
        return (
            <div className="custom-dropdown-wrapper closed">
                <button className={"custom-dropdown-button"} title={buttonTitle} type={"button"} onClick={() => setDropDownOpen(!dropDownOpen)}>
                    <span>{buttonText}</span>
                    <div><IoChevronDown size={chevronSize}/></div>
                </button>
            </div>
        )
    } else {
        return (
            <div className={"custom-dropdown-wrapper open"}>
                <button className={"custom-dropdown-button open"} title={buttonTitle} type={"button"} onClick={() => setDropDownOpen(!dropDownOpen)}>
                    <span>{buttonText}</span>
                    <div className={"custom-dropdown-icon open"}><IoChevronDown size={chevronSize}/></div>
                </button>
                <hr/>
                <div className={"custom-dropdown-content"}>
                    {children}
                </div>
            </div>)
    }
}

interface DropDownProps {
    buttonTitle?: string
    buttonText?: string
    children?: React.ReactNode
}



export default ExpandableDropdown