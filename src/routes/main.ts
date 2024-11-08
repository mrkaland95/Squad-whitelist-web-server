import { Router } from "express";

/*
This is the main router.
 */

const router: Router = Router()

router.get('/', async (req, res) => {
    res.send('Hello, World!')
})



export default router
