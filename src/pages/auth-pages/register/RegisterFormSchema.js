import * as z from 'zod'

export const RegisterFormObject = z.object({
    name: z.string()
        .nonempty({ message: 'Tên không được để trống.' })
        .min(8, { message: 'Tên hiển thị không được ít hơn 8 ký tự.' })
        .max(30, { message: 'Tên hiển thị không được vượt quá 30 ký tự.' }),
    username: z
        .string()
        .nonempty({ message: "Tài khoản không được để trống." })
        .min(8, { message: 'Tài khoản không được ít hơn 8 ký tự.' })
        .max(30, { message: 'Tài khoản không được vượt quá 30 ký tự.' }),
    password: z
        .string()
        .nonempty({ message: "Mật khẩu không được để trống." })
        .min(8, { message: 'Mật khẩu không được ít hơn 8 ký tự.' })
        .max(40, { message: 'Mật khẩu không được vượt quá 40 ký tự' })
        .regex(/[a-z]/, { message: "Mật khẩu phải chứa ít nhất một chữ cái viết thường" })
        .regex(/[A-Z]/, { message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa" })
        .regex(/[0-9]/, { message: "Mật khẩu phải chứa ít nhất một chữ số" })
        .regex(/[^a-zA-Z0-9]/, { message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (ví dụ: @, $, !, ...)" }),
    confirmPassword: z
        .string()
        .nonempty({ message: "Mật khẩu không được để trống." })
        .min(8, { message: 'Mật khẩu không được ít hơn 8 ký tự.' })
        .max(40, { message: 'Mật khẩu không được vượt quá 40 ký tự' }),
}).refine((value) => value.confirmPassword === value.password,
    {
        message: 'Mật khẩu xác nhận không khớp.',
        path: ["confirmPassword"]
    }
)