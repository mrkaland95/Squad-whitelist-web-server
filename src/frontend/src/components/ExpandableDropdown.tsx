import React, {useState} from "react";
import { IoChevronDown } from "react-icons/io5";
import '../css/dropdown.css'



function ExpandableDropdown({buttonTitle, buttonText}: any) {
    const [dropDownOpen, setDropDownOpen] = useState(false)

    if (!dropDownOpen) {
        return (
            <div className="custom-dropdown-wrapper closed">
                <button className={"custom-dropdown-button closed"} title={buttonTitle} type={"button"} onClick={() => setDropDownOpen(!dropDownOpen)}>
                    {buttonText}
                    <div><IoChevronDown/></div>
                </button>
            </div>
        )
    } else {
        return (
            <div className={"custom-dropdown-wrapper open"}>
                <button className={"custom-dropdown-button open"} title={buttonTitle} type={"button"} onClick={() => setDropDownOpen(!dropDownOpen)}>
                    {buttonText}
                    <div><IoChevronDown/></div>
                </button>
            </div>)
    }
}

interface DropDownProps {
    buttonTitle: string
    buttonText: string
}



export default ExpandableDropdown