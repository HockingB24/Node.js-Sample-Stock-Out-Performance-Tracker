import express from 'express'
import {
    getStockDailyReturnSeries,
    getStockPriceSeries,
} from '../controllers/performanceController.js'

const router = express.Router()

router.get('/stocks/:ticker/returns', getStockDailyReturnSeries)

router.get('/stocks/:ticker/prices', getStockPriceSeries)

export default router
