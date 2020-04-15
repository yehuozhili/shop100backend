import validator from 'validator'
import { UserDocument, UserPayload, User } from '../models'
import jwt from 'jsonwebtoken';
import { Request } from 'express';
export interface RegisterInput extends Partial<UserDocument> {
    confirm?: string
}
export interface RegisterResult {
    valid: boolean,
    errors: RegisterInput
}
export const validatorRegisterInput = (username: string, password: string,
    confirm: string, email: string) => {
    let errors: RegisterInput = {}
    if (username === undefined || username.length == 0) {
        errors.username = '用户名不能为空'
    }
    if (password === undefined || password.length == 0) {
        errors.password = '密码不能为空'
    }
    if (confirm === undefined || confirm.length == 0) {
        errors.confirm = '确认密码不能为空'
    }
    if (email === undefined || email.length == 0) {
        errors.email = '邮箱不能为空'
    }
    if (!validator.isEmail(email)) {
        errors.email = '邮箱不正确'
    }
    if (password.length > 12 || password.length < 6) {
        errors.password = '密码长度不符'
    }
    return { valid: Object.keys(errors).length == 0, errors }
}
export const validatorLoginInput = (email: string, password: string) => {
    let errors: RegisterInput = {}
    if (email === undefined || email.length == 0 || !validator.isEmail(email)) {
        errors.email = '邮箱不正确'
    }
    if (password === undefined || password.length > 12 || password.length < 6) {
        errors.password = '密码不正确'
    }

    return { valid: Object.keys(errors).length == 0, errors }
}

export const valideReturnUser = async (_req: Request) => {
    const authorization = _req.headers.authorization
    if (authorization) {
        try {
            const access_token = authorization.split(' ')[1]
            if (access_token) {
                const UserPayload: UserPayload = jwt.verify(access_token, process.env.JWT_SECRET_KEY || 'YEHUOZHILI') as UserPayload
                const user = await User.findById(UserPayload.id)
                return user
            }
        } catch (e) {
            return null
        }
    }
    return null
}
