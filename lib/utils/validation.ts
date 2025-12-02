import { z } from 'zod';

export const requestAccessSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
});

export type RequestAccessInput = z.infer<typeof requestAccessSchema>;

