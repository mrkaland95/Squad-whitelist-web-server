import { Router } from "express";

const router = Router()
const baseRoute = "admingroups"



// Add authentication here
// TODO retrieve these from cache instead.
router.get('/groups', (req, res) => {
    res.send('group')
})

const route = {
    name: "admingroups",
    router: router
}


export default route