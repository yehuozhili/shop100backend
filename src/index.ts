import express, { NextFunction, Response, Request } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import 'dotenv/config'
import path from 'path';
import errorMiddleware from './middlewares/errorMiddleware';
import HTTPException from './exceptions/HTTPException'
import { register, login, validate, uploadAvatar, avatarSubmit, addReceiveAddress, delReceiveAdress, splitupload, uploadMerge, verifyUpload, changeUsername } from './controllers/user'
import { sliderList, initialSlider } from './controllers/slider'
import multer from 'multer';
import https from 'https'
import { productList, initializeProduct, productSearch, productGetAllName, productGetArray } from './controllers/products'
import { productDetails, initializeProductDetail, productOneDetails, productUserFavorite, profileCollectDetail, profileHistoryDetail } from './controllers/productDetail'
import fs from 'fs-extra'
export const PUBLIC_UPLOAD_DIR = path.join(__dirname, 'public', 'images', 'uploads')
export const TEMP_DIR = path.resolve(__dirname, '../temp')
const storage = multer.diskStorage({
    destination: PUBLIC_UPLOAD_DIR,
    filename(_req: Request, file: Express.Multer.File, callback) {
        callback(null, Date.now() + Math.floor(Math.random() * 10 ** 6) + path.extname(file.originalname))
    }
})
const upload = multer({ storage })
const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(helmet())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (_req, res, _next) => {
    res.json({ success: true, data: 'xx' })
});
app.post('/user/register', register)
app.post('/user/login', login)
app.get('/user/validate', validate)
app.post('/user/uploadAvatar', upload.single('avatar'), uploadAvatar)
app.get('/verify/:filename', verifyUpload)
app.post('/user/changeUsername', changeUsername)
app.post('/user/splitupload/:filename/:chunk_name/:chunk_start', splitupload)
app.get('/user/merge/:filename', uploadMerge)
app.post('/user/avatarsubmit', avatarSubmit)
app.get('/user/getcollectdetail', profileCollectDetail)
app.get('/user/gethistorydetail', profileHistoryDetail)
app.get('/slider/list', sliderList)
app.get('/product/search', productSearch)
app.get('/product/getallname', productGetAllName)
app.post('/product/searcharray', productGetArray)
app.get('/products/list', productList)
app.get('/products/detail/:id', productDetails)
app.get('/products/:id', productOneDetails)
app.post('/productsfavourite', productUserFavorite)
app.post('/useraddadress', addReceiveAddress)
app.post('/userdeladress', delReceiveAdress)




app.use((_req: Request, _res: Response, next: NextFunction) => {
    const error: HTTPException = new HTTPException(404, '未分配路由')
    next(error)
})
app.use(errorMiddleware);

const options = {
    key: fs.readFileSync(path.resolve(__dirname, '../www.yehuozhili.xyz.key')),
    cert: fs.readFileSync(path.resolve(__dirname, '../www.yehuozhili.xyz.crt'))
};

(async function () {
    await mongoose.set('useNewUrlParser', true)
    await mongoose.set('useUnifiedTopology', true)
    const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost/tsbackend'
    await mongoose.connect(MONGODB_URL)
    await initialSlider();
    await initializeProduct();
    await initializeProductDetail()
    const PORT = process.env.PORT || 5000
    // app.listen(PORT, () => {
    //     console.log(`running on http://localhost:${PORT}`);
    // })
    https.createServer(options, app).listen(PORT, () => {
        console.log('https is working')
    })
})()
export default app