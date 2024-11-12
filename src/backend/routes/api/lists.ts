import {Router} from "express";
import {ExpressRoute} from "../../utils/types";
import {getListsCache, refreshListCache} from "../../cache";


const router = Router()
const baseRoute = "lists"


router.get('/:list', async (req, res) => {
    try {
        const listsRequest = req.params
        const listsCache = getListsCache()
        const foundList = listsCache.get(listsRequest?.list)
        if (!listsRequest && !foundList) {
            res.status(404).send('Requested list does not exist.')
        } else {
            res.format({
                'text/plain': () => {
                    res.send(foundList)
                }
            })
        }

    } catch (e) {
        console.log('Internal server error', e)
        res.status(500).send('Internal server error')
    }

})





const expressRoute: ExpressRoute = {
    name: baseRoute,
    router: router
}
export default expressRoute