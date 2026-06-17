import { PerformanceService } from './performanceService.js'
import { jest } from '@jest/globals'

describe('PerformanceService', () => {
    it('gets outperformance series from storage', () => {
        const expected = [{ outperformancePercentage: 75 }]
        const fakeStorage = {
            getOutperformanceSeries: jest.fn(() => expected),
        }

        const service = new PerformanceService(fakeStorage)

        expect(service.getStockOutperformanceSeriesByUniverseId('AAPL', '1')).toBe(expected)
        expect(fakeStorage.getOutperformanceSeries).toHaveBeenCalledWith('AAPL', '1')
    })

    it('gets daily return series from storage', () => {
        const expected = [{ dailyReturn: 0.01 }]
        const fakeStorage = {
            getDailyReturnSeries: jest.fn(() => expected),
        }

        const service = new PerformanceService(fakeStorage)

        expect(service.getStockDailyReturnSeries('AAPL')).toBe(expected)
        expect(fakeStorage.getDailyReturnSeries).toHaveBeenCalledWith('AAPL')
    })

    it('gets price data from storage', () => {
        const expected = [{ price: 100 }]
        const fakeStorage = {
            getPriceSeries: jest.fn(() => expected),
        }

        const service = new PerformanceService(fakeStorage)

        expect(service.getStockPriceSeries('AAPL')).toBe(expected)
        expect(fakeStorage.getPriceSeries).toHaveBeenCalledWith('AAPL')
    })

    it('resolves universe id from case-insensitive ticker set', () => {
        const service = new PerformanceService({})

        const universeId = service.getUniverseIdByUniverseTickers([
            'msft',
            'AAPL',
            'GOOG',
            'AMZN',
            'NVDA',
            'TSLA',
            'META',
            'NFLX',
            'AMD',
            'INTC',
            'aapl',
        ])

        expect(universeId).toBe('1')
    })
})
