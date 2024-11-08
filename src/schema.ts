// import * as mongoose from "mongoose";
import * as mongoose from "mongoose";
import { Document } from "mongoose";


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
    DEMOS = "demos",
    DEBUG = "debug",
    TEAM_CHANGE = "teamchange"
}

/*
A week day corresponding to a number, particularly to inbuilt Javascript
Date.getDay() method.
 */
enum WeekDays {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}


interface IDiscordUser extends Document {
    DiscordID: string;
    DiscordName: string;
    Roles: string[];
    Whitelist64IDs: { steamID: string; name?: string }[];
    AdminRole64ID?: string;
    Enabled: boolean;
}

/**
 * Interface that describes a group of in-game permissions.
 */
interface IAdminGroup extends Document {
    GroupName: string,
    Permissions: [InGameAdminPermissions],
    Enabled: boolean
}


interface IRole extends Document {
    RoleID: string,
    RoleName: string,
    AdminGroup?: IAdminGroup,
    ActiveDays: [WeekDays],
    WhitelistSlots: number
    Enabled: boolean
}


interface ILog extends Document {
    LogMessage: string,
    MessageType?: string,
}


interface IServerRole extends Document {
    RoleID: string,
    RoleName: string,
    GuildID: string
}

interface IAPIKeys extends Document {
    APIKey: string
}


/*
ListName: Represents the name of an endpoint to retrieve a last, i.e. /lists/:ListName
AdminGroups: The in game admin groups that a list will use.


// TODO this may have to be expanded in the future.
 */
interface IListEndpoints extends Document {
    ListName: string,
    AdminGroups: [IAdminGroup]
    AllRolesEnabled: boolean
}




/**
Stores API keys that can be used to retrieve lists or exposed data if it's set to a required parameter for a route.

 TODO add functionality for generating and automatically adding an API key.
 */
export const apiSchema = new mongoose.Schema<IAPIKeys>({
    APIKey: { type: String, unique: true, required: true },
    }, {
    timestamps: true
    }
)


/**
 *
 */
export const discordUserSchema = new mongoose.Schema<IDiscordUser>({
    DiscordID: { type: String, unique: true, required: true },
    DiscordName: { type: String, required: true },
    Roles: { type: [String], required: true },
    Whitelist64IDs: [
        {
            steamID: { type: String, required: true },
            name: { type: String, required: false },
        },
    ],
    AdminRole64ID: { type: String, required: false },
    Enabled: { type: Boolean, required: true },
    }, {
        timestamps: true
    }
);

export const adminGroupsSchema = new mongoose.Schema<IAdminGroup>({
    GroupName: { type: String, required: true, unique: true },
    Permissions: { type: [InGameAdminPermissions], required: true },
    Enabled: { type: Boolean, required: true, default: true },
    }, {
        timestamps: true
    }
)


export const inGameRoleSchema = new mongoose.Schema<IRole>({
    RoleID: { type: String, required: true, unique: true},
    RoleName: { type: String, required: true },
    AdminGroup: { type: adminGroupsSchema, required: false},
    ActiveDays: { type: [WeekDays], required: true },
    WhitelistSlots: { type: Number, required: true, default: 0 },
    Enabled: Boolean,
    }, {
        timestamps: true
    }
)

export const allServerRolesSchema = new mongoose.Schema<IServerRole>({
    RoleID: { type: String, required: true, unique: true },
    RoleName: {type: String, required: true },
    GuildID: {type: String, required: true },
    }, {
        timestamps: true
    }
)

const listSchema = new mongoose.Schema<IListEndpoints>({
    ListName: { type: String, required: true, unique: true },
    AdminGroups: { type: [adminGroupsSchema], required: true },
    AllRolesEnabled: { type: Boolean, required: true, default: true }
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