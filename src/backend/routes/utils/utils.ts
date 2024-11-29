import {NextFunction, Response, Request} from "express";
import {defaultLogger, Logger} from "../../logger";





/**
 * Requests an access token on behalf of a user,
 * uses the authorization code flow.
 * @param code {string}
 * @param client_id {string}
 * @param client_secret {string}
 * @param redirect_URI {string}
 */
export async function requestAccessToken(code: string, client_id: string, client_secret: string, redirect_URI: string): Promise<accessTokenRequestData> {

    const body = new URLSearchParams({
        client_id: client_id,
        client_secret: client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirect_URI,
        scope: 'identify'
    })

    const oAuthParams = {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }

    const oAuthResponse = await fetch('https://discord.com/api/oauth2/token', oAuthParams);
    const oAuthResponseJSON = await oAuthResponse.json()

    // if (oAuthResponseJSON.status !== 200) {}

    return {
        statusCode: oAuthResponse.status,
        body: oAuthResponseJSON
    }
}

export async function requestDiscordUserData(accessTokenData: accessTokenRequestSuccess) {
    const userResponse =
        await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${accessTokenData.token_type} ${accessTokenData.access_token}`,
            },
        });

    if (userResponse.status !== 200) {
        console.log(userResponse.body)
        throw Error('Error retrieving users data')
    } else {
        return userResponse.json()
    }
}


/**
 * Refreshes a discord access token.
 * @param refreshToken
 * @param clientID
 * @param clientSecret
 */
export async function refreshAccessToken(refreshToken: string, clientID: string, clientSecret: string) {
    const grantType = "refresh_token"
    const tokenURL = 'https://discord.com/api/oauth2/token'

    const requestBody = new URLSearchParams({
        grant_type: grantType,
        refresh_token: refreshToken,
        client_id: clientID,
        client_secret: clientSecret
    })

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    const params = {
        method: 'POST',
        body: requestBody,
        headers: headers
    }

    const result = await fetch(tokenURL, params)
    console.log(result)


}


export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.session?.discordUser) {
        defaultLogger.debug(`Recieved request from unauthenticated user...`)
        defaultLogger.debug(`Session data: `, req?.session)
        res.status(401).send('Unauthenticated user')
        return
    }

    next()
}


export interface accessTokenRequestData {
    statusCode: number
    body: accessTokenRequestSuccess
        | accessTokenRequestFail
        | any
}

export type accessTokenRequestSuccess = {
    token_type: string,
    access_token: string,
    expires_in: number,
    refresh_token: string,
    scope: string
}

export type accessTokenRequestFail = {
    error: string,
    error_description: string
}