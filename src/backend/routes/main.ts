import { Router } from "express";


// declare module
// interface SessionData




/*
This is the main router.
 */

const router: Router = Router()




router.get('/', async (req, res) => {
    const { authCode } = req.query
    if (req.session?.user) {
        console.log('User was logged in')
        res.send('User was not logged in')
        return
    } else {
        console.log('Success')
    }

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
