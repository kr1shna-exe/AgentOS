import type { Request, Response } from "express";
import { oauth2Client, SCOPES } from "../config/google";
import { google } from "googleapis";
import { env } from "../config/env";
import { db } from "@repo/database";
import { signToken } from "../middleware/auth.middleware";

const FRONTEND_URL =
  env.NEXT_PUBLIC_APP_URL ?? env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
    });

    res.redirect(authUrl);
  } catch (error) {
    console.error("Google Auth URL generation error:", error);

    res.status(500).json({
        success: false,
        message: null,
        error: "FAILED_TO_AUTHENTICATE_USER", 
    })
    return;
  }
};

export const googleCallback = async (req: Request, res: Response )  => {
    try {
      const code = req.query.code as string | undefined;

        if (!code) {
            res.status(400).json({
                success: false,
                message: null,
                error: "AUTHORIZATION_CODE_MISSING",
            })
            return;
        }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      res.status(400).json({ 
        success: false,
        message: null,
        error: "Unable to retrieve user email from Google" 
    })
    return;
    }

    const user = await db.user.upsert({
      where: { email: userInfo.email },
      create: {
        email: userInfo.email,
        name: userInfo.name ?? undefined,
        googleAccessToken: tokens.access_token!,
        googleRefreshToken: tokens.refresh_token ?? undefined,
        tokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
      },
      update: {
        name: userInfo.name ?? undefined,
        googleAccessToken: tokens.access_token!,
        googleRefreshToken: tokens.refresh_token ?? undefined,
        tokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : undefined,
      },
    });

    const sessionToken = signToken(user.id, user.email);

    res.redirect(
      `${FRONTEND_URL}/auth/callback?token=${sessionToken}`
    );

  } catch (error) {
    console.error("Google OAuth callback error:", error);

    res.status(500).json({
        success: false,
        message: null,
        error: "INTERNAL_SERVER_ERROR" 
    })
    return;
  }
};