import { initializeData } from './initializeData.js'
import { ALL_TICKERS, ALL_UNIVERSE_IDS } from '../../utilities/constants.js'
import { storage } from '../storage.js'

describe('initializeData (integration)', () => {
    beforeAll(() => {
        initializeData()
    })

    it('populates price data for every ticker', () => {
        for (const ticker of ALL_TICKERS) {
            expect(storage.getPriceSeries(ticker)).toBeDefined()
        }
    })

    it('populates 365 price points with date and price for every ticker', () => {
        for (const ticker of ALL_TICKERS) {
            const data = storage.getPriceSeries(ticker)

            expect(data).toHaveLength(365)
            data.forEach((point) => {
                expect(point.date).toBeInstanceOf(Date)
                expect(typeof point.price).toBe('number')
            })
        }
    })

    it('populates daily series data for every ticker', () => {
        for (const ticker of ALL_TICKERS) {
            expect(storage.getDailyReturnSeries(ticker)).toBeDefined()
        }
    })

    it('populates 365 daily series points with date and dailyReturn for every ticker', () => {
        for (const ticker of ALL_TICKERS) {
            const data = storage.getDailyReturnSeries(ticker)

            expect(data).toHaveLength(365)
            data.forEach((point) => {
                expect(point.date).toBeInstanceOf(Date)
                expect(typeof point.dailyReturn).toBe('number')
                expect(Number.isFinite(point.dailyReturn)).toBe(true)
            })
        }
    })

    it('populates outperformance data for every symbol/universe pair', () => {
        for (const symbol of ALL_TICKERS) {
            for (const universeId of ALL_UNIVERSE_IDS) {
                const data = storage.getOutperformanceSeries(symbol, universeId)
                expect(data).toBeDefined()
                expect(data.length).toBeGreaterThan(0)
            }
        }
    })

    it('populates 365 outperformance points with date and outperformancePercentage for every ticker/universe pair', () => {
        for (const ticker of ALL_TICKERS) {
            for (const universeId of ALL_UNIVERSE_IDS) {
                const data = storage.getOutperformanceSeries(ticker, universeId)

                expect(data).toHaveLength(365)
                data.forEach((point) => {
                    expect(point.date).toBeInstanceOf(Date)
                    expect(typeof point.outperformancePercentage).toBe('number')
                    expect(Number.isFinite(point.outperformancePercentage)).toBe(true)
                })
            }
        }
    })
})
