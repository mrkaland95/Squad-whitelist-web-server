import {useQueries} from "@tanstack/react-query";
import {getAdminGroups, getListEndpoints, postListEndpoints} from "../utils/fetch";
import React, {ChangeEvent, FormEvent, useState} from "react";
import {AdminGroup, ListEndpoint} from "../../../shared-types/types";
import ToggleButton from "../components/Toggle-Button";
import Swal from "sweetalert2";
import {Dropdown, DropdownButton, DropdownMenu, DropdownToggle} from "react-bootstrap";
import ExpandableDropdown from "../components/ExpandableDropdown";
import CustomDropDownMenu from "../components/CustomDropDownMenu";


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
    const [endpointData, setEndpointData] = useState<ListEndpoint[]>(savedEndpoints)

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


        console.log("Delete on index: ", index)
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
        const newEndpoint: ListEndpoint = {
            ListName: '',
            ListID: crypto.randomUUID(),
            AdminGroups: [],
            AllRolesEnabled: false,
            Enabled: true,
            UseWhitelistGroup: true,
        }
        newEndpointData.push(newEndpoint)
        setEndpointData(newEndpointData)
    }

    return (
    <div id={"list-endpoint-div"}>
        {/*<div id={"list-endpoint-table-wrapper"}>*/}
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
                            {list.AdminGroups.map((group: AdminGroup) => (
                                <div className={"list-admin-group-wrapper"}>{group.GroupName}</div>
                            ))}
                            {/*<DropdownButton title={"Add Group"} className={"dropdown-button"}>*/}
                            {/*    {adminGroups.map((group) => (*/}
                            {/*        <Dropdown.Item*/}
                            {/*        className={"dropdown-item"}*/}
                            {/*        onClick={() => {*/}
                            {/*            const newEndpoints = [...endpointData];*/}
                            {/*            newEndpoints[listIndex].AdminGroups.push(group)*/}
                            {/*            setEndpointData(newEndpoints)*/}
                            {/*        }}>*/}
                            {/*            {group.GroupName}*/}
                            {/*            /!*<button className={"group-button"}>{group.GroupName}</button>*!/*/}
                            {/*        </Dropdown.Item>*/}
                            {/*    ))}*/}
                            {/*</DropdownButton>*/}
                            <CustomDropDownMenu buttonText={"Add Group"}>
                                <div>Test element</div>

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
                            <button
                                type={"button"}
                                className={"delete-button"}
                                title={"Delete List Endpoint"}
                                onClick={() => onDelete(listIndex)}
                            >
                                DELETE
                            </button>
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
            <h3 style={{paddingBottom: '1rem'}}><em>Help</em></h3>
            <hr/>
            <ExpandableDropdown buttonText={"What is a list?"} buttonTitle={"What is a list?"}>
                <h3>A list endpoint represents in-game admin permissions</h3>
                <p>This list </p>
            </ExpandableDropdown>
        </>)
}


function GroupButton() {
    return (
        <>

        </>)
}

function CheckEndpoints() {
    return (<></>)
}


function GroupDropdown({setListEndpoints, index}: any) {

}


interface formProps {
    adminGroups: AdminGroup[]
    savedEndpoints: IListEndpoint[]
}

interface IListEndpoint extends ListEndpoint {
    _id?: string
}


export default ListEdit