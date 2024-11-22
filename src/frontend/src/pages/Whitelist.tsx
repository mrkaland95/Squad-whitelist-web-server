import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import React from "react";
import {IPrivilegedRole} from "../../../../dist/backend/schema";

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


async function fetchUsersWhitelists(): Promise<WhitelistResponseData> {
    // const reqEndpoint = "http://localhost:5000/api/profile/user"
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


function WhiteListForms(data: WhitelistResponseData) {
    const testData = [
        'test1',
        'test2',
        'test3',
        'test4',
    ]

    // console.alert("")


    for (const d of testData) {
        console.log(d)
    }

    // console.log(data)
    return <div>
        <p>{data.whitelistSlots}</p>
    </div>
}


function Whitelist() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['whitelist'],
        queryFn: fetchUsersWhitelists,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>Something went wrong when loading your whitelist data</p>

    const ifDataForm = <div>

    </div>

    return (
    <>
        <div className={"whitelist-body"}>
            <h1>
                Whitelist
            </h1>
            <h3>
                On this page you can add other people's steamIDs to whitelist.
            </h3>
            <p>You currently have {data.whitelistSlots} whitelist slots available<br/>
            Which are active the follow days: {data.whitelistActiveDays}
            </p>
            {/*<p>{data}</p>*/}
        </div>
        <div className={"whitelist-forms"}>
            <WhiteListForms {...data}></WhiteListForms>
        </div>
    </>
    )
}

export default Whitelist