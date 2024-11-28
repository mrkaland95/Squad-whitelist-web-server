import axios from "axios";
import {AdminGroupRow} from "../pages/AdminGroups";
import {WhitelistResponseData, WhitelistRow} from "../pages/Whitelist";
import {IDiscordUser} from "../pages/User";


const baseURL = "http://localhost:5000";

axios.defaults.withCredentials = true;

export async function getAdminGroups() {
    const url = `${baseURL}/api/v1/admingroups/groups`
    const res = await axios.get(url)

    if (res.status != 200) {
        throw new Error(`Unable to fetch admin group data`)
    }

    return res.data
}


export async function postAdminGroups(adminGroups: AdminGroupRow[]) {
    return await axios.post(
        `${baseURL}/api/v1/groups`,
        {
            adminGroups
        }
    )
}

export async function getUsersWhitelist(): Promise<WhitelistResponseData> {
    const res = await axios.get(
        `${baseURL}/api/v1/user/whitelist`
    )

    if(res.status != 200) {
        throw new Error("Unable to fetch whitelist data.")
    }

    return res.data
}


export async function postUserWhitelists(whitelistRows: WhitelistRow[]) {
    const url = `${baseURL}/api/v1/user/whitelist`
    return axios.post(url, whitelistRows)
}

export async function postUserSteamID(steamID: string) {
    const result = await axios({
        url: `${baseURL}/api/v1/user/userid`,
        method: "POST",
        data: { steamID: steamID },
    })
    return result
}


export async function getUserSteamID() {
    return axios.get(`${baseURL}/api/v1/user/userid`)
}