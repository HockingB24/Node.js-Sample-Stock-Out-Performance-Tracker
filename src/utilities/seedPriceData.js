import { ALL_TICKERS, DEFAULT_VOLATILITY_PERCENT } from './constants.js'

/**
 * Generates data for use by the data initialization process.
 * Randomly generates price data for 365 days (for simplicity, including weekends and holidays).
 * Outputs a map of lists. Key = Ticker Symbol, Val = List of {date, price}
 */
export const generateMockPriceSeriesData = (
    tickers = ALL_TICKERS,
    volatility = DEFAULT_VOLATILITY_PERCENT,
) => {
    if (!Array.isArray(tickers) || tickers.length == 0) {
        throw TypeError('tickers must be an array with length greater than 0')
    }
    if (
        typeof volatility !== 'number' ||
        volatility < 0 ||
        volatility > 100 ||
        !Number.isFinite(volatility)
    ) {
        throw TypeError('volatility must be a number between 0 and 100')
    }

    const priceMap = new Map()

    tickers.forEach((ticker) => {
        if (priceMap.has(ticker)) {
            return
        }

        const dayOnePrice = +(Math.random() * (300 - 10) + 10).toFixed(2)
        const dayOneDate = new Date()
        dayOneDate.setDate(dayOneDate.getDate() - 364)
        const dailyPrices = [{ price: dayOnePrice, date: dayOneDate }]

        for (let i = 1; i < 365; i++) {
            const date = new Date()
            const dailyReturn = (Math.random() * 2 - 1) * (volatility / 100)
            date.setDate(date.getDate() - (364 - i))
            const previousPrice = dailyPrices[i - 1].price
            dailyPrices[i] = {
                price: Number(Math.max(0.01, (previousPrice * (1 + dailyReturn)).toFixed(2))),
                date: date,
            }
        }

        priceMap.set(ticker, dailyPrices)
    })
    return priceMap
}
