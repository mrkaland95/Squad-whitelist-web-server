import { Router } from "express";
import { ExpressRoute } from "../utils/types";
import { AdminGroupsDB } from "../schema";

const router = Router()
const baseRoute = "admingroups"




// TODO Add authentication here
router.get('/groups', async (req, res) => {
    const adminGroups = await AdminGroupsDB.find()
    res.json(adminGroups)
})

router.post('/groups', async (req, res) => {
    if (!(req.headers["content-type"] === "application/json")) {
        res.status(400).send('This endpoint only accepts JSON.')
    }

    try {
        const adminGroups = req.body.json()
        console.log(adminGroups)
        res.status(200).send('OK')
    } catch (err) {
        res.status(500)
    }
    // TODO add validation here.

})


router.delete('/groups:group',  async (req, res) => {



})


const expressRoute: ExpressRoute = {
    name: baseRoute,
    router: router
}



// export default expressRoute