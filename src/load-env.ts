

const webPort = process.env.PORT || 5000
const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
    console.error('Session secret is required for the web server to run.')
    process.exit(1)
}

export default {
    webPort,
    sessionSecret
}