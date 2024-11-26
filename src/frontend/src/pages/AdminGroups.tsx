import
{useQuery} from "@tanstack/react-query";
import React, {useEffect, useState} from "react";
import axios from "axios";


// import {InGameAdminPermissions} from "../../../../dist/backend/schema";

axios.defaults.withCredentials = true

function AdminGroups() {
    const { data, isLoading, error } = useQuery({
            queryKey: ['admingroups'],
            queryFn: fetchAdminGroups,
    });

    if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error.message}</p>;
    if (error) return <p>Unable to retrieve groups from the server</p>;
    if (!data) return <p>Something went wrong when loading your whitelist data</p>

    return (
    <div className={"admin-group-container"}>
        <h1>ADMIN GROUP MANAGEMENT</h1>
        <AdminGroupForm adminGroups={data}></AdminGroupForm>
    </div>
    )
}


function AdminGroupForm({adminGroups}: AdminGroupFormProps) {
  const [adminGroupRows, setAdminGroupRows] = useState<AdminGroupRow[]>([]);

  useEffect(() => {
      for (const group of adminGroups) {
        if (group.GroupName.toLowerCase() === 'whitelist') {
            const i = adminGroups.indexOf(group)
            adminGroups.splice(i, 1)
        }
      }
      setAdminGroupRows([...adminGroups])
  }, [adminGroups]);

  function onAddGroup() {
      const emptyGroup: AdminGroupRow = {
          _id: crypto.randomUUID(),
          GroupName: '',
          Enabled: true,
          IsWhitelistGroup: false,
          Permissions: []
      }
      setAdminGroupRows([...adminGroups, emptyGroup])
  }

  return (
    <div>
      <table id="admin-groups-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Group Name</th>
            <th style={{ textAlign: 'left' }}>Permissions</th>
            <th style={{ textAlign: 'left' }}>Enabled</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        <WhitelistGroup></WhitelistGroup>
          {adminGroupRows.map((group: AdminGroupRow, index) => (
            <tr key={group._id || index.toString()}>
              <td>
                <input
                  className="steam-id-input"
                  value={group.GroupName}
                  placeholder="Enter Group Name"
                  onChange={(e) => {
                    const newGroupName = e.target.value;
                    setAdminGroupRows((prev) => {
                      const updated = [...prev];
                      updated[index].GroupName = newGroupName;
                      return updated;
                    });
                  }}
                />
              </td>
                <td>
                    <div className={"admin-group-container permissions-wrapper"}>
                        {Array.from(ALL_POSSIBLE_PERMISSIONS_MAP.keys()).map((permission: string) => (
                            <div>
                                <input type={"checkbox"}
                                       id={`${index}-${permission}`}
                                       key={permission}
                                       title={ALL_POSSIBLE_PERMISSIONS_MAP.get(permission)}
                                       checked={group.Permissions.includes(permission)}
                                       onChange={(e) => {
                                           if (e.target.checked) {
                                               if (!group.Permissions.includes(permission)) {
                                                   group.Permissions.push(permission);
                                               }
                                           } else {
                                               group.Permissions = group.Permissions.filter(value => value !== permission);
                                           }

                                           setAdminGroupRows((prev) => {
                                               const updated = [...prev];
                                               updated[index].Permissions = group.Permissions;
                                               return updated;
                                           });
                                       }}
                                />
                                <label style={{paddingLeft: '0.25rem'}} htmlFor={`${index}-${permission}`}>{permission}</label>
                                <p style={{fontSize: '0.8rem'}}>
                                    <em>
                                    {ALL_POSSIBLE_PERMISSIONS_MAP.get(permission)}
                                    </em>
                                </p>
                            </div>
                        ))}
                    </div>
                </td>
                <td>
                    <input
                        type="checkbox"
                        checked={group.Enabled}
                        onChange={(event) => {
                            console.log(event.target.checked);
                            setAdminGroupRows((prev) => {
                                const updated = [...prev];
                                updated[index].Enabled = event.target.checked
                                return updated;
                            });
                        }}
                    />
                </td>
                <td>
                    <button
                        onClick={() => {
                            setAdminGroupRows((prev) =>
                                prev.filter((_, i) => i !== index)
                            );
                        }}>
                        DELETE
                    </button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
        <ButtonRow onAddGroup={onAddGroup} onGroupsSumbit={null}></ButtonRow>
    </div>
  );
}


function WhitelistGroup() {
    return (
    <tr title={"The whitelist group cannot be deleted"} style={{padding:'10px 10px'}}>
        <td>
            <input
                className={"steam-id-input"}
                value={"Whitelist"}
                disabled={true}
            />
        </td>
        <td>
            <div className={"admin-group-container permissions-wrapper"}>
                <label>
                <input type={"checkbox"} checked={true} disabled={true}/>
                    reserve
                </label>

            </div>
        </td>
        <td><input type={"checkbox"} disabled={true} checked={true}/></td>
    </tr>)
}



function ButtonRow({onAddGroup, onGroupsSubmit}: any) {
    return(
    <div className={"admin-group-container buttons-container"}>
        <button type={"button"} className={"default-button"} onClick={onGroupsSubmit}>Submit</button>
        <button type={"button"} className={"default-button"} onClick={onAddGroup}>Add Group</button>
    </div>)
}

async function fetchAdminGroups() {
    const res = await axios.get('http://localhost:5000/api/admingroups')

    if (res.status != 200) {
        throw new Error(`Unable to fetch admin group data`)
    }

    return res.data
}

const ALL_POSSIBLE_PERMISSIONS_MAP = new Map([
    ["changemap", "Allows a user to use map commands such as adminSetNextLayer or adminChangeMap."],
    ["canseeadminchat", "Allows a user to *see* the in-game admin chat, as well as teamkills on the feed."],
    ["chat", "Allows a user to *write* in the in-game admin chat, and use server broadcasts."],
    ["balance", "Allows a user to switch teams regardless of current balance."],
    ["kick", "Allows a user to use in game kick commands."],
    ["ban", "Allows a user to use in game ban commands."],
    ["immune", "Users with this permission cannot be kicked or banned."],
    ["manageserver", "Allows a user to use various management commands, including to kill the server."],
    ["cameraman", "Allows a user to use the in-game spectator camera."],
    ["forceteamchange", "Allows a user to force team swap other players."],
    ["reserve", "Allows a user to use the priority/whitelist queue."],
    ["teamchange", "Allows a user to change teams without penalty."],
    ["config", "Allows a user to set server configuration. Does not work for licensed servers."],
    ["pause", "Allows a user to pause the game. Does not work on licensed servers."],
    ["private", "Allows a user to set a server to private, does not work for licensed servers?"],
    ["cheat", "Allows a user to gain access to some cheat commands. Does not work on licensed servers."],
    ["featuretest", "Allows a user to use debug commands, such as spawning vehicles. Does not work on licensed servers"],
    ["debug", "Allows a user to use debug commands."],
])


/**
 * Interface that describes a group of in-game permissions.
 */
export interface IAdminGroup extends Document {
    GroupName: string,
    Permissions: InGameAdminPermissions[],
    Enabled: boolean,
    IsWhitelistGroup: boolean
}


type AdminGroupFormProps = {
    adminGroups: AdminGroupRow[]
}


type AdminGroupRow = {
    _id?: string
    GroupName: string,
    // ActivePermissions: InGameAdminPermissions[]
    Permissions: string[]
    Enabled: boolean,
    IsWhitelistGroup: boolean
}


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


export default AdminGroups
