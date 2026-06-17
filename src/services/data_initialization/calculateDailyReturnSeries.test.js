import { calculateDailyReturnSeries } from './calculateDailyReturnSeries.js'

describe('calculateDailyReturnSeries', () => {
    it('throws when priceData is not an array', () => {
        expect(() => {
            calculateDailyReturnSeries('AAPL')
        }).toThrow(TypeError)
    })

    it('throws when priceData has fewer than two values', () => {
        expect(() => {
            calculateDailyReturnSeries([0])
        }).toThrow(TypeError)
    })

    it('throws when priceData contains strings', () => {
        expect(() => {
            calculateDailyReturnSeries(['0', '1'])
        }).toThrow(TypeError)
    })

    it('throws when priceData contains negative values', () => {
        expect(() => {
            calculateDailyReturnSeries([0, 1, -1])
        }).toThrow(TypeError)
    })

    it('throws when priceData contains non-finite values', () => {
        const invalidValues = [NaN, Infinity, -Infinity]

        invalidValues.forEach((value) => {
            expect(() => {
                calculateDailyReturnSeries([1, value, 3])
            }).toThrow(TypeError)
        })
    })
    ;(it('no change in price should return all zeroes', () => {
        const priceData = [3, 3, 3, 3, 3, 3, 3]
        const dailyReturns = calculateDailyReturnSeries(priceData)
        dailyReturns.forEach((pct) => {
            expect(pct).toEqual(0)
        })
    }),
        it('positive change in price should return positive pct', () => {
            const priceData = [2, 4, 6, 12]
            const expectedOutput = [0, 1.0, 0.5, 1.0]
            const dailyReturns = calculateDailyReturnSeries(priceData)
            expect(dailyReturns).toEqual(expectedOutput)
        }))

    it('negative change in price should return negative pct', () => {
        const priceData = [100, 80, 40, 10]
        const expectedOutput = [0, -0.2, -0.5, -0.75]
        const dailyReturns = calculateDailyReturnSeries(priceData)
        expect(dailyReturns).toEqual(expectedOutput)
    })

    it('test of both negative and positive behavior', () => {
        const priceData = [100, 200, 100, 50]
        const expectedOutput = [0, 1.0, -0.5, -0.5]
        const dailyReturns = calculateDailyReturnSeries(priceData)
        expect(dailyReturns).toEqual(expectedOutput)
    })

    it('returns one daily return per input price', () => {
        const priceData = [100, 110, 121]
        expect(calculateDailyReturnSeries(priceData)).toHaveLength(priceData.length)
    })
})
