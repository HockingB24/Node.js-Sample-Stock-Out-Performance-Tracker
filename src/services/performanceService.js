import { storage } from './storage.js'
import { getUniverseKey, UNIVERSE_TICKERS_TO_ID } from '../utilities/constants.js'
import { NotFoundError } from '../errors/NotFoundError.js'

export class PerformanceService {
    constructor(storage) {
        this.storage = storage
    }

    getStockOutperformanceSeriesByUniverseId(ticker, universeId) {
        return this.storage.getOutperformanceSeries(ticker, universeId)
    }

    getUniverseIdByUniverseTickers(universeTickers) {
        const universeKey = getUniverseKey(universeTickers)
        const universeId = UNIVERSE_TICKERS_TO_ID.get(universeKey)

        if (!universeId) {
            throw new NotFoundError('No matching universe found for provided tickers')
        }

        return universeId
    }

    getStockDailyReturnSeries(ticker) {
        return this.storage.getDailyReturnSeries(ticker)
    }

    getStockPriceSeries(ticker) {
        return this.storage.getPriceSeries(ticker)
    }
}

export default new PerformanceService(storage)
