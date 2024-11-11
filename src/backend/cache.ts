import {AdminGroupsDB, DiscordUsersDB, IDiscordUser, IListEndpoint, ListsDB, RolesDB} from "./schema";
import { Client, GatewayIntentBits } from "discord.js";

/*
File responsible for handling caches of data, and initializing the discord and database clients.
TODO might want to factor out the initialization of discord and db to somewhere else that makes sense.
 */


const usersCache: Map<string, IDiscordUser> = new Map()
const listsCache: Map<string, string> = new Map()


export const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
})

export async function refreshUsersCache() {
    const discordUsers = await DiscordUsersDB.find()
    usersCache.clear()
    for (const user of discordUsers) {
        usersCache.set(user.DiscordID, user)
    }
    return usersCache
}


// Meant to be a rough analogue of the "performScrub" function of the old whitelist server.
export async function refreshDiscordUsersAndRoles() {

}

// TODO generate and store the lists here in caches.


export async function generateLists() {
    const listsData = await ListsDB.find({
        Enabled: true
        // Enabled: true
        // Enabled: true
    }).exec()

    for (const lData of listsData) {
        // console.log(lData)
        const listFile = await constructListFile(lData)
        listsCache.set(lData.ListName, listFile)
    }
}

async function constructListFile(listData: IListEndpoint) {

    let fBuffer = []
    for (const group of listData.AdminGroups) {
        if (!group.Enabled) continue
        if (!group.Permissions.length) continue
        let permissions = group.Permissions.join(",")
        fBuffer.push(`Group=${group.GroupName}:${permissions}`)
    }

    // const adminGroups = await AdminGroupsDB.find()
    const discordRoles = await RolesDB.find()
    console.log(discordRoles)
    // Equivalent to EST time, but need to add timezones to the config file.
    let today = new Date(Date.now() - (60 * 60 - 1000 * 4))


    // console.log(fBuffer)
    return fBuffer.join('\r\n')

}



generateLists()


