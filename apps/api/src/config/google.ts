import { google } from "googleapis";
import { env } from "./env";

export const SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive.readonly",
];

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_SECRET_ID,
    env.GOOGLE_CALLBACK_API
  );
}

export const oauth2Client = createOAuth2Client();
