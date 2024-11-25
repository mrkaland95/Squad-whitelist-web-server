import {Router} from "express";
import {getActiveUsersFromCache} from "../../../../dist/backend/cache";
import {getUsersFromCache} from "../../cache";

const router = Router()


/**
 * Sends the stored data about a discord user, back to them.
 */
router.get('/info', async (req, res) => {
    if (!req.session.discordUser) {
        res.status(401).send('User data was not stored in session.')
        return
    }

    const userData = getUsersFromCache(true)
    console.log(userData)
})


router.post('/whitelists', async (req, res) => {
    if (!(req.headers["content-type"] === "application/json")) {
        res.status(400).send('This endpoint only accepts JSON.')
        return
    }

    res.status(200)
})



export default router