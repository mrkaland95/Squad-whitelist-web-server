import { FaRegTrashAlt } from "react-icons/fa";
import { BsTrashFill } from "react-icons/bs";
import { FaRegTrashCan } from "react-icons/fa6";
import './delete-button.css'


function DeleteButton({buttonText, buttonTitle, id, onClick}: ButtonProps) {
    if (!buttonTitle) {
        buttonTitle = buttonText;
    }

    return (
        <button
            title={buttonTitle}
            onClick={() => onClick && onClick()}
            id={id}
            type={"button"}
            className={"delete-button2"}
        >
            <span className="delete-button2-icon">
                <FaRegTrashCan size={"16"}/>
            </span>
                <span className="delete-button2-text">
                DELETE
            </span>
        </button>)
}

interface ButtonProps {
    buttonText: string;
    buttonTitle?: string
    id?: string;
    onClick?: Function
}

export default DeleteButton