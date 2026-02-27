import z from "zod";

export const agentSchema = z.object({
    task: z.string(),
    status: z.string()String   @default("running") // running | completed | failed
    plan     String?
    steps    Json?    // agent reasoning logs
    result   Json?    // final structured output
})