import { ExpressRoute } from "../utils/types";
import { Router } from "express";

const routeName = "profile"
const router = Router()

router.post('/whitelists', async (req, res) => {
    if (!(req.headers["content-type"] === "application/json")) {
        res.status(400).send('This endpoint only accepts JSON.')
    }
})


router.post('/admin', async (req, res) => {
    if (!(req.headers["content-type"] === "application/json")) {
        res.status(400).send('This endpoint only accepts JSON.')
    }
})





const expressRouter: ExpressRoute = {
    name: routeName,
    router: router
}

export default expressRouter