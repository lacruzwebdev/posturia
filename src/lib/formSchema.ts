import { z } from "zod"

export const schema = z.object({
  prompt: z.string().trim().min(10).max(160),
})
