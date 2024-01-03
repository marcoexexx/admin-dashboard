import axios from 'axios'
import qs from 'qs'
import getConfig from '../utils/getConfig'
import logging from '../middleware/logging/logging'


interface GoogleOAuthToken {
  access_token: string
  id_token: string
  expires_in: number
  refresh_token: string
  token_type: string
  scope: string
}

interface GoogleUserResult {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  locale: string
}


export async function getGoogleAuthToken(code: string): Promise<GoogleOAuthToken> {
  const rootUrl = "https://oauth2.googleapis.com/token"
  const { clientID, clientSecret, redirect } = getConfig("googleOAuth")

  const options = {
    code,
    client_id: clientID,
    client_secret: clientSecret,
    redirect_uri: redirect,
    grant_type: "authorization_code",
  }

  try {
    const { data } = await axios.post<GoogleOAuthToken>(rootUrl, qs.stringify(options), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    return data
  } catch (err: any) {
    logging.error(`Failed to fetch Google Oauth Tokens: ${err.message}`);
    throw new Error(err);
  }
}


export async function getGoogleUser(args: Pick<GoogleOAuthToken, "access_token" | "id_token">): Promise<GoogleUserResult> {
  const { id_token, access_token } = args

  try {
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    const { data } = await axios.get<GoogleUserResult>(url, {
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })

    return data
  } catch (err: any) {
    logging.error("Failed to fetch Google Oauth Tokens");
    throw new Error(err);
  }
}
