import {Router} from "express";
import {getUsersFromCacheList, GetUsersFromCacheMap, processWhitelistProps} from "../../../cache";
import {isAuthenticated} from "../../utils/utils";
import {DiscordUsersDB, RolesDB} from "../../../schema";
import {defaultLogger} from "../../../logger";
import {getPlayerSummarySteam} from "../../../utils/steamAPI";
import {WhitelistResponseData} from "../../main";

const router = Router()


/**
 * Sends the stored data about a discord user, back to them.
 */
router.get('/userid', async (req, res) => {
    if (!req.session.discordUser) {
        res.status(401).send('User data was not stored in session.')
        return
    }

    const userData = GetUsersFromCacheMap(true).get(req.session.discordUser.id)
    if (!userData) {
        res.status(401).send('User data was not stored in session.')
    }
    defaultLogger.debug(`Found user data, sending...`)
    res.json(userData);
})

router.post('/userid', isAuthenticated, async (req, res) => {
    if (!req.session?.discordUser) {
        return
    }

    const steamID = req.body.steamID

    defaultLogger.debug(`Received steamID: `, steamID)

    const userUpdateRes = await DiscordUsersDB.findOneAndUpdate({
        DiscordID: req.session.discordUser.id
    }, {
        UserID64: {steamID: steamID, isLinkedToSteam: false}
    }, {
        upsert: true,
        runValidators: true
    })

    if (!userUpdateRes) {
        res.sendStatus(500)
        return
    }

    res.sendStatus(200)
})


router.post('/validateid', isAuthenticated, async (req, res) => {
    if (!req.session?.discordUser) {
        return
    }

    if (!req.body?.steamID) {
        res.status(400).send()
        return
    }

    res.status(200).send()
    return


    const result = await getPlayerSummarySteam(req.body.steamID)


    res.status(200).send()
})


router.get('/whitelist', async (req, res) => {
    // TODO factor this out and use a logging middleware function.
    if (!req.session?.discordUser) {
        res.status(401).send('Unauthorized user.')
        return
    }

    const userDBData = GetUsersFromCacheMap(true).get(req.session.discordUser.id)
    const specialRolesDBData = await RolesDB.find()

    if (!userDBData) {
        res.status(401).send('Unable to find user in the servers systems.')
        return
    }

    const validRoles = specialRolesDBData.filter(role => {
        return userDBData.Roles.includes(role.RoleID)
    })

    const whitelistProps = processWhitelistProps(userDBData, validRoles)

    const responseData: WhitelistResponseData = {
        isAuthenticated: true,
        validRoles: validRoles,
        whitelistSlots: whitelistProps.WhitelistSlots,
        whitelistActiveDays: whitelistProps.WhitelistActiveDays,
        whitelistedSteam64IDs: userDBData.Whitelist64IDs,
        userSteamID: userDBData.UserID64
    }

    res.json(responseData).status(200)
})


router.post('/whitelist', isAuthenticated, async (req, res) => {
    if (!req.session?.discordUser) {
        defaultLogger.error(`"Is authenticated" function did not catch unauthenticated user before hitting the "/api/profile/whitelist" route.`)
        res.send('Internal Server Error')
        return
    }

    let body = req.body

    defaultLogger.debug(`Whitelist update recieved: `, body)

    if (!(body instanceof Array)) {
        res.status(400).send()
        return
    }

    defaultLogger.debug(`Whitelist update, valid array...`)

    let invalidData = false
    for (const elem of body) {
        if (!elem?.steamID) {
            invalidData = true
        }
        if (!elem?.name) {
            elem.name = ''
        }
    }
    if (invalidData) {
        res.status(400).send()
        return
    }

    defaultLogger.debug(`Whitelist update, valid data, adding to db...`)

    const dbRes = await DiscordUsersDB.findOneAndUpdate({
        DiscordID: req.session.discordUser.id
    }, {
        Whitelist64IDs: body
    }, {
        runValidators: true,
        upsert: true
    }).exec()

    defaultLogger.debug(`Successfully added steamIDs to db.`)

    res.status(200).json({success: true})
})




export default { router: router }