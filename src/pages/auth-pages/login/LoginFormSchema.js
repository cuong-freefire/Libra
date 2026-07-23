import * as z from 'zod'

export const LoginFormObject = z.object({
    username: z
        .string()
        .nonempty({ message: "Tài khoản không được để trống." })
        .max(30, { message: 'Tài khoản không được vượt quá 30 ký tự.' }),
    password: z
        .string()
        .nonempty({ message: "Mật khẩu không được để trống." })
        .max(40, { message: 'Mật khẩu không được vượt quá 40 ký tự' })
})