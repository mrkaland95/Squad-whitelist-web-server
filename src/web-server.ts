import express, { Request, Response } from 'express';
import session from 'express-session'
import cookieParser from 'cookie-parser'
import env from './load-env'
import { loadRoutes } from "./utils/utils";
import path from "path";
import mainRoute from "./routes/main";



const app = express()
app.use(express.json())
// app.use(sessionStorage)
// app.use(cookieParser())




async function webServerStart() {
    const routesPath = path.join(__dirname, 'routes')
    const routes = await loadRoutes(routesPath)
    console.log(routes)
    app.use(mainRoute)
    routes.forEach(route => {
        console.log('loading route: ', route)
        // app.use(route)
    })
    app.listen(env.webPort, () => {
        console.log('Web server up and running on port:', env.webPort)
    })
}


export default webServerStart
