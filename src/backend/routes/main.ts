import {response, Router} from "express";
import env from "../load-env";
import {DiscordUser} from "../utils/types";
import {defaultLogger, Logger, LoggingLevel} from "../logger";
import {accessTokenRequestSuccess, isAuthenticated, requestAccessToken, requestDiscordUserData} from "./utils/utils";
import {getUsersFromCacheList, GetUsersFromCacheMap, processWhitelistProps} from "../cache";
import {AdminGroupsDB, DiscordUsersDB, IDiscordRole, IPrivilegedRole, RolesDB} from "../schema";
import {getPlayerSummarySteam} from "../utils/steamAPI";
import user from "./api/v1/user";

/*
This is the main router.
 */

const router: Router = Router()


const logger = new Logger(LoggingLevel.INFO, true)


router.get('/', async (req, res) => {
    const { code } = req.query
    if (req.session?.discordUser) {
        res.send('Hello, World!')
        logger.debug('Received request from logged in user.')
        return
    }

    if (req.ip != null) {
        logger.debug(`Received request from unauthenticated user. IP:`, req.ip)
    } else {
        logger.debug('Recieved request from unauthenticated user.')
    }

    res.status(401).send('User was not logged in')
})


router.get('/api/auth/userinfo', async (req, res) => {
    logger.debug('Recieved user info request...', req.originalUrl)

    if (!req.session.discordUser?.id) {
        // res.status(401).send('User not authenticated')
        // TODO temp
        logger.debug(`Received request with no session.`)
        res.status(401).send('Unauthenticated User')
        return
    }

    const userDBData = GetUsersFromCacheMap(true).get(req.session.discordUser.id)
    const rolesDBData = await RolesDB.find()

    if (!userDBData) {
        logger.debug(`Not able to find user with stored session ${req.session.discordUser.global_name} in DB`)
        res.status(401).send('Unable to find user in the servers systems.')
        return
    }

    const validRoles = rolesDBData.filter(role => {
        return userDBData.Roles.includes(role.RoleID)
    })

    const isAdmin = userDBData.Roles.some(roleID => {
        return env.discordRolesAuthorizedForAdmin.includes(roleID)
    })

    const responseData = {
        isAuthenticated: true,
        isAdmin: isAdmin,
        username: req.session.discordUser.username,
        globalName: req.session.discordUser.global_name,
        avatar: req.session.discordUser.avatar,
        usersValidRoles: validRoles
    }
    logger.debug(`Sending profile response data...`)
    res.status(200).json(responseData)
})

// router.get('/api/profile/user', async (req, res) => {
//     // TODO factor this out and use a logging middleware function.
//     logger.debug(`Recieved request about user info... Route: `, req.route.path)
//     if (!req.session?.discordUser) {
//         logger.debug(`Recieved request from unauthenticated user...`)
//         logger.debug(`Session data: `, req?.session)
//         res.status(401).send('Unauthorized user.')
//         return
//     }
//
//     const userDBData = GetUsersFromCacheMap(true).get(req.session.discordUser.id)
//     const specialRolesDBData = await RolesDB.find()
//
//     if (!userDBData) {
//         res.status(401).send('Unable to find user in the servers systems.')
//         return
//     }
//
//     const validRoles = specialRolesDBData.filter(role => {
//         return userDBData.Roles.includes(role.RoleID)
//     })
//
//     const whitelistProps = processWhitelistProps(userDBData, validRoles)
//
//     const responseData: WhitelistResponseData = {
//         isAuthenticated: true,
//         validRoles: validRoles,
//         whitelistSlots: whitelistProps.WhitelistSlots,
//         whitelistActiveDays: whitelistProps.WhitelistActiveDays,
//         whitelistedSteam64IDs: userDBData.Whitelist64IDs,
//         userSteamID: userDBData.UserID64
//     }
//
//     res.json(responseData).status(200)
// })


// router.post('/api/profile/whitelist', isAuthenticated, async (req, res) => {
//     if (!req.session?.discordUser) {
//         logger.error(`"Is authenticated" function did not catch unauthenticated user before hitting the "/api/profile/whitelist" route.`)
//         res.send('Internal Server Error')
//         return
//     }
//
//     let body = req.body
//
//     logger.debug(`Whitelist update: `, body)
//
//     if (!(body instanceof Array)) {
//         res.status(400).send()
//         return
//     }
//
//     logger.debug(`Whitelist update, valid array...`)
//
//     let invalidData = false
//     for (const elem of body) {
//         if (!elem?.steamID) {
//             invalidData = true
//         }
//         if (!elem?.name) {
//             elem.name = ''
//         }
//     }
//     if (invalidData) {
//         res.status(400).send()
//         return
//     }
//
//     logger.debug(`Whitelist update, valid data, adding to db...`)
//
//     const dbRes = await DiscordUsersDB.findOneAndUpdate({
//         DiscordID: req.session.discordUser.id
//     }, {
//         Whitelist64IDs: body
//     }, {
//         runValidators: true,
//         upsert: true
//     }).exec()
//
//     logger.debug(`Successfully added steamIDs to db.`)
//
//     res.status(200).json({success: true})
// })


// router.post('/api/profile/validateid', isAuthenticated, async (req, res) => {
//     if (!req.session?.discordUser) {
//         return
//     }
//
//     if (!req.body?.steamID) {
//         res.status(400).send()
//         return
//     }
//
//
//     res.status(200).send()
//     return
//
//     // console.log(req.body)
//
//     const result = await getPlayerSummarySteam(req.body.steamID)
//
//
//     res.status(200).send()
// })
//
//
// router.post('/api/profile/userid', isAuthenticated, async (req, res) => {
//     if (!req.session?.discordUser) {
//         return
//     }
//
//     const steamID = req.body.steamID
//
//     logger.debug(`Received steamID: `, steamID)
//
//     const userUpdateRes = await DiscordUsersDB.findOneAndUpdate({
//         DiscordID: req.session.discordUser.id
//     }, {
//         UserID64: {steamID: steamID, isLinkedToSteam: false}
//     }, {
//         upsert: true,
//         runValidators: true
//     })
//
//     if (!userUpdateRes) {
//         res.sendStatus(500)
//         return
//     }
//
//     res.sendStatus(200)
// })




export type UserInfo = {
    isAuthenticated: boolean,
}

export type WhitelistResponseData = {
    isAuthenticated: boolean,
    validRoles: IPrivilegedRole[],
    whitelistSlots: number,
    whitelistActiveDays: number[],
    whitelistedSteam64IDs: {
        steamID:string
        name?: string,
    }[],
    userSteamID?: {
        steamID: string,
        isLinkedToSteam: boolean
    }
}

type WhitelistRow = {
    steamID: string
    name?: string
}



// @ts-ignore
async function requiredAuthentication(req, res, next) {

}

// @ts-ignore
async function logRequest(req, res, next) {

}



export default router
