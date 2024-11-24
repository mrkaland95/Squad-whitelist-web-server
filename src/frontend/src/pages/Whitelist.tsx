import axios from "axios";
import { useQuery } from '@tanstack/react-query';
import React, {useEffect, useState} from "react";
import {IPrivilegedRole} from "../../../../dist/backend/schema";
import Swal from "sweetalert2";
import {steamID64Regex, WeekDays} from "../utils/utils";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


function Whitelist() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['whitelist'],
        queryFn: fetchUsersWhitelists,
    });

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data) return <p>Something went wrong when loading your whitelist data</p>

    const activeDaysList = data.whitelistActiveDays.map(day => {
        return daysMap.get(day)
    })

    return (
    <>
        <div className={"whitelist-container"}>
            <h1>
                WHITELIST MANAGEMENT
            </h1>
            <h3>
               This page is used for managing your whitelist slots for other people
            </h3>
            <p style={{paddingBottom: '10px', paddingTop: '10px'}}>
                <em>You currently have {data.whitelistSlots} whitelist slots available<br/></em>
            </p>
            <div className={"whitelist-forms"}>
                <WhiteListForms whitelist={data.whitelistedSteam64IDs} whitelistSlots={data.whitelistSlots}></WhiteListForms>
            </div>
        </div>
    </>
    )
}


function WhiteListForms({whitelist, whitelistSlots}: WhitelistFormProps) {
    const [whitelistRows, setWhitelistRows] = useState<WhitelistRow[]>([])

    useEffect(() => {
        let slots: WhitelistRow[] = []
        for (let i = 0; i < whitelist.length || i < whitelistSlots; i++) {
            let row: WhitelistRow = { steamID: '', name: '' }
            const steamID = whitelist[i]?.steamID
            const name = whitelist[i]?.name
            // We only want to store the name if there is a steamID
            if (steamID) {
                row.steamID = steamID
                if (name) {
                    row.name = name
                }
            }
            slots.push(row)
            setWhitelistRows([...slots])
        }
    }, [whitelist, whitelistSlots])


    function handleInputChange(index: number, field: 'steamID' | 'name', value: string) {
        const updatedRows = [...whitelistRows]
        updatedRows[index][field] = value;
        setWhitelistRows(updatedRows)
    }


    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onFormSubmit(whitelistRows);
    }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = whitelistRows.findIndex(row => row.steamID === active.id);
      const newIndex = whitelistRows.findIndex(row => row.steamID === over.id);

      setWhitelistRows((rows) => arrayMove(rows, oldIndex, newIndex));
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={whitelistRows.map((row) => row.steamID)}>
          <form onSubmit={handleSubmit}>
          {/*<label>Whitelist Slots</label>*/}
          {whitelistRows.map((row, index) => (
            <SortableRow
              key={row.steamID || index}
              id={row.steamID || index.toString()}
              row={row}
              index={index}
              onInputChange={handleInputChange}
            />
          ))}
          <div style={{ display: 'flex', justifyContent: "center" }}>
            <button type="submit" style={{ marginTop: '20px' }} className="default-button" title={"Submit your steamIDs to our systems"}>
              Submit
            </button>
          </div>
        </form>
      </SortableContext>
    </DndContext>
  );
}


function SortableRow({ id, row, index, onInputChange }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={"whitelist-container row-box"}
      style={{ ...style}}
      {...attributes}
      {...listeners}
    >
      <input
        type="text"
        value={row.steamID}
        onChange={(e) => onInputChange(index, 'steamID', e.target.value)}
        placeholder={"Enter SteamID"}
        maxLength={17}
        className={"steam-id-input"}
      />
      <input
        type="text"
        value={row.name}
        onChange={(e) => onInputChange(index, 'name', e.target.value)}
        placeholder="Enter Optional Name"
        maxLength={50}
        className={"steam-id-input"}
      />
      <button type="button" style={{ marginRight: '10px' }}>
        Check SteamID
      </button>
    </div>
  );
}


async function fetchUsersWhitelists(): Promise<WhitelistResponseData> {
    const res = await axios({
        method: "GET",
        url: "http://localhost:5000/api/profile/user",
        withCredentials: true
    })

    if(res.status != 200) {
        throw new Error("Unable to fetch whitelist data.")
    }

    return res.data
}

//
//     // TODO this wills end a post request to the server with the steamID, which will then send an API request to steam to see if the steamID is valid.
// function validateSteamID(steamID: string, whitelistRows: WhitelistRow[]) {
//     const result = steamID64Regex.test(steamID)
//     console.log("Validate triggered for ID: ", steamID, "result: ", result)
//     // TODO add some sort of feedback if the steamID does not pass the regex validation.
//     // if (!result) return;
//
//
//     console.log(whitelistRows)
//
//     const postRes = axios({
//         method: "POST",
//         url: "http://localhost:5000/api/profile/validateid",
//         data: {steamID: steamID},
//         withCredentials: true
//     })
// }



function validateSteamIDs(whitelistRows: WhitelistRow[]) {
    // const result = steamID64Regex.test(steamID)
    // console.log("Validate triggered for ID: ", steamID, "result: ", result)
    // if (!result) return;

    // TODO add some sort of feedback if the steamID does not pass the regex validation.
    for (const row of whitelistRows) {
        if (steamID64Regex.test(row.steamID)) {
            console.log("Invalid steamID detected.")
        }
    }
    console.log(whitelistRows)

    const postRes = axios({
        method: "POST",
        url: "http://localhost:5000/api/profile/validateid",
        data: {steamID: whitelistRows},
        withCredentials: true
    })
}



async function onFormSubmit(data: WhitelistRow[]) {
  // let buttonRes = await Swal.fire({
  //           title: "Are you sure you wish to delete this role?",
  //           text: "These changes are permanent",
  //           showCancelButton: true,
  //           confirmButtonColor: "#9d0d0d",
  //           cancelButtonColor: "#1939b7",
  //           background: "FFF",
  //           confirmButtonText: "SUBMIT",
  //       })
  //



    data = data.filter(row => {
        return row?.steamID;
    })


    const res = await axios({
        method: 'POST',
        url: "http://localhost:5000/api/profile/whitelist",
        withCredentials: true,
        data: data
    })

    if (res.status == 200 && res.data.success) {
        Swal.fire("Sucessfully installed IDs", "", "success")
    } else {
        // TODO add modal here
        console.log("Something went wrong when sending steamIDs")
    }
}


export type WhitelistResponseData = {
    isAuthenticated: boolean,
    validRoles: IPrivilegedRole[],
    whitelistSlots: number,
    whitelistActiveDays: number[],
    whitelistedSteam64IDs: {
        steamID:string
        name?: string,
    }[],
}


type WhitelistFormProps = {
    whitelist: WhitelistRow[]
    whitelistSlots: number,
}


type WhitelistRow = {
    steamID: string
    name?: string
}


const daysMap = new Map([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
])


export default Whitelist