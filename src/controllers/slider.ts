import { Response, Request, NextFunction } from "express";
import { Slider } from "../models/slider";




export const sliderList = async (_req: Request, res: Response, _next: NextFunction) => {
    let sliders = await Slider.find()
    res.json({
        success: true,
        data: sliders
    })
}
export const initialSlider = async () => {
    const sliders = await Slider.find()
    if (sliders.length == 0) {
        const sliders = [
            { url: `${process.env.PROTOCOL}://${process.env.IP || 'localhost'}:${process.env.PORT || 5000}/sliders/1.jpg` },
            { url: `${process.env.PROTOCOL}://${process.env.IP || 'localhost'}:${process.env.PORT || 5000}/sliders/2.jpg` },
            { url: `${process.env.PROTOCOL}://${process.env.IP || 'localhost'}:${process.env.PORT || 5000}/sliders/3.jpg` },
            { url: `${process.env.PROTOCOL}://${process.env.IP || 'localhost'}:${process.env.PORT || 5000}/sliders/4.jpg` },
            { url: `${process.env.PROTOCOL}://${process.env.IP || 'localhost'}:${process.env.PORT || 5000}/sliders/5.jpg` },
        ]
        await Slider.create(sliders)

    }
}