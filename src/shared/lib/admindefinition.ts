import {z} from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }).trim(),
  password: z.string().min(8, {message: "must be atleast 8 characters long"}).regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
});

export type loginSchemaType = z.infer<typeof loginSchema>;
