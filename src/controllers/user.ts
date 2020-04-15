import { NextFunction, Response, Request } from 'express'
import { User } from '../models'
import { validatorRegisterInput, validatorLoginInput, valideReturnUser } from '../utils/validator'
import HTTPException from '../exceptions/HTTPException';
import { UNPROCESSABLE_ENTITY, UNAUTHORIZED, INTERNAL_SERVER_ERROR, UNSUPPORTED_MEDIA_TYPE } from 'http-status-codes';
import { UserPayload } from '../models/user'
import jwt from 'jsonwebtoken';
import fs, { WriteStream } from 'fs-extra'
import { PUBLIC_UPLOAD_DIR, TEMP_DIR } from '../index';
import path from 'path'




export const register = async (req: Request, res: Response, _next: NextFunction) => {
    let { username, password, confirm, email } = req.body;
    let { valid, errors } = validatorRegisterInput(username, password, confirm, email)
    try {
        if (!valid) {
            throw new HTTPException(UNPROCESSABLE_ENTITY, '用户提交数据不正确', errors)
        }
        let olduser = await User.findOne({ email })
        if (olduser) {
            throw new HTTPException(UNPROCESSABLE_ENTITY, '邮箱已注册', errors)
        }
        let user = new User({ username, password, email })

        await user.save()
        res.json({
            success: true,
            data: user
        })
    } catch (error) {
        _next(error)
    }

}
export const login = async (req: Request, res: Response, _next: NextFunction) => {
    let { email, password } = req.body;
    try {
        let { valid } = validatorLoginInput(email, password);
        if (!valid) {
            throw new HTTPException(UNAUTHORIZED, '登录失败')
        }
        let user = await User.login(email, password)
        if (!user) {
            throw new HTTPException(UNAUTHORIZED, '登录失败')
        } else {
            let access_token = await user.getToken()
            res.json({
                success: true,
                data: access_token
            })
        }
    } catch (error) {
        _next(error)
    }
}
export const validate = async (req: Request, res: Response, _next: NextFunction) => {
    const authorization = req.headers.authorization
    if (authorization) {
        try {
            const access_token = authorization.split(' ')[1]
            if (access_token) {
                const UserPayload: UserPayload = jwt.verify(access_token, process.env.JWT_SECRET_KEY || 'YEHUOZHILI') as UserPayload
                const user = await User.findById(UserPayload.id)
                if (user) {
                    res.json({
                        success: true,
                        data: user.toJSON()
                    })
                } else {
                    _next(new HTTPException(UNAUTHORIZED, 'access_token无效'))
                }
            } else {
                _next(new HTTPException(UNAUTHORIZED, 'access_token无效'))
            }
        } catch (error) {
            _next(new HTTPException(UNAUTHORIZED, 'access_token无效'))
        }
    } else {
        _next(new HTTPException(UNAUTHORIZED, 'authorization未提供'))
    }
}
export const uploadAvatar = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)
    if (user) {
        try {
            if (_req.file.size / 1024 / 1024 > 2) {
                throw (new HTTPException(UNPROCESSABLE_ENTITY, '图片大于2m'))
            }
            if (_req.file.mimetype === 'image/jpeg' || _req.file.mimetype === 'image/png') {
                let avatar = `${_req.protocol}://${_req.headers.host}/images/uploads/${_req.file.filename}`;
                await user.updateOne({ avatar })
                _res.json({
                    success: true,
                    data: avatar
                })
            } else {
                throw (new HTTPException(UNSUPPORTED_MEDIA_TYPE, '格式不对'))
            }

        } catch (error) {
            _next(error)
        }
    } else {
        _next(new HTTPException(UNAUTHORIZED, '未登录'))
    }

}
export const avatarSubmit = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { username, responseUrl, id } = _req.body
    try {
        if (!id) {
            throw new HTTPException(UNAUTHORIZED, '未登录')
        } else {
            const user = await User.findById(id)
            if (user) {
                if (username && username !== user.username) {
                    let result = await user.updateOne({ username })
                    if (!result.ok) {
                        throw new HTTPException(INTERNAL_SERVER_ERROR, '修改失败')
                    }
                }
                if (responseUrl) {
                    let result = await user.updateOne({ avatar: responseUrl })
                    if (!result.ok) {
                        throw new HTTPException(INTERNAL_SERVER_ERROR, '修改失败')
                    }
                }
                _res.json({
                    success: true,
                    data: null
                })
            } else {
                throw new HTTPException(UNAUTHORIZED, '用户非法')
            }
        }
    } catch (error) {
        _next(error)
    }
}


function validateAddress(data: any) {
    const { name, phoneNumber, distinct, distinctDetail, checked } = data;
    if (name && phoneNumber && distinct && distinctDetail && (checked === false)) {
        return true
    }
    return false
}



export const addReceiveAddress = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)
    if (user) {
        try {
            const data = _req.body
            if (validateAddress(data)) {
                let res = user.receive
                if (res) {
                    res.push(data)
                } else {
                    res = [data]
                }
                await user.updateOne({ receive: res })
                _res.json({
                    success: true,
                    data: user.receive
                })
            } else {
                throw new HTTPException(UNPROCESSABLE_ENTITY, '提交错误')
            }
        } catch (e) {
            _next(e)
        }
    } else {
        _res.json({
            success: false,
            data: null
        })
    }
}
export const delReceiveAdress = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)
    if (user) {
        try {
            const data = _req.body
            if (data instanceof Array) {
                await user.updateOne({ receive: data })
                _res.json({
                    success: true,
                    data: data
                })
            } else {
                _res.json({
                    success: false,
                    data: null
                })
            }
        } catch (e) {
            _res.json({
                success: false,
                data: null
            })
        }
    } else {
        _res.json({
            success: false,
            data: null
        })
    }
}

export const changeUsername = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)
    if (user) {
        console.log(user)
        const { username } = _req.body
        await user.updateOne({ username: username })
        _res.json({
            success: true,
            data: username
        })
    } else {
        _res.json({
            success: false,
            data: null
        })
    }
}


export const verifyUpload = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { filename } = _req.params
    const filePath = path.resolve(PUBLIC_UPLOAD_DIR, filename)
    const existFile = await fs.pathExists(filePath)
    if (existFile) {
        _res.json(
            {
                success: true,
                needUpload: false
            }
        )
    } else {
        let uploadList: Array<any> = []
        const hashDir = path.resolve(TEMP_DIR, filename)
        const existDir = await fs.pathExists(hashDir)
        if (existDir) {//说明有未完成的
            uploadList = await fs.readdir(hashDir)
            uploadList = await Promise.all(uploadList.map(async (chunkName: string) => {
                let stat = await fs.stat(path.resolve(hashDir, chunkName))
                return {
                    chunkName,
                    size: stat.size
                }
            }))
        }
        _res.json({
            success: true,
            needUpload: true,
            uploadList
        })
    }
}



export const splitupload = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { filename, chunk_name, chunk_start } = _req.params
    const start: number = Number(chunk_start)
    const file_dir = path.resolve(TEMP_DIR, filename)
    const exist = await fs.pathExists(file_dir)
    if (!exist) {
        await fs.mkdirs(file_dir)
    }
    const chunkPath = path.resolve(file_dir, chunk_name)
    let ws = fs.createWriteStream(chunkPath, { flags: 'a', start })//可追加状态
    _req.on('end', () => {
        ws.close()
        _res.json({ success: true })
    })
    _req.on('error', () => {
        ws.close()
        _res.end()
    })
    _req.on('close', async () => {
        ws.close()
        if (!_req.complete) {//说明异常退出，写入的数据不完整，必须删了
            await fs.unlink(chunkPath)
        }
        _res.end()
    })
    _req.pipe(ws)
}

export const uploadMerge = async (_req: Request, _res: Response, _next: NextFunction) => {
    let { filename } = _req.params;
    await mergeChunks(filename)
    _res.json({
        success: true
    })
}

const pipeStream = (filePath: string, ws: WriteStream) => (new Promise((resolve, reject) => {
    let rs = fs.createReadStream(filePath)
    rs.on('end', async () => {
        await fs.unlink(filePath)
        resolve()
    })
    rs.on('error', (e) => {
        reject(e)
    })
    rs.pipe(ws)
}))

const mergeChunks = async (filename: string, size: number = 1024 * 1024) => {//size是和前端约定的分片大小
    const filePath = path.resolve(PUBLIC_UPLOAD_DIR, filename)//目标路径
    const chunkDir = path.resolve(TEMP_DIR, filename)//temp下以文件名为路径的目录
    const exist = await fs.pathExists(chunkDir)
    if (exist) {
        let chunkFiles = await fs.readdir(chunkDir)//查找分片文件
        chunkFiles.sort((a, b) => Number(a.split('-')[1]) - Number(b.split('-')[1]))//以后缀排序
        await Promise.all(chunkFiles.map((item: string, index: number) => {
            console.log(index, item)
            return (//可写流起始位就是索引*分片，最后合起来是整个文件
                pipeStream(path.resolve(chunkDir, item), fs.createWriteStream(filePath, { start: index * size }))
            )
        }))
        await fs.rmdir(chunkDir)
    }
}
