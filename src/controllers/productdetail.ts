import { Request, Response, NextFunction } from "express";
import { ProductDetail, ProductDocument, Product } from "../models";
import { valideReturnUser } from "../utils/validator";




export const profileCollectDetail = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)
    if (user) {
        let res = await (await user.populate({ path: 'favorite', model: 'Product' }).execPopulate()).favorite.reverse()
        _res.json({
            success: true,
            data: res
        })
    } else {
        _res.json({
            success: false,
            data: null
        })
    }
}
export const profileHistoryDetail = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)
    if (user) {
        let res = await user.populate({ path: 'history.id', model: 'Product' }).execPopulate()
        const data = res.history.reverse()
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
}





export const productUserFavorite = async (_req: Request, _res: Response, _next: NextFunction) => {
    const user = await valideReturnUser(_req)

    const { id } = _req.body
    if (user) {
        let collect = user.favorite

        let checked = false
        if (collect.includes(id)) {
            collect.splice(collect.indexOf(id), 1)
        } else {
            collect.push(id)
            checked = true
        }
        await user.updateOne({ favorite: collect })
        _res.json({
            success: true,
            data: checked
        })
    } else {
        _res.json({
            success: false,
            data: false
        })
    }

}

export const productDetails = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { id } = _req.params
    let checked = false
    const user = await valideReturnUser(_req)
    if (user) {
        let his = user.history
        if (his.length > 100) {
            his.shift()
        }
        his.push({ id: id, date: new Date })
        await user.updateOne({ history: his })
        let collect = user.favorite
        if (collect.filter(item => item == id).length > 0) {
            checked = true
        }

    }


    if (id) {
        const query = { productId: id }
        const productDetail = await ProductDetail.findOne(query)
        _res.json({
            success: true,
            data: productDetail,
            checked
        })
    } else {
        _res.json({
            success: false,
            data: null,
        })
    }
}
export const productOneDetails = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { id } = _req.params
    if (id) {
        const productDetail = await Product.findById(id)
        _res.json({
            success: true,
            data: productDetail
        })
    } else {
        _res.json({
            success: false,
            data: null
        })
    }
}


export const initializeProductDetail = async () => {
    const productDetail = await ProductDetail.find()
    console.log(productDetail.length)
    if (productDetail.length == 0) {//初始13条数据
        const product = await Product.find().sort({ order: 1 })
        const sliderpic = [
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/1/1.jpeg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/1/2.jpeg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/2/1.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/3/1.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/4/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/4/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/4/3.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/4/4.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/5/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/5/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/5/3.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/5/4.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/3.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/3.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/3.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/3.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/3.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/4.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/3.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/4.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/3.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/1.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/2.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/3.jpg`]
        ]
        const texty = [
            'xxx', 'ddd', 'sss', 'fff', 'ssa', 'dasssssssss',
            'ijjjjjjjjjjjjjj',
            'kkkkkkkkkkkkkkkkkk',
            'llllllllllllllllllllll',
            'llllowwewewewewqqsadsadsadsad',
            'asdfnjjsiasojdoasjdasimndsai\nsdsadasdsasadsa\nsadsada',
            'sdaaaaaaaaasaweqeqwe', 'sdada'
        ]
        const footerpic = [
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/1/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/1/12.jpeg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/1/13.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/2/11.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/3/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/3/12.jpeg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/3/13.jpeg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/3/14.jpeg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/4/11.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/5/11.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/14.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/15.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/16.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/17.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/6/18.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/7/14.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/14.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/15.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/16.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/17.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/18.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/8/19.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/14.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/15.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/16.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/17.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/18.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/19.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/9/20.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/14.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/15.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/16.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/17.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/18.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/10/19.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/14.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/11/15.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/11.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/12.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/13.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/14.jpg`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/12/15.jpg`],
            [`${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/11.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/12.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/13.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/14.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/15.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/16.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/17.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/18.png`, `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/detail/13/19.png`]
        ]


        product.forEach((item: ProductDocument, index: number) => {
            let productId = item._id
            let doc = {
                sliderpic: sliderpic[index],
                texty: texty[index],
                footerpic: footerpic[index],
                productId: productId
            }
            ProductDetail.create(doc)
        })
    }


}