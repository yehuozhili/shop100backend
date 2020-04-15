import mongoose, { Schema, Model, Document } from 'mongoose'
import validator from 'validator'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export interface UserReveive {
    name: string;
    phoneNumber: string;
    distinct: string;
    distinctDetail: string;
    checked: boolean;
}

export interface UserDocument extends Document {
    username: string,
    password: string,
    avatar: string,
    email: string,
    favorite: Array<string>,
    history: Array<{ id: string, date: Date }>
    receive: Array<UserReveive>
    getToken: () => string,

}

const UserSchema: Schema<UserDocument> = new Schema({
    username: {
        type: String,
        required: [true, '用户名不为空'],
        minlength: [6, '最小长度不能小于6位'],
        maxlength: [12, '最大长度不得大于12位']
    },
    password: {
        type: String,
        required: [true, '密码不能为空'],
        minlength: [6, '最小长度不能小于6位'],
        maxlength: [12, '最大长度不得大于12位']
    },
    avatar: String,
    email: {
        type: String,
        required: [true, '密码不能为空'],
        validate: {
            validator: validator.isEmail
        },
        trim: true
    },
    favorite: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Product'
    },
    history: {
        type: [{ id: mongoose.SchemaTypes.ObjectId, date: Date }]
    },
    receive: {
        type: [{
            name: String,
            phoneNumber: String,
            distinct: String,
            distinctDetail: String,
            checked: Boolean
        }]
    }
}, {
    timestamps: true, toJSON: {
        transform: function (_doc: any, result: any) {
            result.id = result._id
            delete result._id
            delete result.__v
            delete result.password
            delete result.createdAt
            delete result.updatedAt
            return result
        }
    }
})

UserSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    try {
        this.password = await bcryptjs.hash(this.password, 10)
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.static('login', async function (this: any, email: string, password: string) {
    let user = await this.findOne({ email })
    if (user) {
        const match = await bcryptjs.compare(password, user.password)
        if (match) {
            return user
        } else {
            return null
        }
    } else {
        return null
    }
})

interface UserModel extends Model<UserDocument> {
    login: (email: string, password: string) => UserDocument | null
}

export interface UserPayload {
    id: string
}


UserSchema.methods.getToken = function (this: UserDocument) {
    let payload: UserPayload = { id: this._id }
    return jwt.sign(payload, process.env.JWT_SECRET_KEY || 'YEHUOZHILI', { expiresIn: '1h' })
}

export const User: UserModel = mongoose.model<UserDocument, UserModel>('User', UserSchema)


