import DiscordAuthentication from "./Login";
import React from "react";

const textInlien = {

}

function Home() {
    return (
    <div className="home-container">

        <div ><p>
            <style>{`p { margin auto; } `}</style>
            TT Whitelist Management Website.
            You can log in here to manage and register steamIDs for whitelisting purposes.
        </p></div>

        <DiscordAuthentication></DiscordAuthentication>
    </div>
    )
}


export default Home