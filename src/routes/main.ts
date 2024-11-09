import { Router } from "express";

/*
This is the main router.
 */

const router: Router = Router()

router.get('/', async (req, res) => {
    res.send('Hello, World!')
})

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error when destroying session: ", err)
            res.status(500).send('Internal server error')
        } else {
            res.status(200).redirect('/')
        }
    })
})

// router.all()



export default router
