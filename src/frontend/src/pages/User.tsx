import React, {FormEvent, useEffect, useState} from "react";
import axios from "axios";
import {steamID64Regex} from "../utils/utils";
import Swal from "sweetalert2";
import steamLogo from '../public/steam-icon-wide.png'
import {getAdminGroups, getUserSteamID, postUserSteamID} from "../utils/fetch";
import {useQuery} from "@tanstack/react-query";


axios.defaults.withCredentials = true

function User() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['userSteamID'],
        queryFn: getUserSteamID,
    });



    if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;
    if (error) return <p>Unable to retrieve user</p>;
    if (!data) return <p>Something went wrong when loading your whitelist data</p>


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
        <UserForm userData={data.data}></UserForm>

    </div>)
    // TODO add a "help" section on what a SteamID is and how to find it.
}

function UserForm({userData}: any) {
    const [user, setUser] = useState<IDiscordUser>(userData)

    async function userOnSubmit(event: FormEvent) {
        event.preventDefault()

        const steamID = user.UserID64?.steamID

        if (!steamID) {
            return
        }

        console.log(event)

        console.log(steamID64Regex.test(steamID));
        // TODO  Add warn that steamID is not valid here.|

        const result = await postUserSteamID(steamID)

        if (result.status != 200) {
            return
        }

        await Swal.fire("Sucessfully installed unlinked ID", "", "success")
    }

    return (
        <form onSubmit={userOnSubmit}>
            <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                <label>
                    <input
                        className={"steam-id-input"}
                        type={"text"}
                        value={user.UserID64?.steamID}
                        onChange={(e) => {
                            const newUser = {...user}

                            newUser.UserID64 = {
                                steamID: e.target.value,
                                isLinkedToSteam: false
                            }

                            setUser(newUser)
                        }}

                        placeholder={"SteamID"}
                        maxLength={17}
                        required={true}
                        style={{padding: '0.5rem', marginRight: '0.5rem'}}
                    />
                </label>

                {/* The button/anchor needs a little bit of padding otherwise it's not aligned with the input box.*/}
                <a href={"http://localhost:5000/api/steamauth"} style={{paddingTop: '0.25rem'}}>
                    <img title={"Link your account with Steam"} alt={"Authenticate With Steam"} src={steamLogo}/>
                </a>
            </div>
            <br/>
            <button type={"submit"} className={"default-button"}>Submit</button>
        </form>
    )
}

function onSteamButtonClick(e: any) {
    console.log(e)
}

type UserSteamID = {
    steamID?: string,
    linkedToSteam: boolean
}

export interface IDiscordUser {
    DiscordID: string;
    DiscordName: string;
    Roles: string[];
    Whitelist64IDs: { steamID: string; name?: string }[];
    UserID64?: { steamID: string; isLinkedToSteam: boolean };
    Enabled: boolean;
}

export default User
