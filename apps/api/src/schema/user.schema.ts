import z from "zod";

export const authSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    accessToken: z.string(),
    refreshToken: z.string(),
    tokenExpiry: z.string().optional()
})