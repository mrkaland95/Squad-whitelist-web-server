


export type responseData = {
    isAuthenticated: boolean,
    isAdmin: boolean
    username: string,
    globalName: string
    avatar: string
    usersValidRoles: IDiscordRole[]
}


export interface IDiscordRole {
    RoleID: string,
    RoleName: string,
    GuildID: string
}
