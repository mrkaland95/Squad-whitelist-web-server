import { DiscordUsersDB, IDiscordUser } from "./schema";
import { Client, GatewayIntentBits } from "discord.js";

/*
File responsible for handling caches of data, and initializing the discord and database clients.
TODO might want to factor out the initialization of discord and db to somewhere else that makes sense.
 */



export const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
})


const usersCache: Map<string, IDiscordUser> = new Map()


export async function refreshUsersCache() {
    const discordUsers = await DiscordUsersDB.find()
    usersCache.clear()
    for (const user of discordUsers) {
        usersCache.set(user.DiscordID, user)
    }
    return usersCache
}



// TODO generate and store the lists here in caches.







