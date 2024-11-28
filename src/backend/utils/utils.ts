import {readdirSync} from "fs";
import path from "path";
import {ExpressRoute} from "./types";
import {pseudoRandomBytes} from "crypto";
import * as readline from "readline";
import {Router} from "express";


/**
 * Recursively loads all expressRoute files from the specified root path.
 * @param routesPath
 */
export async function loadRoutes(routesPath: string) {
    const fileRoutes = readdirSync(
        routesPath, {
        withFileTypes: true,
        recursive: true
    })

    let routes: ExpressRoute[] = []
    for (const file of fileRoutes) {
        if (!file.isFile()) continue
        if (!file.name.endsWith('.ts') && !file.name.endsWith('.js')) continue
        if (file.name.includes('main')) continue
        const filePath = path.join(file.path, file.name)
        const route = require(filePath)?.default
        // TODO add check for actual content of expressRoute here.
        if (route?.router && route?.name) {
            routes.push(route)
        }
    }

    return routes
}

export function loadRoutes2(basePath: string): BaseRoute[] {
    const fileRoutes = readdirSync(
        basePath, {
            withFileTypes: true,
            recursive: true
        }
    )

    const baseRoutes: BaseRoute[] = []

    for (const file of fileRoutes) {
        if (!file.isFile()) continue
        if (!file.name.endsWith('.ts') && !file.name.endsWith('.js')) continue
        if (file.name.includes('main')) continue

        const filePath = path.join(file.path, file.name)
        const route = require(filePath)?.default

        if (!route?.router) continue

        let bNameArray = file.path.slice(basePath.length).split('\\')
        let baseName = bNameArray.join('/')
        const routeName = file.name.slice(0, file.name.indexOf('.'))

        const baseRoute: BaseRoute = {
            filePath: filePath,
            routeName: routeName,
            baseRoute: baseName,
            router: route.router
        }

        baseRoutes.push(baseRoute)
    }

    return baseRoutes
}

export function generateAPIKey(byteCount: number = 50)  {
    const randomBytes = pseudoRandomBytes(byteCount)
    return randomBytes.toString('base64')
}

export type BaseRoute = {
    filePath: string
    routeName: string
    baseRoute: string,
    router: Router
}


