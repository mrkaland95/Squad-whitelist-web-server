import
{useQuery} from "@tanstack/react-query";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {Simulate} from "react-dom/test-utils";
import cancel = Simulate.cancel;


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
        <h1 style={{paddingBottom: '1rem'}}>ADMIN GROUP MANAGEMENT</h1>
        <AdminGroupForm adminGroups={data}></AdminGroupForm>
    </div>
    )
}


function AdminGroupForm({adminGroups}: AdminGroupFormProps) {
  const [adminGroupRows, setAdminGroupRows] = useState<AdminGroupRow[]>([]);
  const [initialAdminGroupRows, setInitialAdminGroupRows] = useState<AdminGroupRow[]>([...adminGroups]);

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
          GroupID: crypto.randomUUID(),
          GroupName: '',
          Enabled: true,
          IsWhitelistGroup: false,
          Permissions: []
      }
      adminGroupRows.push(emptyGroup)
      setAdminGroupRows([...adminGroupRows])
  }


  async function onSubmitGroup(e: any) {
      const res = await Swal.fire({
          title: 'Submit groups',
          text: `Are you sure you want to submit groups?`,
          icon: "question",
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          cancelButtonColor: "#9d0d0d",
          backdrop: true
      })

      if (!res.isConfirmed) return;

      if (adminGroupRows.some(row => !row.GroupName)) {
          await Swal.fire({
              title: `Empty group name`,
              text: `Groups cannot have an empty name.`,
              icon: "warning"
          })
          return
      }

      let duplicateGroups: AdminGroupRow[] = []
      for (const group1 of adminGroupRows) {
          for (const group2 of adminGroupRows) {
              if (group1 === group2) {
                  continue
              }

              if (group1.GroupName === group2.GroupName) {
                  duplicateGroups.push(group1)
              }
          }
      }

      if (duplicateGroups.length > 0) {
          await Swal.fire({
              title: 'Duplicate group names',
              text: `Groups cannot have duplicate names: ${duplicateGroups.map(group => group.GroupName).join('\n')}`,
              icon: "warning"
          })
          return
      }

      const result = await axios.post(
          'http://localhost:5000/api/admingroups',
          {
              adminGroupRows
          }
      )

      if (result.statusText == 'OK') {
          await Swal.fire({
              title: 'Success',
              text: `Successfully installed groups`,
              icon: "success"
          })
      } else {
          await Swal.fire({
              title: 'Error',
              text: `Error occured when installing groups`,
              icon: "error"
          })
      }
  }

  return (
      <div>
          <form onSubmit={e => {
              e.preventDefault();
              onSubmitGroup(e)}}>

              <table id="admin-groups-table">
                  <thead>
                  <tr>
                      <th id={"GroupName"} style={{textAlign: "left"}}>Group Name</th>
                      <th id={"Permissions"} style={{textAlign: 'left'}}>Permissions</th>
                      <th id={"Enabled"} style={{textAlign: 'left'}}>Enabled</th>
                      <th id={"Delete"}></th>
                  </tr>
                  </thead>
                  <tbody>
                  <WhitelistGroup></WhitelistGroup>

                  {adminGroupRows.map((group: AdminGroupRow, index) => (
                      <tr key={group.GroupID || index.toString()}>
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
                                          <label style={{paddingLeft: '0.25rem'}}
                                                 htmlFor={`${index}-${permission}`}>{permission}</label>
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
    {/*<ButtonRow onAddGroup={onAddGroup} onGroupsSubmit={onSubmitGroup}></ButtonRow>*/}
    <ButtonRow onAddGroup={onAddGroup}></ButtonRow>
    </form>
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
                <input id={"whitelist-checkbox"} type={"checkbox"} checked={true} disabled={true}/>
                <label htmlFor={"whitelist-checkbox"} style={{paddingLeft: '0.25rem'}}>
                    reserve
                </label>
            </div>
        </td>
        <td><input type={"checkbox"} disabled={true} checked={true}/></td>
    </tr>)
}



function ButtonRow({onAddGroup}: any) {
    return(
    <div className={"admin-group-container buttons-container"}>
        <button type={"submit"} className={"default-button"} >Submit</button>
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
    GroupID: string,
    GroupName: string,
    // ActivePermissions: InGameAdminPermissions[]
    Permissions: string[]
    Enabled: boolean,
    IsWhitelistGroup: boolean
    createdAt?: Date
    updatedAt?: Date
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
