import z from "zod";

export const driveSchema = z.object({
    driveFileId: z.string() ,  // Google Drive file ID
    name: z.string().min(1),
    mimeType: z.string().optional(),
})