import { z } from 'zod';

export const IdZod = z.number().int().positive();
