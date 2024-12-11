import {useQuery} from "@tanstack/react-query";
import React, {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {arrayMove, SortableContext, useSortable} from "@dnd-kit/sortable";
import {closestCenter, DndContext} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {getAdminGroups, postAdminGroups} from "../utils/fetch";
import {cancelButtonColor, confirmButtonColor} from "../utils/utils";
import ToggleButton from "../components/Toggle-Button";


axios.defaults.withCredentials = true


function AdminGroups() {
    const { data, isLoading, error } = useQuery({
            queryKey: ['admingroups'],
            queryFn: getAdminGroups,
    });

    if (isLoading) return <p>Loading...</p>;
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
            title: 'Are you sure you want to submit groups?',
            text: `This action is permanent`,
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: 'CANCEL',
            cancelButtonColor: cancelButtonColor,
            confirmButtonColor: confirmButtonColor,
            confirmButtonText: 'SUBMIT',
            focusConfirm: true,
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

        const result = await postAdminGroups(adminGroupRows)

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


    function onInputChange(index: number, e: any) {
        const newGroupName = e.target.value;
        setAdminGroupRows((prev) => {
            const updated = [...prev];
            updated[index].GroupName = newGroupName;
            return updated;
        });
    }

    async function onRowDelete(group: AdminGroupRow) {
        const result = await Swal.fire({
            title: 'Delete admin group',
            text: 'Are you sure you wish to delete this group? This action cannot be undone.',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            icon: "warning",
        })

        if (!result.isConfirmed) return;

        const newAdminGroupRows = adminGroupRows.filter(row => row.GroupID !== group.GroupID);
        setAdminGroupRows(newAdminGroupRows);

        if (!group?._id) {
            await Swal.fire({
                title: 'Success',
                text: `Successfully deleted group: ${group.GroupName}`,
                icon: "success"
            })
            return
        }

        const response = await axios.delete(
            `http://localhost:5000/api/v1/admingroups/`,
            {
                data: { id: group.GroupID }
            }
        )

        if (response.statusText != 'OK') {
            await Swal.fire({
                title: 'Error',
                text: `Error occured when attempting to delete the group.`,
                icon: "warning",
            })
            return
        }

        await Swal.fire({
            title: 'Success',
            text: `Successfully deleted group: ${group.GroupName}`,
            icon: "success"
        })
    }

    function handleDragEnd(event: any) {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = adminGroupRows.findIndex(row => row.GroupID === active.id);
            const newIndex = adminGroupRows.findIndex(row => row.GroupID === over.id);

            setAdminGroupRows((rows) => arrayMove(rows, oldIndex, newIndex));
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
                  <th id={"GroupName"}>Group Name</th>
                  <th id={"Permissions"}>Permissions</th>
                  <th id={"Enabled"}>Enabled</th>
                  <th id={"Delete"}></th>
              </tr>
              </thead>
              <tbody>
              <WhitelistGroup></WhitelistGroup>
                <SortableContext items={adminGroupRows.map((group) => group.GroupID)}>
                    {adminGroupRows.map((group, index) => (
                        <SortableGroupRow
                            key={group.GroupID || index}
                            id={group.GroupID || index.toString()}
                            row={group}
                            index={index}
                            onInputChange={onInputChange}
                            onRowDelete={onRowDelete}
                            setAdminGroupRows={setAdminGroupRows}
                        />
                    ))}
                </SortableContext>
            </tbody>
        </table>
    <ButtonRow onAddGroup={onAddGroup}></ButtonRow>
    </form>
  </div>
  );
}


function SortableGroupRow({row, index, onInputChange, onRowDelete, setAdminGroupRows}: any) {
    function onGroupToggle(e: ChangeEvent<HTMLInputElement>, permission: string) {
        if (e.target.checked && !row.Permissions.includes(permission)) {
            row.Permissions.push(permission);
        } else {
            row.Permissions = row.Permissions.filter((value: string) => value !== permission);
        }

        setAdminGroupRows((prev: any) => {
            const updated = [...prev];
            updated[index].Permissions = row.Permissions;
            return updated;
        });
    }


    return (
    <tr key={row.GroupID || index.toString()}>
        <td>
            <input
                className="steam-id-input"
                value={row.GroupName}
                placeholder="Enter Group Name"
                onChange={(e) => onInputChange(index, e)}
                required={true}
            />
        </td>
        <td>
            <div className={"admin-group-container permissions-wrapper"}>
                {Array.from(ALL_POSSIBLE_PERMISSIONS_MAP.keys()).map((permission: string) => (
                    <div>
                        <div style={{display: "flex", justifyContent: "left", alignItems: "center"}}>
                        <ToggleButton
                            checked={row.Permissions.includes(permission)}
                            onToggle={(e) => onGroupToggle(e, permission)}
                            id={`${index.toString()}_${permission}`}
                            title={ALL_POSSIBLE_PERMISSIONS_MAP.get(permission)}
                        />

                        <label
                            style={{paddingLeft: '0.35rem'}}
                            htmlFor={`${index.toString()}_${permission}`}
                            title={ALL_POSSIBLE_PERMISSIONS_MAP.get(permission)}>
                            {permission}
                        </label>
                        </div>

                        <p style={{fontSize: '0.7rem'}}><em>
                            {ALL_POSSIBLE_PERMISSIONS_MAP.get(permission)}
                        </em></p>
                    </div>
                ))}
            </div>
        </td>
        <td>
        <ToggleButton
            title={"Whether the group is enabled"}
            checked={row.Enabled} onToggle={(e)=> {
            setAdminGroupRows((prev: any) => {
                const updated = [...prev];
                updated[index].Enabled = e.target.checked
                return updated;
            })
        }}/>
        </td>
        <td>
            <button className={"delete-button"} type={"button"} onClick={() => onRowDelete(row)}>
                DELETE
            </button>
        </td>
    </tr>)
}


function WhitelistGroup() {
    return (
        <tr title={"The whitelist group cannot be deleted"} style={{padding: '10px 10px'}}>
            <td>
                <input
                    className={"steam-id-input"}
                    value={"Whitelist"}
                    disabled={true}
                />
            </td>
            <td>
                <div className={"admin-group-container permissions-wrapper"}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <ToggleButton
                            checked={true}
                            onToggle={(e) => e.preventDefault()}
                            id={"whitelist-checkbox"}
                            disabled={true}
                        />

                        <label htmlFor={"whitelist-checkbox"} style={{paddingLeft: '0.25rem'}}>
                            reserve
                        </label>
                    </div>

                </div>
            </td>
            <td><input type={"checkbox"} disabled={true} checked={true}/></td>
        </tr>)
}


function ButtonRow({onAddGroup}: any) {
    return (
        <div className={"admin-group-container buttons-container"}>
            <button type={"submit"} className={"default-button"}>Submit</button>
            <button type={"button"} className={"default-button"} onClick={onAddGroup}>Add Group</button>
        </div>)
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
export interface IAdminGroup {
    _id?: string
    GroupID: string,
    GroupName: string,
    Permissions: string[]
    Enabled: boolean,
    IsWhitelistGroup: boolean
    createdAt?: Date
    updatedAt?: Date
}


type AdminGroupFormProps = {
    adminGroups: AdminGroupRow[]
}


export type AdminGroupRow = {
    _id?: string
    GroupID: string,
    GroupName: string,
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
