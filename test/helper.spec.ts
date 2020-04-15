import chai,{expect} from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import 'dotenv/config'
import { Done } from 'mocha'
import mongoose ,{Document}from 'mongoose'
describe('测试数据库功能',function(){
    let TestModel = mongoose.model('TestModel', new mongoose.Schema({a:Number}))
    before(async()=>{//会在所有单元测试前执行
        console.log(process.env.MONGODB_URL)
        await mongoose.set('useNewUrlParser',true)
        await mongoose.set('useUnifiedTopology',true)
        const MONGODB_URL =process.env.MONGODB_URL||'mongodb://localhost/tsbackend'
        await mongoose.connect(MONGODB_URL)
    })
    beforeEach(async()=>{//在每个单元测试前执行
    
    })
    it('初始化测试数据',async()=>{
        let res = await TestModel.find()
        if(res){
            let mapedRes = res.map((item:Document)=>{
                return item._id
            })
            await TestModel.deleteMany({_id:{$in:mapedRes}})
            let res2 = await TestModel.find()
            expect(res2).have.property('length').equal(0)
        }else{
            expect(res).have.property('length').equal(0)
        }
    })
    it('是否能写入',(done:Done)=>{
        TestModel.create({a:1},done)
    })
    it('可被重复写入',(done:Done)=>{
        TestModel.create({a:2},done)
    })
    it('可被删除',async()=>{
        let len = (await TestModel.find()).length
        await TestModel.deleteOne({a:2})
        let len2 =(await TestModel.find()).length
        expect(len-len2).equal(1)
    })
    afterEach(async ()=>{//每个单元测试之后执行
    
    })
    after(async ()=>{//在所有单元测试后执行
    
    })

})
