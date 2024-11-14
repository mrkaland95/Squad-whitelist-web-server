import {requestAccessToken} from "../routes/utils/utils";



async function testRequestAccessToken() {
    let redirectURI = `http://localhost:5000/api/login/`
    const dummyCode = "PxC84awrdYkuqxmDY1legCYIxkgSUN"
    const clientID = '1093586781703786526'
    const clientSecret = "9BSSFAv3CYHSdsap50yeClQLDd-Ye6MA"
    const result = await requestAccessToken(dummyCode, clientID, clientSecret, redirectURI)
    console.log(result)

}


testRequestAccessToken()
// (async () => {
//     await testRequestAccessToken()
// })