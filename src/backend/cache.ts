import {DiscordUsersDB, IAdminGroup, IDiscordUser, IListEndpoint, IRole, ListsDB, RolesDB} from "./schema";
import {Client, GatewayIntentBits} from "discord.js";

/*
File responsible for handling caches of data, and initializing the discord and database clients.
TODO might want to factor out the initialization of discord and db to somewhere else that makes sense.
 */


const usersCache: Map<string, IDiscordUser> = new Map()
const listsCache: Map<string, string> = new Map()


export const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
})

export async function refreshUsersCache() {
    const discordUsers = await DiscordUsersDB.find()
    usersCache.clear()
    for (const user of discordUsers) {
        usersCache.set(user.DiscordID, user)
    }
    return usersCache
}


// Meant to be a rough analogue of the "performScrub" function of the old whitelist server.
export async function refreshDiscordUsersAndRoles() {

}

// TODO generate and store the lists here in caches.

async function refreshLists() {
    // TODO use the caches instead here.
    const users = await DiscordUsersDB.find()
    const listsData = await ListsDB.find({
        // Enabled: true
    })
    const discordRoles = await RolesDB.find()
    const listsMapping = await generateLists(listsData, discordRoles, users)
}


export async function generateLists(listsData: IListEndpoint[], rolesData: IRole[], usersData: IDiscordUser[]) {
    for (const lData of listsData) {
        const listFile = await constructListFile(lData, rolesData, usersData)
        console.log(listFile)
        listsCache.set(lData.ListName, listFile)
    }
}


async function constructListFile(listData: IListEndpoint, rolesData: IRole[], usersData: IDiscordUser[]) {
    let fBuffer: string[] = []
    let whitelistGroup: IAdminGroup | null = null
    let enabledAdminGroups: IAdminGroup[] = []
    let validDiscordRoles: IRole[] = []
    for (const group of listData.AdminGroups) {
        if (!group.Enabled) continue
        if (!group.Permissions.length) continue

        if (group.IsWhitelistGroup) {
            whitelistGroup = group
        }

        let permissions = group.Permissions.join(",")
        fBuffer.push(`Group=${group.GroupName}:${permissions}`)

        for (const role of rolesData) {
            if (role?.AdminGroup?.GroupName === group.GroupName) {
                validDiscordRoles.push(role)
            }
        }

        enabledAdminGroups.push(group)
    }


    // TODO change this into using a timezone defined by either the .env or user specifiable timezone.
    // Equivalent to EST time, but need to add timezones to the config file.
    let today = new Date(Date.now() - (60 * 60 - 1000 * 4))


    // TODO this almost certainly requires optimization.
    for (let user of usersData) {
        if (!user.Whitelist64IDs) {
            user.Whitelist64IDs = []
        }

        const usersValidRoles = getValidUserRoles(user, validDiscordRoles)
        // console.log('User', user.DiscordName, 'valid roles: ', usersValidRoles)

        /*
        TODO
        Add "admin" role of user.
        Currently this solution is rather flawed, as it allows a user have multiple in game admin groups, which can cause issues.
        My current idea is to perhaps have "significance" levels to the admin groups, where your highest one decides your in-game permissions, active days etc.

         */
        if (user.AdminRole64ID) {
            for (const role of usersValidRoles) {
                if (role?.AdminGroup?.IsWhitelistGroup === false) {
                    fBuffer.push(`Admin=${user.AdminRole64ID}:${role.AdminGroup.GroupName} // ${user.DiscordName}`)
                }
            }
        }

        let whitelistProps: IUserProps = processUserRoles(user, validDiscordRoles)

        // TODO may have to find a better solution for active days, but currently it will just be the active days of their highest role.
        if (!whitelistGroup) {
            console.log('List doesent have whitelist group')
            continue
        }

        if (whitelistProps.WhitelistActiveDays.includes(today.getDay())) {
            for (let i = 0; i < whitelistProps.WhitelistSlots; i++) {
                let id = user.Whitelist64IDs[i]?.steamID
                if (id) {
                    fBuffer.push(`Admin=${id}:${whitelistGroup.GroupName} // Originator: ${user.DiscordName}`)
                }
            }
        }
    }

    return fBuffer.join('\r\n')
}


/**
 * Filters out the roles that a user has that are valid for a specific list.
 * @param user {IDiscordUser}
 * @param validListRoles {IRole[]}
 */
function getValidUserRoles(user: IDiscordUser, validListRoles: IRole[]) {
    return validListRoles.filter(role => {
        return user.Roles.includes(role.RoleID)
    })
}



function generateAdminPermissionString(user: IDiscordUser)



function processUserRoles(user: IDiscordUser, discordRoles: IRole[]) {
    let userProps: IUserProps = { WhitelistSlots: 0, WhitelistActiveDays: []}

    for (const userRoleID of user.Roles) {
        for (const discordRole of discordRoles) {
            if (!(userRoleID === discordRole.RoleID)) {
                continue
            }

            if (userProps.WhitelistSlots < discordRole.WhitelistSlots) {
                userProps.WhitelistSlots = discordRole.WhitelistSlots
            }

            // TODO
            // This is intended to be a temp solution. It will effectively concatenate all the active days of a user, instead of grabbing their "highest"
            for (const day of discordRole.ActiveDays) {
                if (!userProps.WhitelistActiveDays.includes(day)) {
                    userProps.WhitelistActiveDays.push(day)
                }
            }
        }
    }

    return userProps
}


interface IUserProps {
    WhitelistSlots: number,
    WhitelistActiveDays: number[]
    // TODO add "admin" or singificance number here.
}


refreshLists()

