import app from '../../src/index'
import {User} from '../../src/models/user'
import chai ,{expect} from 'chai'
import { UNPROCESSABLE_ENTITY, UNAUTHORIZED } from 'http-status-codes'

describe('controller/user/register',()=>{
    beforeEach(async()=>{//在每个单元测试前执行
        let res = await User.find({email:'444444@qq.com'})
        if(res){
            await User.remove({email:'444444@qq.com'})
            let info =await User.find({email:'444444@qq.com'})
            expect(info).have.property('length').equal(0)
        }
    })

    it('normal situation',async ()=>{
        let result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'444444',password:'444444',confirm:'44444',email:'444444@qq.com'})
        expect(result).to.have.status(200)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(true)
    })
    it('email none',async ()=>{
        let result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'444444',password:'444444',confirm:'444444',email:''})
        expect(result).to.have.status(UNPROCESSABLE_ENTITY)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
    it('confirm none',async ()=>{
        let result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'444444',password:'444444',confirm:'',email:'444444@qq.com'})
        expect(result).to.have.status(UNPROCESSABLE_ENTITY)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('errors')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
    it('password none',async ()=>{
        let result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'444444',password:'',confirm:'444444',email:'444444@qq.com'})
        expect(result).to.have.status(UNPROCESSABLE_ENTITY)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('errors')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
    it('password confirm none',async ()=>{
        let result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'444444',password:'',confirm:'',email:'444444@qq.com'})
        expect(result).to.have.status(UNPROCESSABLE_ENTITY)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('errors')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
    it('email duplicate',async ()=>{
        let result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'444444',password:'444444',confirm:'444444',email:'444444@qq.com'})
        expect(result).to.have.status(200)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(true)
        result = await chai.request(app)
            .post('/user/register')
            .set('Content-Type','application/json')
            .send({username:'44334444',password:'4444424',confirm:'4444424',email:'444444@qq.com'})
        expect(result).to.have.status(UNPROCESSABLE_ENTITY)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('errors')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
})
describe('controller/user/login',()=>{
    it('normal situation',async()=>{
        let res = await User.find({email:'444444@qq.com'})
        expect(res).to.have.property('length').equal(1)
        //上一个describe注册的用户未清除
        let result = await chai.request(app)
            .post('/user/login')
            .set('Content-Type','application/json')
            .send({password:'444444',email:'444444@qq.com'})
        expect(result).to.have.status(200)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(true)
    })
    it('password error',async()=>{
        let res = await User.find({email:'444444@qq.com'})
        expect(res).to.have.property('length').equal(1)
        let result = await chai.request(app)
            .post('/user/login')
            .set('Content-Type','application/json')
            .send({password:'44433444',email:'444444@qq.com'})
        expect(result).to.have.status(UNAUTHORIZED)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
    it('user not exist',async()=>{
        let res = await User.find({email:'4444441111wwwww1@qq.com'})
        expect(res).to.have.property('length').equal(0)
        let result = await chai.request(app)
            .post('/user/login')
            .set('Content-Type','application/json')
            .send({password:'44433444',email:'4444441111wwwww1@qq.com'})
        expect(result).to.have.status(UNAUTHORIZED)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.success).to.equal(false)
    })
})