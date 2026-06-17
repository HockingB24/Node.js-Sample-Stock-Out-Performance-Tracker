import { generateMockPriceSeriesData } from '../../utilities/seedPriceData.js'
import { calculateDailyReturnSeries } from './calculateDailyReturnSeries.js'
import { storage } from '../storage.js'
import { ALL_TICKERS, UNIVERSE_ID_TO_TICKERS } from '../../utilities/constants.js'
import { calculateOutperformancePercentage } from './calculateOutperformance.js'

export const initializeData = () => {
    storage.clear()
    const priceSeriesByTicker = generateMockPriceSeriesData()

    storePriceData(priceSeriesByTicker)
    storeDailyReturnData(priceSeriesByTicker)
    storeOutperformanceData()
}

const storePriceData = (priceSeriesByTicker) => {
    for (const [ticker, priceSeries] of priceSeriesByTicker.entries()) {
        storage.setPriceSeries(ticker, priceSeries)
    }
}

const storeDailyReturnData = (priceSeriesByTicker) => {
    for (const [ticker, priceSeries] of priceSeriesByTicker.entries()) {
        const prices = priceSeries.map((p) => p.price)
        const dailyReturns = calculateDailyReturnSeries(prices)

        const performanceSeries = priceSeries.map((point, i) => ({
            date: point.date,
            dailyReturn: dailyReturns[i],
        }))

        storage.setDailyReturnSeries(ticker, performanceSeries)
    }
}

const storeOutperformanceData = () => {
    for (const [universeId, universeTickers] of UNIVERSE_ID_TO_TICKERS) {
        const universeDailyReturnsByTicker = buildUniverseDailyReturnsByTicker(universeTickers)

        for (const comparisonTicker of ALL_TICKERS) {
            storeTickerOutperformance(comparisonTicker, universeId, universeDailyReturnsByTicker)
        }
    }
}

const buildUniverseDailyReturnsByTicker = (universeTickers) => {
    const returnsByTicker = new Map()

    for (const ticker of universeTickers) {
        const performanceSeries = storage.getDailyReturnSeries(ticker)

        returnsByTicker.set(
            ticker,
            new Map(performanceSeries.map((point) => [getDateKey(point.date), point.dailyReturn])),
        )
    }

    return returnsByTicker
}

const storeTickerOutperformance = (comparisonTicker, universeId, universeDailyReturnsByTicker) => {
    const comparisonPerformanceSeries = storage.getDailyReturnSeries(comparisonTicker)

    const peerDailyReturnsByDate = [...universeDailyReturnsByTicker.entries()].filter(
        ([ticker]) => ticker !== comparisonTicker,
    )

    const outperformanceSeries = comparisonPerformanceSeries.map((point) => {
        const dateKey = getDateKey(point.date)

        const peerReturnsForDate = peerDailyReturnsByDate.map(([ticker, returnsByDate]) => {
            const peerReturn = returnsByDate.get(dateKey)

            if (peerReturn === undefined) {
                throw new Error(`Missing daily return for ${ticker} on ${dateKey}`)
            }

            return peerReturn
        })

        return {
            date: point.date,
            outperformancePercentage: calculateOutperformancePercentage(
                point.dailyReturn,
                peerReturnsForDate,
            ),
        }
    })

    storage.setOutperformanceSeries(comparisonTicker, universeId, outperformanceSeries)
}

const getDateKey = (date) => date.toISOString().slice(0, 10)
