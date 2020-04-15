
import mongoose, { Document, Schema } from 'mongoose'

export interface ProductDetailDocument extends Document {
    sliderpic: Array<string>,
    texty: string,
    footerpic: Array<string>,
    productId: string
}
const ProductDetailSchema: Schema<ProductDetailDocument> = new Schema({
    sliderpic: Array,
    texty: String,
    footerpic: Array,
    productId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' }
}, {
    timestamps: true, toJSON: {
        transform: function (_doc: any, result: any) {
            result.id = result._id
            delete result.__v
            delete result._id
            delete result.createdAt
            delete result.updatedAt
            return result
        }
    }
})
export const ProductDetail = mongoose.model('ProductDetail', ProductDetailSchema)