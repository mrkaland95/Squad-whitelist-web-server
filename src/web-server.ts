import express, { Request, Response } from 'express';
import session from 'express-session'
import cookieParser from 'cookie-parser'
import env from './load-env'
import { loadRoutes } from "./utils/utils";
import path from "path";
import mainRoute from "./routes/main";
import MongoStore from "connect-mongo";
import cors from 'cors';


console.log(env.sessionSecret);

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




async function webServerStart() {
    const routesPath = path.join(__dirname, 'routes')
    const routes = await loadRoutes(routesPath)
    app.use(mainRoute)
    routes.forEach(route => {
        console.log('loading route: ', route)
        app.use(route.name, route.router)
    })
    app.listen(env.webPort, () => {
        console.log('Web server up and running on port:', env.webPort)
    })
}


async function logMiddleFunction(req: Request, res: Response) {
    // req.
}


export default webServerStart
