import app from '../../src/index'
import {Product} from '../../src/models/'
import chai ,{expect} from 'chai'

describe('controller/product/productDetails',()=>{
    it('normal situation',async ()=>{
        let res = await Product.find()
        expect(res.length).gte(1)

        let result = await chai.request(app)
            .get(`/products/detail/${res[0]._id}`)
            .set('Content-Type','application/json')
        expect(result).to.have.status(200)
        expect(result.body).to.have.property('success')
        expect(result.body).to.have.property('data')
        expect(result.body.data.length).not.equal(0)
        expect(result.body.success).to.equal(true)
    })
})
