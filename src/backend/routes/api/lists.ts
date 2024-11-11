import {Router} from "express";
import {ExpressRoute} from "../../utils/types";


const router = Router()
const baseRoute = "lists"



const expressRoute: ExpressRoute = {
    name: baseRoute,
    router: router
}
export default expressRoute