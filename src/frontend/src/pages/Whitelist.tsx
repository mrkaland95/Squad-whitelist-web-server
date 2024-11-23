import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import React, {useEffect, useState} from "react";
import {IPrivilegedRole} from "../../../../dist/backend/schema";
import * as sweetalert2 from "sweetalert2";
import Swal from "sweetalert2";
import {steamID64Regex, WeekDays} from "../utils/utils";


export type WhitelistResponseData = {
    isAuthenticated: boolean,
    validRoles: IPrivilegedRole[],
    whitelistSlots: number,
    whitelistActiveDays: number[],
    whitelistedSteam64IDs: {
        steamID:string
        name?: string,
    }[],
}

type WhitelistFormProps = {
    whitelist: WhitelistRow[]
    whitelistSlots: number,
    onSubmit: (data: WhitelistRow[]) => void
}

type WhitelistRow = {
    steamID: string
    name?: string
}

const daysMap = new Map([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
])


function Whitelist() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['whitelist'],
        queryFn: fetchUsersWhitelists,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>Something went wrong when loading your whitelist data</p>

    const activeDaysList = data.whitelistActiveDays.map(day => {
        return daysMap.get(day)
    })

    return (
    <>
        <div className={"whitelist-container"}>
            <h1>
                Whitelist
            </h1>
            <h3>
                On this page you can add other people's steamIDs to whitelist.
            </h3>
            <p>You currently have {data.whitelistSlots} whitelist slots available<br/>
            </p>
            <div>
            <p style={{paddingTop: '5px', paddingBottom: '5px'}}>
            </p>
            </div>
            <br/>
            <div className={"whitelist-forms"}>
                <WhiteListForms whitelist={data.whitelistedSteam64IDs} whitelistSlots={data.whitelistSlots} onSubmit={onFormSubmit}></WhiteListForms>
            </div>
        </div>

    </>
    )
}


function WhiteListForms({whitelist, whitelistSlots, onSubmit}: WhitelistFormProps) {
    const [whitelistRows, setWhitelistRows] = useState<WhitelistRow[]>([])

    useEffect(() => {
        let slots: WhitelistRow[] = []
        for (let i = 0; i < whitelist.length || i < whitelistSlots; i++) {
            let row: WhitelistRow = { steamID: '', name: '' }
            const steamID = whitelist[i]?.steamID
            const name = whitelist[i]?.name
            // We only want to store the name if there is a steamID
            if (steamID) {
                row.steamID = steamID
                if (name) {
                    row.name = name
                }
            }
            slots.push(row)
            setWhitelistRows([...slots])
        }
    }, [whitelist, whitelistSlots])


    function handleInputChange(index: number, field: 'steamID' | 'name', value: string) {
        const updatedRows = [...whitelistRows]
        updatedRows[index][field] = value;
        setWhitelistRows(updatedRows)
    }



    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onSubmit(whitelistRows);
    }

    return(
    <form onSubmit={handleSubmit}>
        <label>Whitelist Slots</label>
        {whitelistRows.map((row, index) => (
            <div key={index} className={"whitelist-row"} style={{display: 'flex',justifyContent: 'center', alignItems: 'center', marginBottom: '10px'}}>
                <input
                    type={"text"}
                    value={row.steamID}
                    onChange={(e) => handleInputChange(index, 'steamID', e.target.value)}
                    placeholder={"Enter SteamID"}
                    style={{marginRight: '10px'}}
                    maxLength={17}
                />
                <input
                    type={"text"}
                    value={row.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    placeholder={"Enter Optional Name"}
                    style={{marginRight: '10px'}}
                    maxLength={50}
                />
                <button
                    type={"button"}
                    onClick={() => validateSteamIDs(whitelistRows)}
                    style={{marginRight: '10px'}}>
                    Check SteamID
                </button>
            </div>
        ))}
        <div style={{display: 'flex', justifyContent: "center"}}>
            <button type={"submit"} style={{marginTop: '20px'}} className={"default-button"}>Submit</button>
        </div>
    </form>
    )
}



async function fetchUsersWhitelists(): Promise<WhitelistResponseData> {
    const res = await axios({
        method: "GET",
        url: "http://localhost:5000/api/profile/user",
        withCredentials: true
    })

    if(res.status != 200) {
        throw new Error("Unable to fetch whitelist data.")
    }

    return res.data
}

//
//     // TODO this wills end a post request to the server with the steamID, which will then send an API request to steam to see if the steamID is valid.
// function validateSteamID(steamID: string, whitelistRows: WhitelistRow[]) {
//     const result = steamID64Regex.test(steamID)
//     console.log("Validate triggered for ID: ", steamID, "result: ", result)
//     // TODO add some sort of feedback if the steamID does not pass the regex validation.
//     // if (!result) return;
//
//
//     console.log(whitelistRows)
//
//     const postRes = axios({
//         method: "POST",
//         url: "http://localhost:5000/api/profile/validateid",
//         data: {steamID: steamID},
//         withCredentials: true
//     })
// }



function validateSteamIDs(whitelistRows: WhitelistRow[]) {
    // const result = steamID64Regex.test(steamID)
    // console.log("Validate triggered for ID: ", steamID, "result: ", result)
    // if (!result) return;

    // TODO add some sort of feedback if the steamID does not pass the regex validation.
    for (const row of whitelistRows) {
        if (steamID64Regex.test(row.steamID)) {
            console.log("Invalid steamID detected.")
        }
    }
    console.log(whitelistRows)

    const postRes = axios({
        method: "POST",
        url: "http://localhost:5000/api/profile/validateid",
        data: {steamID: whitelistRows},
        withCredentials: true
    })
}



async function onFormSubmit(data: WhitelistRow[]) {
  // let buttonRes = await Swal.fire({
  //           title: "Are you sure you wish to delete this role?",
  //           text: "These changes are permanent",
  //           showCancelButton: true,
  //           confirmButtonColor: "#9d0d0d",
  //           cancelButtonColor: "#1939b7",
  //           background: "FFF",
  //           confirmButtonText: "SUBMIT",
  //       })
  //



    data = data.filter(row => {
        return row?.steamID;
    })

    const res = await axios({
        method: 'POST',
        url: "http://localhost:5000/api/profile/whitelist",
        withCredentials: true,
        data: data
    })

    if (res.status == 200 && res.data.success) {
        Swal.fire("Sucessfully installed IDs", "", "success")
    } else {
        // TODO add modal here
        console.log("Something went wrong when sending steamIDs")
    }
}


export default Whitelist