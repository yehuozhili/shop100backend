import mongoose ,{Schema,Document}from 'mongoose'


export interface SliderDocument  extends Document{
    url:string
}
const  SliderSchema = new Schema({
    url:String
},{timestamps:true,toJSON:{
    transform:function(_doc:any,result:any){
        result.id=result._id
        delete result._id
        delete result.createdAt
        delete result.updatedAt
        return result
    }
}})

export const Slider = mongoose.model('Slider',SliderSchema)