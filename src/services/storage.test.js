import { storage } from './storage.js'

describe('storage', () => {
    it('stores and retrieves price data by ticker', () => {
        const priceData = [{ date: new Date('2024-01-01'), price: 100 }]
        storage.setPriceSeries('AAPL', priceData)
        expect(storage.getPriceSeries('AAPL')).toBe(priceData)
    })

    it('stores and retrieves daily series data by ticker', () => {
        const performanceData = [{ date: new Date('2024-01-01'), dailyReturn: 0.01 }]
        storage.setDailyReturnSeries('AAPL', performanceData)
        expect(storage.getDailyReturnSeries('AAPL')).toBe(performanceData)
    })

    it('stores and retrieves outperformance data by ticker and universeId', () => {
        const performanceData = [{ date: new Date('2024-01-01'), outperformancePercentage: 75 }]
        storage.setOutperformanceSeries('AAPL', '1', performanceData)
        expect(storage.getOutperformanceSeries('AAPL', '1')).toBe(performanceData)
    })

    it('keeps outperformance data separate across universes', () => {
        const universeOneData = [{ outperformancePercentage: 25 }]
        const universeTwoData = [{ outperformancePercentage: 75 }]

        storage.setOutperformanceSeries('AAPL', '1', universeOneData)
        storage.setOutperformanceSeries('AAPL', '2', universeTwoData)

        expect(storage.getOutperformanceSeries('AAPL', '1')).toBe(universeOneData)
        expect(storage.getOutperformanceSeries('AAPL', '2')).toBe(universeTwoData)
    })

    it('returns undefined for missing data', () => {
        expect(storage.getPriceSeries('MISSING')).toBeUndefined()
        expect(storage.getDailyReturnSeries('MISSING')).toBeUndefined()
        expect(storage.getOutperformanceSeries('MISSING', '1')).toBeUndefined()
    })
})
