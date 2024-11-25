import React, {FormEvent, useState} from "react";
import axios from "axios";
import {steamID64Regex} from "../utils/utils";
import Swal from "sweetalert2";
import steamLogo from '../public/steam-icon-wide.png'


axios.defaults.withCredentials = true

function User() {
    const [userSteamID, setUserSteamID] = useState<string>('')

    async function userOnSubmit(event: FormEvent) {
        event.preventDefault()

        console.log(steamID64Regex.test(userSteamID));
        // TODO  Add warn that steamID is not valid here.|

        const result = await axios({
            url: "http://localhost:5000/api/profile/userid",
            method: "POST",
            data: { steamID: userSteamID }
        })

        if (result.status != 200) {
            return
        }

        await Swal.fire("Sucessfully installed unlinked ID", "", "success")
    }

    function handleInputChange(value: string) {
        setUserSteamID(value)
    }

    return (
    <div className={"user-container"}>
        <h1>
        User "PLACEHOLDER FOR DISCORD NAME HERE"
        </h1>
        <br/>
        <h3>
            This page is used for linking the logged in discord account to a steamID. <br/>
        </h3>
        <br/>
        <p style={{paddingBottom: '1rem'}}>
            Certain features may require you to have authenticated yourself with Steam. <br/>
        </p>
        <p>
            The steamID can then be used to receive in-game whitelist, or admin permissions, if applicable.
        </p>
        <b/>
        <form onSubmit={userOnSubmit}>
            <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                <input
                className={"steam-id-input"}
                type={"text"}
                value={userSteamID}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={"SteamID"}
                maxLength={17}
                required={true}
                style={{padding: '0.5rem', marginRight: '0.5rem'}}
                />
                {/* The button/anchor needs a little bit of padding otherwise it's not aligned with the input box.*/}
                <a href={"http://localhost:5000/api/steamauth"} style={{paddingTop: '0.25rem'}}>
                    <img title={"Link your account with Steam"} alt={"Authenticate With Steam"} src={steamLogo}/>
                </a>
            </div>
        <br/>
        <button type={"submit"}  className={"default-button"}>Submit</button>
        </form>
    </div>)
    // TODO add a "help" section on what a SteamID is and how to find it.
}

function onSteamButtonClick(e: any) {
    console.log(e)
}

type UserSteamID = {
    steamID?: string,
    linkedToSteam: boolean
}

export default User
