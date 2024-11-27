import * as mongoose from "mongoose";
import { Document } from "mongoose";
import {defaultLogger} from "./logger";


/*
Pulled and defined from:
https://squad.fandom.com/wiki/Server_Administration
 */
export enum InGameAdminPermissions {
    CHANGE_MAP = "changemap",
    CAN_SEE_ADMIN_CHAT = "canseeadminchat",
    BALANCE = "balance",
    PAUSE = "pause",
    CHEAT = "cheat",
    PRIVATE = "private",
    CAN_USE_ADMIN_CHAT = "chat",
    KICK = "kick",
    BAN = "ban",
    CONFIG = "config",
    IMMUNE = "immune",
    MANAGE_SERVER = "manageserver",
    CAMERAMAN = "cameraman",
    FEATURE_TEST = "featuretest",
    FORCE_TEAM_CHANGE = "forceteamchange",
    RESERVE = "reserve",
    DEBUG = "debug",
    TEAM_CHANGE = "teamchange"
}

/*
A week day corresponding to a number, particularly to inbuilt Javascript
Date.getDay() method.
 */
export enum WeekDays {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}


export interface IDiscordUser extends Document {
    DiscordID: string;
    DiscordName: string;
    Roles: string[];
    Whitelist64IDs: { steamID: string; name?: string }[];
    UserID64?: { steamID: string; isLinkedToSteam: boolean};
    Enabled: boolean;
}

/**
 * Interface that describes a group of in-game permissions.
 */
export interface IAdminGroup extends Document {
    GroupID: string;
    GroupName: string,
    Permissions: [InGameAdminPermissions],
    Enabled: boolean,
    IsWhitelistGroup: boolean
}


export interface IPrivilegedRole extends Document {
    RoleID: string,
    RoleName: string,
    AdminGroup?: IAdminGroup,
    ActiveDays: [WeekDays],
    WhitelistSlots: number
    Enabled: boolean
}


export interface ILog extends Document {
    LogMessage: string,
    MessageType?: string,
}


export interface IDiscordRole extends Document {
    RoleID: string,
    RoleName: string,
    GuildID: string
}

export interface IAPIKey extends Document {
    APIKey: string
}


/*
ListName: Represents the name of an endpoint to retrieve a last, i.e. /lists/:ListName
AdminGroups: The in game admin groups that a list will use.

// TODO this may have to be expanded in the future.
 */
export interface IListEndpoint extends Document {
    ListName: string,
    AdminGroups: [IAdminGroup],
    AllRolesEnabled: boolean,
    UseWhitelistGroup: boolean,
    Enabled: boolean
}


/**
Stores API keys that can be used to retrieve lists or exposed data if it's set to a required parameter for a expressRoute.

 TODO add functionality for generating and automatically adding an API key.
 */
const apiSchema = new mongoose.Schema({
    APIKey: { type: String, required: true, unique: true }
    }, {
    timestamps: true
    }
)


/**
 *
 */
const discordUserSchema = new mongoose.Schema<IDiscordUser>({
    DiscordID: { type: String, unique: true, required: true },
    // TODO add a separate field for globalname.
    DiscordName: { type: String, required: true },
    Roles: { type: [String], required: true },
    Whitelist64IDs: [
        {
            steamID: { type: String, required: true },
            name: { type: String, required: false },
        },
    ],
    // Change this into an object that stores the steamID and whether the steamID was retrieved by steam authentication directly.
    UserID64: {
        steamID: {type: String, required: true},
        isLinkedToSteam: {type: Boolean, required: false, default: false }
    },
    Enabled: { type: Boolean, required: true },
    }, {
        timestamps: true
    }
);

const adminGroupsSchema = new mongoose.Schema<IAdminGroup>({
    GroupName: { type: String, unique: true, required: true },
    GroupID: { type: String, unique: true, required: true, default: crypto.randomUUID },
    Permissions: { type: [String], required: true, enum: Object.values(InGameAdminPermissions) },
    Enabled: { type: Boolean, required: true, default: true },
    // I.e. all the user's whitelist slots will only get used for a list if it contains this group.
    IsWhitelistGroup: { type: Boolean, required: true, default: false}
    }, {
        timestamps: true
    }
)


const inGameRoleSchema = new mongoose.Schema<IPrivilegedRole>({
    RoleID: { type: String, required: true, unique: true},
    RoleName: { type: String, required: true },
    AdminGroup: { type: adminGroupsSchema, required: false},
    ActiveDays: {
        type: [Number], required: true,
        validate: {
            validator: (days: number[]) => days.every(day => Object.values(WeekDays).includes(day)),
            message: props => `${props.value} is not a valid day of the week`,
        }
    },
    WhitelistSlots: { type: Number, required: true, default: 0 },
    Enabled: Boolean,
    }, {
        timestamps: true
    }
)

const allServerRolesSchema = new mongoose.Schema<IDiscordRole>({
    RoleID: { type: String, required: true, unique: true },
    RoleName: {type: String, required: true },
    GuildID: {type: String, required: true },
    }, {
        timestamps: true
    }
)

const listSchema = new mongoose.Schema<IListEndpoint>({
    ListName: { type: String, required: true, unique: true },
    AdminGroups: { type: [adminGroupsSchema], required: true, default: [] },
    // I.e. if all users that has ANY role mapped to the admin group, should be enabled for this list.
    AllRolesEnabled: { type: Boolean, required: true, default: true },
    Enabled: { type: Boolean, required: true, default: true }
    }, {
        timestamps: true
    }
)


const loggingSchema = new mongoose.Schema<ILog>({
    LogMessage: { type: String, required: true },
    MessageType: { type: String, required: false }
    }, {
        timestamps: true
    }
)


export const DiscordUsersDB = mongoose.model('Users', discordUserSchema)
export const RolesDB = mongoose.model('Roles', inGameRoleSchema)
export const AdminGroupsDB = mongoose.model('AdminGroups', adminGroupsSchema)
export const APIKeysDB = mongoose.model('APIKeys', apiSchema)
export const LoggingDB = mongoose.model('Logs', loggingSchema)
export const AllServerRolesDB = mongoose.model('AllServerRoles', allServerRolesSchema)
export const ListsDB = mongoose.model('Lists', listSchema)

export async function initializeWhitelistGroup() {
    try {
        defaultLogger.debug(`Initializing "whitelist" group.`)
        const whitelistGroup = await AdminGroupsDB.findOneAndUpdate({
            GroupName: 'Whitelist'
        }, {
            GroupID: crypto.randomUUID(),
            GroupName: 'Whitelist',
            Permissions: [InGameAdminPermissions.RESERVE],
            IsWhitelistGroup: true,
            Enabled: true
       }, {
            new: true,
            runValidators: true,
            upsert: true
       })
    } catch (e) {
        console.error("Error when initializing whitelist group", e)
    }
}
