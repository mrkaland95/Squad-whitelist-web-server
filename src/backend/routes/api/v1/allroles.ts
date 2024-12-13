import { isAuthenticated} from "../../utils/utils";
import {Router} from "express";
import {allDiscordRolesCache} from "../../../cache";

const router = Router();

router.get('/', isAuthenticated, async (req, res) => {
    if (!req.session?.discordUser) {
        res.sendStatus(500)
        return
    }

    if (!allDiscordRolesCache.length) {
        res.sendStatus(500)
        return
    }

    res.json(allDiscordRolesCache)
})


export default { router: router };