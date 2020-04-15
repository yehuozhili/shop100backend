
import mongoose ,{Document, Schema,Model} from 'mongoose'

export interface ProductDocument extends Document{
    order:number;
    title: string;
    poster: string;
    url: string;
    price: number;
    category: string;
}
const ProductSchema: Schema<ProductDocument>=new Schema({
    order:Number,
    title: String,
    poster: String,
    url: String,
    price: Number,
    category: String,
},{
    timestamps:true,toJSON:{
        transform:function(_doc:any,result:any){
            result.id=result._id
            delete result._id
            delete result.createdAt
            delete result.updatedAt
            return result
        }
    }
})
export const Product:Model<ProductDocument> = mongoose.model('Product',ProductSchema)