import * as mongoose from "mongoose";
import {AdminGroupsDB, DiscordUsersDB, InGameAdminPermissions, ListsDB, RolesDB, WeekDays} from "../src/schema";

const connectionString = "mongodb://127.0.0.1:27017/whitelist-v2-throwaway"


/**
 * Manual tests for checking that the correct data is being put into the various schemas.
 */

async function main() {
    await mongoose.connect(connectionString)
    const dummyUserID = `12345`
    const dummyDiscordRoleID = '12345'
    const dummyDiscordRoleID2 = '123457'

    // await DiscordUsersDB.deleteMany()
    // await ListsDB.deleteMany()
    // await AdminGroupsDB.deleteMany()
    // await RolesDB.deleteMany()


    const testUser = await DiscordUsersDB.findOneAndUpdate({
        DiscordID: dummyUserID
    }, {
        DiscordID: dummyUserID,
        DiscordName: 'testuser',
        Roles: [dummyDiscordRoleID],
        Whitelist64IDs: [ {steamID: '12345', name: 'testname'} ],
        Enabled: true
    }, {
        upsert: true, new: true, runValidators: true
    }).exec()


    const testGroup = await AdminGroupsDB.findOneAndUpdate({
        GroupName: "Admins",
    }, {
        GroupName: "Admins",
        Permissions: [InGameAdminPermissions.FEATURE_TEST, InGameAdminPermissions.CAN_SEE_ADMIN_CHAT],
        Enabled: true
    }, {
        upsert: true, new: true, runValidators: true
    }).exec()


    const testRole = await RolesDB.findOneAndUpdate({
        RoleID: dummyDiscordRoleID
    }, {
        RoleID: dummyDiscordRoleID,
        RoleName: "TestRole",
        AdminGroup: testGroup,
        ActiveDays: [WeekDays.Monday, WeekDays.Tuesday, WeekDays.Thursday],
        Enabled: true
    }, {
        upsert: true, new: true, runValidators: true
    }).exec()


    const testRole2 = await RolesDB.findOneAndUpdate({
        RoleID: dummyDiscordRoleID2
    }, {
        RoleID: dummyDiscordRoleID2,
        RoleName: "TestRole2",
        ActiveDays: [WeekDays.Sunday, WeekDays.Wednesday, WeekDays.Friday],
        Enabled: true
    }, {
        upsert: true, new: true, runValidators: true
    }).exec()


    const testList = await ListsDB.findOneAndUpdate({
        ListName: 'testlist'
    }, {
        AdminGroups: [testGroup],
        AllRolesEnabled: false,
    }, {
        upsert: true, new: true, runValidators: true
    }).exec()


    console.log("Test Group: ", testGroup);
    console.log("Test User: ", testUser)
    console.log("Test Role: ", testRole)
    console.log("Test Role2: ", testRole2)
    console.log("Test List: ", testList)

    if (testList) {
        console.log(testList.AdminGroups);
    }

    // await DiscordUsersDB.deleteMany()
    // await ListsDB.deleteMany()
    // await AdminGroupsDB.deleteMany()
    // await RolesDB.deleteMany()



    process.exit()
}


main()
