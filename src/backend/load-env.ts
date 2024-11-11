
type EnvField = {
    field: string | number | boolean | undefined,
    errorMsg: string
}




const requiredFields: EnvField[] = [
    { field: process.env.SESSION_SECRET, errorMsg: 'Session secret is required for the web server to run.' },
    { field: process.env.MONGO_DB_CONNECTION_STRING, errorMsg: 'A mongoDB connection string is required.'},
    { field: process.env.DISCORD_APP_TOKEN, errorMsg: 'A discord app token is required for this program to retrieve roles and users from a server.' }
    // { field: webPort, errorMsg: ''},
]

for (const val of requiredFields) {
    if (!val.field) {
        console.error(val.errorMsg)
        process.exit(1)
    }
}


const mongoDBConnectionString = String(process.env.MONGO_DB_CONNECTION_STRING)
const sessionSecret = String(process.env.SESSION_SECRET)
const webPort = Number(process.env.PORT) || 5000
const cookieMaxAgeHours = Number(process.env.COOKIE_MAX_AGE_HOURS) || 0.5
const discordLoggingEnabled = Boolean(process.env.DISCORD_LOGGING_ENABLED) || false
const discordLoggingChannel = String(process.env.DISCORD_LOGGING_CHANNEL)
const discordOath2ClientPublic = String(process.env.DISCORD_OAUTH_CLIENT_PUBLIC)
const discordOath2ClientSecret = String(process.env.DISCORD_OAUTH_CLIENT_SECRET)
const discordAppToken = String(process.env.DISCORD_APP_TOKEN)
const organizationName = String(process.env.ORGANIZATION_NAME)
const debug = Boolean(process.env.DEBUG)



export default {
    webPort,
    cookieMaxAgeHours,
    discordLoggingChannel,
    sessionSecret,
    mongoDBConnectionString,
    discordAppToken,
    debug,
    discordLoggingEnabled,
}