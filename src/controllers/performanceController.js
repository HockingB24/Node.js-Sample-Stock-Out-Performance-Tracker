import performanceService from '../services/performanceService.js'
import { NotFoundError } from '../errors/NotFoundError.js'
import { HttpError } from '../errors/HttpError.js'

export function getStockOutperformanceSeriesByUniverseTickers(req, res, next) {
    const { comparisonTicker, universe } = req.body

    if (!comparisonTicker || !Array.isArray(universe) || universe.length === 0) {
        return next(new HttpError(400, 'comparisonTicker and universe are required'))
    }

    if (typeof comparisonTicker !== 'string') {
        return next(new HttpError(400, 'comparisonTicker must be a string'))
    }

    if (universe.some((ticker) => typeof ticker !== 'string')) {
        return next(new HttpError(400, 'universe must be an array of strings'))
    }

    const normalizedTicker = comparisonTicker.toUpperCase()
    const universeId = performanceService.getUniverseIdByUniverseTickers(universe)

    const result = performanceService.getStockOutperformanceSeriesByUniverseId(
        normalizedTicker,
        universeId,
    )

    if (!result) {
        return next(
            new NotFoundError(
                `Outperformance data not found for ticker ${normalizedTicker} in universe ${universeId}`,
            ),
        )
    }

    res.status(200).json({
        universeId,
        ticker: normalizedTicker,
        data: result,
    })
}

export function getStockOutperformanceSeriesByUniverseId(req, res, next) {
    const { ticker, universeId } = req.params
    const normalizedTicker = ticker.toUpperCase()

    const result = performanceService.getStockOutperformanceSeriesByUniverseId(
        normalizedTicker,
        universeId,
    )

    if (!result) {
        return next(
            new NotFoundError(
                `Outperformance data not found for ticker ${normalizedTicker} in universe ${universeId}`,
            ),
        )
    }

    res.status(200).json(result)
}

export function getStockDailyReturnSeries(req, res, next) {
    const { ticker } = req.params
    const normalizedTicker = ticker.toUpperCase()

    const result = performanceService.getStockDailyReturnSeries(normalizedTicker)

    if (!result) {
        return next(new NotFoundError(`Daily return data not found for ticker ${normalizedTicker}`))
    }

    res.status(200).json(result)
}

export function getStockPriceSeries(req, res, next) {
    const { ticker } = req.params
    const normalizedTicker = ticker.toUpperCase()

    const result = performanceService.getStockPriceSeries(normalizedTicker)

    if (!result) {
        return next(new NotFoundError(`Price data not found for ticker ${normalizedTicker}`))
    }

    res.status(200).json(result)
}
