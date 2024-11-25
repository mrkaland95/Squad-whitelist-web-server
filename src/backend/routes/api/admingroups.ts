import {IRoute, Router} from "express";
import {GetUsersFromCacheMap} from "../../cache";
import {ExpressRoute} from "../../utils/types";



const router = Router()
const routeName = 'admingroups'


router.get('groups', async (req, res) => {
    if (!req.session?.discordUser) {
        res.send(401)
        return
    }

    const userDBData = GetUsersFromCacheMap(true).get(req.session.discordUser.id)
    if (!userDBData) {
        res.send(401)
        return
    }
})


const route: ExpressRoute = {
    name: routeName,
    router: router,
}

// export default route