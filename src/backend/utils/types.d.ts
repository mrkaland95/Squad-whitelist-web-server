import 'express-session'

import { Router } from "express";

declare module 'express-session' {
    interface SessionData {
        // TODO change this to the actual type
        user: any
    }
}

export type ExpressRoute = {
    name: string
    router: Router
}