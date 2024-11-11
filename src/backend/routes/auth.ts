import { Router } from "express";
import loadEnv from "../load-env";

const router = Router()
const routeName = "auth"

router.get('/login', async (req, res) => {
    const { authCode } = req.query
    if (req.session?.user) {
        res.redirect('/profile')
        return
    }

    if (!authCode) {
        res.redirect('/')
    }

    let redirectURI

})





