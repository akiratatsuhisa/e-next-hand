import { DATABASE } from "@/constants";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(DATABASE.STRING_LENGTH.DEFAULT),
});
