import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {generateRandomString} from "../utils/utils";


const accessTokenName = 'access_token'



function DiscordAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get(accessTokenName);
        const state = fragment.get('state');

        if (accessToken) {
            const storedState = localStorage.getItem('oauth-state');
            const decodedState = atob(decodeURIComponent(state || ''));

            if (storedState === decodedState) {
                localStorage.setItem(accessTokenName, accessToken)
                setIsLoggedIn(true)
            } else {
                console.warn('Potential click-jacking attack detected!');
            }
        }

        if (localStorage.getItem(accessTokenName)) {
            setIsLoggedIn(true)
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/profile');
        }
    }, [isLoggedIn, navigate])

}



export function goToAuthenticate() {
    const randomString: string = generateRandomString()
    localStorage.setItem('oauth-state', randomString)

    // TODO remove this hardcode and take it in as an .env
    const redirectURI = process.env.DISCORD_REDIRECT_URI || "https://discord.com/oauth2/authorize?client_id=1093586781703786526&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fapi%2Flogin%2F&scope=identify"

    window.location.href = redirectURI;
}


export default DiscordAuth