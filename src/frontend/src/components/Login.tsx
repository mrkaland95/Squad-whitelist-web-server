import React, {useState} from 'react';
import {generateRandomString} from "../utils/utils";
import {useAuth} from "./AuthProvider";

const loginButtonID = "login-button"

function AuthenticateWithDiscordButton() {
    return (
        <div className='button-div'>
            <button className='default-button' onClick={redirectToDiscordAuth} id={loginButtonID}>LOGIN WITH DISCORD</button>
        </div>
    )
}


export function redirectToDiscordAuth() {
    const randomString: string = generateRandomString()
    localStorage.setItem('oauth-string', randomString)

    // TODO remove this hardcode and take it in as an .env
    window.location.href = process.env.DISCORD_REDIRECT_URI || "https://discord.com/oauth2/authorize?client_id=1093586781703786526&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Fv1%2Fauth%2Flogin&scope=identify";
}


export function LoggedIn() {

}



export function HandleLogout() {

}


// window.onload = () => {
//     const fragment = new URLSearchParams(window.location.hash.slice(1));
//     const [accessToken, tokenType, state] = [fragment.get('access_token'), fragment.get('token_type'), fragment.get('state')];
//
//     if (!accessToken) {
//         const randomString = generateRandomString();
//         localStorage.setItem('oauth-state', randomString);
//
//         document.getElementById('login').href += `&state=${encodeURIComponent(btoa(randomString))}`;
//         return document.getElementById('login').style.display = 'block';
//     }
//
//     if (localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
//         return console.log('You may have been click-jacked!');
//     }
// }


export default AuthenticateWithDiscordButton