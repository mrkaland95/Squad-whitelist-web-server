import axios from "axios";
import loadEnv from "../load-env";


/**
 * Utility functions for interacting with the Steam API.
 *
 * Documentation: https://developer.valvesoftware.com/wiki/Steam_Web_API
 */


export async function getPlayerSummarySteam(steamID: string) {
    // http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=XXXXXXXXXXXXXXXXXXXXXXX&steamids=76561197960435530

    const result = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${loadEnv.steamAPIKey}&steamids=${steamID}`)
    console.log(result.data.response.players)
}