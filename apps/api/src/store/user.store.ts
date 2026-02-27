import { db, type User } from "@repo/database";

export type { User };

export interface UpsertUserParams {
  email: string;
  name?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
}

export async function upsertUser(params: UpsertUserParams) {
  const { email, name, accessToken, refreshToken, tokenExpiry } = params;

  return db.user.upsert({
    where: { email },
    create: {
      email,
      name,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken ?? null,
      tokenExpiry,
    },
    update: {
      name,
      googleAccessToken: accessToken,
      googleRefreshToken: refreshToken ?? undefined,
      tokenExpiry,
    },
  });
}

export async function findUserById(id: string) {
  return db.user.findUnique({ 
    where: { 
        id 
    } 
});
}

export async function updateTokens( userId: string, accessToken: string, refreshToken?: string | null, tokenExpiry?: number | null ) {
  const data: Record<string, unknown> = {
    googleAccessToken: accessToken,
  };
  if (refreshToken !== undefined) {
    data.googleRefreshToken = refreshToken;
  }
  if (tokenExpiry !== undefined) {
    data.tokenExpiry = tokenExpiry ? new Date(tokenExpiry) : null;
  }

  await db.user.update({
    where: { 
        id: userId 
    },
    data,
  });
}
