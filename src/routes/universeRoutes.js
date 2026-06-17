import express from 'express'
import {
    getStockOutperformanceSeriesByUniverseTickers,
    getStockOutperformanceSeriesByUniverseId,
} from '../controllers/performanceController.js'

const router = express.Router()

router.get(
    '/universes/:universeId/stocks/:ticker/outperformance',
    getStockOutperformanceSeriesByUniverseId,
)

router.post('/outperformance', getStockOutperformanceSeriesByUniverseTickers)

export default router
