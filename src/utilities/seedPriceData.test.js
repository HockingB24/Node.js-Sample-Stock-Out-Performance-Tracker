import { generateMockPriceSeriesData } from './seedPriceData.js'

describe('generateMockData', () => {
    it('returns a series for each symbol provided', () => {
        const symbols = ['AAPL', 'MSFT']
        const data = generateMockPriceSeriesData(symbols)
        expect([...data.keys()]).toEqual(symbols)
    })

    it('generates 365 data points with ascending dates', () => {
        const data = generateMockPriceSeriesData(['AAPL'])
        const aaplSeries = data.get('AAPL')

        expect(aaplSeries).toHaveLength(365)
        for (let i = 1; i < aaplSeries.length; i++) {
            expect(aaplSeries[i].date.getTime()).toBeGreaterThan(aaplSeries[i - 1].date.getTime())
        }
    })

    it('never generates a negative or zero price', () => {
        const data = generateMockPriceSeriesData(['AAPL'])
        data.get('AAPL').forEach((point) => {
            expect(point.price).toBeGreaterThan(0)
        })
    })

    it('throws when tickers is not an array', () => {
        expect(() => {
            generateMockPriceSeriesData('AAPL')
        }).toThrow(TypeError)
    })

    it('throws when tickers is empty', () => {
        expect(() => {
            generateMockPriceSeriesData([])
        }).toThrow(TypeError)
    })

    it('throws when volatility is negative', () => {
        expect(() => {
            generateMockPriceSeriesData(['AAPL'], -1)
        }).toThrow(TypeError)
    })

    it('throws when volatility is greater than 100', () => {
        expect(() => {
            generateMockPriceSeriesData(['AAPL'], 101)
        }).toThrow(TypeError)
    })

    it('throws when volatility is not a number', () => {
        expect(() => {
            generateMockPriceSeriesData(['AAPL'], '90')
        }).toThrow(TypeError)
    })

    it('dedupes duplicate tickers', () => {
        const data = generateMockPriceSeriesData(['AAPL', 'AAPL'])
        expect([...data.keys()]).toEqual(['AAPL'])
    })

    it('generates flat prices when volatility is zero', () => {
        const data = generateMockPriceSeriesData(['AAPL'], 0)
        const aaplSeries = data.get('AAPL')
        const firstPrice = aaplSeries[0].price

        aaplSeries.forEach((point) => {
            expect(point.price).toEqual(firstPrice)
        })
    })

    it('throws when volatility is non-finite', () => {
        const invalidVolatilityValues = [NaN, Infinity, -Infinity]

        invalidVolatilityValues.forEach((volatility) => {
            expect(() => {
                generateMockPriceSeriesData(['AAPL'], volatility)
            }).toThrow(TypeError)
        })
    })
})
