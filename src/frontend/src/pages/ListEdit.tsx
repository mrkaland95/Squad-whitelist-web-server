import {useQueries} from "@tanstack/react-query";
import {getAdminGroups, getListEndpoints, postListEndpoints} from "../utils/fetch";
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {AdminGroup, ListEndpoint} from "../../../shared-types/types";
import ToggleButton from "../components/Toggle-Button";
import Swal from "sweetalert2";
import {Dropdown, DropdownButton, DropdownMenu, DropdownToggle} from "react-bootstrap";
import ExpandableDropdown from "../components/ExpandableDropdown";
import CustomDropDownMenu, {CustomDropDownItem} from "../components/CustomDropDownMenu";
import AdminGroups from "./AdminGroups";
import DeleteButton from "../components/delete-button/DeleteButton";


function ListEdit() {
    const [groupsQuery, listsQuery] = useQueries({
        queries: [
            {
                queryKey: ['admingroups'],
                queryFn: getAdminGroups
            },
            {
                queryKey: ['listendpoints'],
                queryFn: getListEndpoints
            }
        ]
    })


    if (groupsQuery.isLoading || listsQuery.isLoading) return <p>Loading...</p>;
    if (groupsQuery.error || listsQuery.error) return <p>Error occurred when loading page</p>;
    if (!groupsQuery.data || !listsQuery.data) return <p>Something went wrong when loading list endpoint data</p>

    return (
    <div>
        <h1>LIST ENDPOINT MANAGEMENT</h1>
        <ListForm adminGroups={groupsQuery.data} savedEndpoints={listsQuery.data}></ListForm>
    </div>)
}

function ViewLists() {
    return (
    <>

    </>)
}


function ListForm({adminGroups, savedEndpoints}: formProps) {
    const [endpointData, setEndpointData] = useState<IListEndpoint[]>([])

    // We want to keep track of whether a list has been stored in the DB, so we do this here.
    useEffect(() => {
        const initialEndpointData: IListEndpoint[] = []
        for (const list of savedEndpoints) {
            const newList: IListEndpoint = {
                ...list,
                savedToDB: true
            }
            initialEndpointData.push(newList)
        }
        setEndpointData(initialEndpointData)
    }, [savedEndpoints]);

    console.log(endpointData)

    function onListToggle(e: ChangeEvent<HTMLInputElement>, index: number) {
        const newEndpointData = [...endpointData]
        newEndpointData[index].Enabled = e.target.checked
        setEndpointData(newEndpointData)
    }

    function onTrainingGroupToggle(e: ChangeEvent<HTMLInputElement>, index: number) {
        const newEndpointData = [...endpointData]
        newEndpointData[index].AllRolesEnabled = e.target.checked
        setEndpointData(newEndpointData)
    }

    function onNameChange(e: ChangeEvent<HTMLInputElement>, index: number) {
        const newEndpointData = [...endpointData]
        newEndpointData[index].ListName = e.target.value
        setEndpointData(newEndpointData)
    }

    function onGroupRemove(group: AdminGroup, index: number) {
        const newEndpointData = [...endpointData]
        newEndpointData[index].AdminGroups = newEndpointData[index].AdminGroups.filter(grp => grp.GroupID !== group.GroupID)
        setEndpointData(newEndpointData)
    }

    async function onDelete(index: number) {
        const markedEndpoint = endpointData[index]

        const userResponse = await Swal.fire({
            title: 'Are you sure you want to delete list?',
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            focusCancel: true
        })

        if (!userResponse.isConfirmed) {
            return
        }

        if (!markedEndpoint.savedToDB) {
            setEndpointData(endpointData.splice(index, 1))
        }


    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const userResponse = await Swal.fire({
            title: "Submit List Endpoints",
            text: "Are you sure you wish to submit list endpoints? This action is permanent.",
            icon: "warning",
            showCancelButton: true,
            denyButtonText: "Cancel"
        })

        if (!userResponse.isConfirmed) return

        const postResult = await postListEndpoints(endpointData)

        if (postResult.status !== 200) {
            await Swal.fire({
                icon: "error",
                title: "Something went wrong while submitting list endpoints!",
            })
        } else {
            await Swal.fire({
                icon: "success",
                title: "Successfully saved list endpoints!",
            })
        }
    }

    function onAddEndpoint() {
        const newEndpointData = [...endpointData]
        const newEndpoint: IListEndpoint = {
            ListName: '',
            ListID: crypto.randomUUID(),
            AdminGroups: [],
            AllRolesEnabled: false,
            Enabled: true,
            UseWhitelistGroup: true,
            savedToDB: false
        }
        newEndpointData.push(newEndpoint)
        setEndpointData(newEndpointData)
    }

    function onGroupAdd(listIndex: number, group: AdminGroup) {
        const newEndpoints = [...endpointData];
        newEndpoints[listIndex].AdminGroups.push(group)
        setEndpointData(newEndpoints)
    }

    return (
    <div id={"list-endpoint-div"}>
        <div className={"list-endpoint-table-wrapper"}>
        <form id={"list-endpoints-form"} onSubmit={(e) => onSubmit(e)}>
            <table>
                <thead>
                <tr>
                    <th id={"ListName"}>List Name</th>
                    <th id={"Groups"}>Groups</th>
                    <th id={"TrainingList"}> Training Group</th>
                    <th id={"Enabled"}>Enabled</th>
                    <th id={"Delete"}></th>
                </tr>
                </thead>
                <tbody>
                {endpointData.map((list: ListEndpoint, listIndex: number) => (
                    <tr>
                        <td>
                            <input
                                type={"input"}
                                className={"steam-id-input"}
                                placeholder={"Enter List Name"}
                                required={true}
                                value={list.ListName}
                                onChange={(e) => onNameChange(e, listIndex)}
                            />
                        </td>
                        <td>
                            <div className={"list-admin-group-wrapper"}>
                                {list.AdminGroups.map((group: AdminGroup) => (
                                    <button className={"remove-group-button"} type={"button"} title={`Remove group '${group.GroupName}' from list`} onClick={() => onGroupRemove(group, listIndex)}>
                                        {group.GroupName}
                                    </button>
                                ))}
                            </div>

                            <CustomDropDownMenu buttonText={"Add Group"}>
                                {adminGroups.map((group: AdminGroup) => (
                                    !list.AdminGroups.some(g => g.GroupName === group.GroupName)
                                        && <CustomDropDownItem onItemClicked={() => onGroupAdd(listIndex, group)}>
                                                <span>{group.GroupName}</span>
                                            </CustomDropDownItem>))
                                }
                            </CustomDropDownMenu>
                        </td>
                        <td>
                            <ToggleButton
                                checked={list.AllRolesEnabled}
                                title={`Enable list endpoint as training list.`}
                                onToggle={(e) => onTrainingGroupToggle(e, listIndex)}
                            />
                        </td>
                        <td>
                            <ToggleButton
                                checked={list.Enabled}
                                title={`Enable ${list.ListName}`}
                                key={list.ListName}
                                onToggle={(e) => onListToggle(e, listIndex)}
                            />
                        </td>
                        <td>
                            <DeleteButton buttonText={"Delete"} buttonTitle={"Delete list endpoint"} onClick={() => onDelete(listIndex)} />
                            {/*<button*/}
                            {/*    type={"button"}*/}
                            {/*    className={"delete-button"}*/}
                            {/*    title={"Delete List Endpoint"}*/}
                            {/*    onClick={() => onDelete(listIndex)}*/}
                            {/*>*/}
                            {/*    DELETE*/}
                            {/*</button>*/}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="list-endpoint-buttons-wrapper">
                <button className={"default-button"} type={"button"} onClick={onAddEndpoint}>Add Endpoint</button>
                <button className={"default-button"} type={"submit"}>Submit</button>
            </div>
        </form>
        </div>

        <div className={"generic-content-wrapper"}>
            <HelpDropDown/>
        </div>

        <div className={"list-endpoint-table-wrapper"}>
            <ExpandableDropdown buttonText={"Show Endpoints"}>
            </ExpandableDropdown>
        </div>
    </div>)
}

function HelpDropDown() {
    return (
        <>
            <h3 style={{paddingBottom: '1rem'}}><em>Frequently asked Questions</em></h3>
            <hr/>
            <ExpandableDropdown buttonText={"What is a list?"} buttonTitle={"What is a list?"}>
                <h3>A list endpoint is used to generate in-game admin permissions</h3>
                <p>This works by mapping the admin groups to the discord roles that has those admin groups assigned to them, <br/>and
                    retrieving the steamIDs associated with the users that has those discord roles. </p>
                <h3>List Name</h3>
                <p>The list name represents the name to be used when querying the web server for a generated list.<br/>
                For example, if the list name is "adminlist", you would send an HTTP GET request to "/lists/adminlist" to retrieve the generated list with that name.</p>
                <h3>Groups</h3>
                <p>These are the groups of in-game permissions that the list will use. The list will then map the steamIDs of all users that has discord roles associated with them.</p>
                <p>For example, if a list has a group called "Admins" added to it, it would add the personal steamID of all users that has a discord role with the "Admins" group assigned to it.</p>
                <h3></h3>
            </ExpandableDropdown>
        </>)
}


function GroupButton() {
    return (
    <>
        <button></button>
    </>)
}

function CheckEndpoints() {
    return (<></>)
}


interface formProps {
    adminGroups: AdminGroup[]
    savedEndpoints: ListEndpoint[]
}

interface ExistingGroupButtonProps {
    adminGroup: AdminGroup
    onClick: Function

}

interface IListEndpoint extends ListEndpoint {
    _id?: string
    savedToDB: boolean
}


export default ListEdit