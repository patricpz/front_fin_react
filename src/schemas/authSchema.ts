import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
