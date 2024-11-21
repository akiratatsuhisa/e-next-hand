import { DATABASE } from "@/constants";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
});

export const registerSchema = z.object({
  email: z.string().email().max(DATABASE.STRING_LENGTH.MEDIUM),
  name: z
    .string()
    .regex(/^(?!.*[._]{2})[a-zA-Z0-9](?!.*[._]$)[a-zA-Z0-9._]*[a-zA-Z0-9]$/)
    .min(3)
    .max(DATABASE.STRING_LENGTH.MEDIUM),
});
