export function generateRandomString() {
    let randomString = '';
    const randomNumber = Math.floor(Math.random() * 10);

    for (let i = 0; i < 20 + randomNumber; i++) {
        randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
    }

    return randomString;
}

export const steamID64Regex  = /^7656119\d{10}$/;

/*
A week day corresponding to a number, particularly to inbuilt Javascript
Date.getDay() method.
 */
export enum WeekDays {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6
}


export const daysMap = new Map([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
])

export const daysMapShort = new Map([
    [0, 'Sun'],
    [1, 'Mon'],
    [2, 'Tues'],
    [3, 'Wed'],
    [4, 'Thur'],
    [5, 'Fri'],
    [6, 'Sat'],
])


export const modalBGColor = "#000"
export const cancelButtonColor = "#9d0d0d"
export const confirmButtonColor = "#1939b7"