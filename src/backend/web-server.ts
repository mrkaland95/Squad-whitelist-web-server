import express, {Request, Response} from 'express';
import session from 'express-session'
import env from './load-env'
import {loadRoutes} from "./utils/utils";
import path from "path";
import mainRouter from "./routes/main";
import MongoStore from "connect-mongo";
import cors from 'cors';
import {Logger, LoggingLevel} from "./logger";
import profileRouter from "./routes/api/user";


const app = express()
app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: env.mongoDBConnectionString}),
    cookie: {
        maxAge: (1000 * 60 * 60) * env.cookieMaxAgeHours
    },
    secret: env.sessionSecret
}))

app.use(express.urlencoded({
    extended: true
    })
)

app.use(cors({
    origin: `http://localhost:3000`,
    credentials: true
}))

// TODO add logging level from .env file
const logger = new Logger(LoggingLevel.INFO, true)

async function webServerStart() {
    const routesPath = path.join(__dirname, 'routes')
    const apiRoutesPath = path.join(__dirname, 'routes', 'api')

    const routes = await loadRoutes(routesPath)
    const apiRoutes = await loadRoutes(apiRoutesPath)

    console.log('api routes', apiRoutes)


    logger.debug('Loading main router...')
    app.use(mainRouter)
    logger.debug('Loading profile router...')
    app.use(profileRouter)
    for (const route of routes) {
        logger.debug(`Loading base route: ${route.name}`)
        app.use(`/${route.name}`, route.router)
    }

    app.listen(env.webPort, () => {
        logger.info(`Web server up and running on port: ${env.webPort}`)
    })
}


async function logMiddleFunction(req: Request, res: Response, next) {
    // req.
}


export default webServerStart
