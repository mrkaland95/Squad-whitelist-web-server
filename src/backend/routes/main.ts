import {response, Router} from "express";
import env from "../load-env";
import {DiscordUser} from "../utils/types";
import {Logger, LoggingLevel} from "../logger";
import {accessTokenRequestSuccess, requestAccessToken, requestDiscordUserData} from "./utils/utils";
import {getUsersFromCache, GetUsersFromCacheMap} from "../cache";
import {IDiscordRole, RolesDB} from "../schema";

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
        logger.debug('Recieved reqest from unauthenticated user.')
    }

    res.status(401).send('User was not logged in')
})



// TODO move these to the "auth" router file once dynamic route loading has been fixed.
router.get('/api/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error when destroying session: ", err)
            res.status(500).send('Internal server error')
        } else {
            res.status(200).redirect('/')
        }
    })
})


router.get('/api/login', async (req, res) => {
    const { code } = req.query

    logger.debug(`Recieved login request from user with IP: ${req.ip}`)
    console.log('req.query: ', req.query)

    if (req.session?.user) {
        res.redirect('/profile')
        return
    }

    if (!code) {
        logger.debug('User has no code')
        res.status(400).send('No authorization code included.')
        return
    }

    let redirectURI = `http://localhost:5000/api/login/`

    const accessTokenRequest = await requestAccessToken(String(code), env.discordOauth2ClientPublic, env.discordOauth2ClientSecret, redirectURI)

    if (accessTokenRequest.statusCode !== 200) {
        return
    }

    // If the status code was 200, it means the request was a success, and we can cast it.
    const accessTokenData = (accessTokenRequest.body as accessTokenRequestSuccess)
    let discordUser: DiscordUser
    try {
        discordUser = await requestDiscordUserData(accessTokenData)
    } catch (e) {
        res.status(401).send('Unsuccesfully authenticated')
        req.session.destroy( () => {})
        return
    }

    const name = discordUser.global_name ? discordUser?.global_name : discordUser.username
    logger.info(`Discord user ${name} succesfully authenticated.`)
    req.session.discordUser = discordUser
    req.session.save()
    res.status(200).send(`Succesfully authenticated! Welcome ${name}!`)
})

router.get('/api/auth/userinfo', async (req, res) => {
    if (!req.session.discordUser?.id) {
        // res.status(401).send('User not authenticated')
        // TODO temp
        logger.debug(`Recieved request with no session.`)
        res.status(401).redirect('http://localhost:3000/')
        return
    }
    const userDBData = GetUsersFromCacheMap(true).get(req.session.discordUser.id)
    const rolesDBData = await RolesDB.find()

    if (!userDBData) {
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

    res.status(200).json(responseData)
})


type UserInfo = {
    isAuthenticated: boolean,

}




export default router
