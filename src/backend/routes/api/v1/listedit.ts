import {Router} from "express";
import {isAuthenticated} from "../../utils/utils";
import {ListsDB} from "../../../schema";
import {ListEndpoint} from "../../../../shared-types/types";
import {defaultLogger} from "../../../logger";

const router = Router()

router.get('/', isAuthenticated, async (req, res) => {
    const listEndpoints = await ListsDB.find()

    res.json(listEndpoints)
})


router.post('/', isAuthenticated, async (req, res) => {
    const listEndpoints: ListEndpoint[] = req.body

    try {
        for (const list of listEndpoints) {

            if (!list?.ListID) {
                list.ListID = crypto.randomUUID()
            }

            await ListsDB.findOneAndUpdate({
                ListID: list.ListID
            }, {
                ListID: list.ListID,
                ListName: list.ListName,
                AdminGroups: list.AdminGroups,
                Enabled: list.Enabled,
                AllRolesEnabled: list.AllRolesEnabled,
                UseWhitelistGroup: list.UseWhitelistGroup,
            }, {
                upsert: true,
                runValidators: true
            })
        }
    } catch (err) {
        // defaultLogger.error(err)
        console.error(err)
        res.sendStatus(400)
        return
    }

    res.sendStatus(200)
})




export default { router: router }
