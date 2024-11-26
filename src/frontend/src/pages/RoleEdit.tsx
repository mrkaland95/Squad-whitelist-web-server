import {IAdminGroup} from "./AdminGroups";
import {WeekDays} from "../utils/utils";
import {useState} from "react";


function RoleEdit() {
    const mockData: IPrivilegedRole[] = [
        {
            RoleName: "",
            RoleID: "12345",
            ActiveDays: [WeekDays.Friday, WeekDays.Thursday, WeekDays.Saturday],
            WhitelistSlots: 5,
            Enabled: true
        }
    ]


    const [roles, setRoles] = useState<IPrivilegedRole[]>([...mockData])

    return (<>
        <div className={"roles-edit-container"}>
        <h1>PRIVILEGED DISCORD ROLES MANAGEMENT</h1>
        <table>
            <thead>
            <tr>
                <th>
                    Role ID
                </th>
                <th>
                    Role Name
                </th>
                <th>
                    Active Days
                </th>
                <th>
                   Whitelist Slots
                </th>
                <th>
                    Enabled
                </th>
            </tr>
            </thead>
            <tbody>
            {roles.map(((role, index) => (
                <tr key={role.RoleID || index.toString()}>
                    <td>
                        <input
                        type={"text"}
                        className={`steam-id-input`}
                        value={role.RoleID}
                        placeholder={"Role ID"}
                        // onChange={(e) => {e.currentTarget.value = e.target.value}}
                        />
                    </td>

                </tr>
            )))}
            </tbody>
        </table>
        </div>
    </>)
}


export interface IPrivilegedRole {
    _id?: string
    RoleID: string,
    RoleName: string,
    AdminGroup?: IAdminGroup,
    ActiveDays: WeekDays[],
    WhitelistSlots: number
    Enabled: boolean
}


export default RoleEdit