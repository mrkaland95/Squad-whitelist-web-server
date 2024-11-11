import express, {Request, Response} from 'express';
import session from 'express-session'
import env from './load-env'
import {loadRoutes} from "./utils/utils";
import path from "path";
import mainRouter from "./routes/main";
import MongoStore from "connect-mongo";
import cors from 'cors';
import {Logger, LoggingLevel} from "./logger";


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
    origin: `http://localhost:${env.webPort}`
}))
// app.use(cookieParser())




// MongoStore
// app.use(sessionStorage)
// app.use(cookieParser())

// TODO add logging level from .env file
const logger = new Logger()



async function webServerStart() {
    const routesPath = path.join(__dirname, 'routes')
    const routes = await loadRoutes(routesPath)
    app.use(mainRouter)
    for (const route of routes) {
        logger.debug(`Loading base route: ${route.name}`)
        app.use(`/${route.name}`, route.router)
    }

    app.listen(env.webPort, () => {
        logger.info(`Web server up and running on port: ${env.webPort}`)
    })
}


async function logMiddleFunction(req: Request, res: Response) {
    // req.
}


export default webServerStart
