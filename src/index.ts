import {Client, Events, GatewayIntentBits, Partials, TextChannel} from "discord.js";
import 'dotenv/config'
import webServerStart from "./web-server";
import env from "./load-env";
import {loadRoutes} from "./utils/utils";
import path from "path";





const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
})

async function main() {
    console.log("Booting up whitelist-server...")
    await webServerStart()
    // await client.login('')
    client.once(Events.ClientReady, readyClient => {
        console.log(`Discord Bot connected, logged in as ${readyClient.user.tag}`)
    })


}


main()