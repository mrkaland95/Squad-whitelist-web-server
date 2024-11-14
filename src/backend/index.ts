import {Events, GatewayIntentBits} from "discord.js";
import 'dotenv/config'
import webServerStart from "./web-server";
import env from "./load-env";
import {
    discordClient,
    getAllUsersWithSpecialRoles, getUsersFromCache,
    refreshDiscordUsersAndRoles,
    refreshListCache,
    refreshUsersCache
} from "./cache";
import mongoose from "mongoose";
import {Logger, LoggingLevel} from "./logger";


/*
Main entry point, initializes the web server, bot etc.
 */


const logger = new Logger(LoggingLevel.DEBUG)



async function main() {
    logger.info("Booting up whitelist management server...")
    await webServerStart()
    await mongoose.connect(env.mongoDBConnectionString)
    await discordClient.login(env.discordAppToken)

    await refreshDiscordUsersAndRoles()
    await refreshUsersCache()
    await refreshListCache()
    await getAllUsersWithSpecialRoles()

    setInterval(async => {
        refreshUsersCache()
    }, 60* 1000)

    discordClient.once(Events.ClientReady, readyClient => {
        logger.info(`Discord Bot connected, logged in as ${readyClient.user.tag}`)
        // refreshDiscordUsersAndRoles()
        // refreshUsersCache()
        // ActiveUsersFromCache()
    })

}



main()