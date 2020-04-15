import { Request, Response, NextFunction } from "express";
import { Product, ProductDocument } from "../models";




export const productList = async (_req: Request, _res: Response, _next: NextFunction) => {
    let { currentCategory = 'all', offset, limit } = _req.query
    offset = isNaN(offset) ? 0 : Number(offset)
    limit = isNaN(limit) ? 5 : Number(limit)
    let query: Partial<ProductDocument> = {}
    if (currentCategory && currentCategory != 'all') {
        query.category = currentCategory
    }
    let total: number = await Product.countDocuments(query)
    const product = await Product.find(query).sort({ order: 1 }).skip(offset).limit(limit)
    _res.json({
        success: true,
        data: {
            product,
            more: total > offset + limit
        },
    })
}
export const initializeProduct = async () => {
    const productlist = await Product.find()
    if (productlist.length == 0) {
        const product = [
            {
                order: 1,
                title: '益生君',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/1.jpg`,
                price: 999,
                category: '益生君'
            },
            {
                order: 2,
                title: '101轻体日记乐享套装',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/2.jpg`,
                price: 999,
                category: '101轻体日记'
            },
            {
                order: 3,
                title: '101轻体日记芸享套装',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/3.jpg`,
                price: 999,
                category: '101轻体日记'
            },
            {
                order: 4,
                title: '天天艾',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/4.jpg`,
                price: 999,
                category: '天天艾'
            },
            {
                order: 5,
                title: '暖暖灸',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/5.jpg`,
                price: 999,
                category: '暖暖灸'
            },
            {
                order: 6,
                title: '小花样经典款玫瑰',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/6.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 7,
                title: '小花样经典款橙花',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/7.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 8,
                title: '小花样经典款混合',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/8.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 9,
                title: '小花样爱恋款混合',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/9.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 10,
                title: '小花样40度桂花酒',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/10.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 11,
                title: '小花样50度桂花酒',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/11.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 12,
                title: '小花样玫瑰酿',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/12.jpg`,
                price: 999,
                category: '小花样'
            },
            {
                order: 13,
                title: '小花样桂花酿',
                poster: `${process.env.PROTOCOL}://${process.env.IP}:${process.env.PORT || 5000}/products/13.jpg`,
                price: 999,
                category: '小花样'
            },
        ]
        await Product.create(product)
    }
}
export const productSearch = async (_req: Request, _res: Response, _next: NextFunction) => {
    const { query } = _req.query
    const data = await Product.find({ 'title': { $regex: query } })
    _res.json({
        success: true,
        data: data
    })
}
export const productGetAllName = async (_req: Request, _res: Response, _next: NextFunction) => {
    const data = await Product.find({}, { 'title': 1, '_id': 0 })
    const dataArr = data.map((item) => {
        return item.title
    })
    _res.json({
        success: true,
        data: dataArr
    })
}
export const productGetArray = async (_req: Request, _res: Response, _next: NextFunction) => {
    const data = _req.body
    if (data.lis instanceof Array) {
        let dataArr: Array<ProductDocument[]> = data.lis.map((item: string) => {
            return Product.find({ 'title': item })
        })
        let fi = await Promise.all(dataArr)
        let ff: ProductDocument[] = Array.prototype.concat.apply({}, fi)

        ff = ff.filter((item) => (JSON.stringify(item) !== '{}'))
        let liss = ff.map((item) => (item._id + ''))
        liss.forEach((item, index, array) => {
            if (array.indexOf(item) !== index) {
                ff.splice(index, 1)
            }
        })
        _res.json({
            success: true,
            data: ff
        })
    } else {
        _res.json({
            success: true,
            data: []
        })
    }
}