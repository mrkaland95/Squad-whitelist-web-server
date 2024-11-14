import React, {useState} from 'react';
import {goToAuthenticate} from "./Discord-Auth";

const loginButtonID = "login-button"

function AuthenticateWithDiscordButton() {
    return (
        <div className='button-div'>
            <button className='default-button' onClick={goToAuthenticate} id={loginButtonID}>LOGIN WITH DISCORD</button>
        </div>
    )
}









//
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