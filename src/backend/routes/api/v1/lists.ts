import {Router} from "express";
import {ExpressRoute} from "../../../utils/types";
import {getListsCache, refreshListCache} from "../../../cache";


const router = Router()

router.get('/:list', async (req, res) => {
    console.log(req.params)
    try {
        const listsRequest = req.params

        const tempLists = new Map()
        for (const [k, v] of getListsCache().entries()) {
            tempLists.set(k.toLowerCase(), v);
        }

        let foundList = tempLists.get(listsRequest?.list)
        if (!listsRequest || foundList === undefined) {
            res.status(404).send('Requested list does not exist.')
        } else {
            if (!foundList.length) {
                foundList = "Empty List"
            }

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


export default { router: router }