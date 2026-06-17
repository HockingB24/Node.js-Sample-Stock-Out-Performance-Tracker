import { calculateOutperformancePercentage } from './calculateOutperformance.js'

describe('calculateOutperformancePercentage', () => {
    it('throws when comparisonReturn is not a number', () => {
        expect(() => {
            calculateOutperformancePercentage('AAPL', [1, 2, 3])
        }).toThrow(TypeError)
    })

    it('throws when comparisonReturn is non-finite', () => {
        const invalidComparisonReturns = [NaN, Infinity, -Infinity]

        invalidComparisonReturns.forEach((comparisonReturn) => {
            expect(() => {
                calculateOutperformancePercentage(comparisonReturn, [1, 2, 3])
            }).toThrow(TypeError)
        })
    })

    it('throws when peerReturns is not an array', () => {
        expect(() => {
            calculateOutperformancePercentage(1, 'not-an-array')
        }).toThrow(TypeError)
    })

    it('throws when peerReturns is empty', () => {
        expect(() => {
            calculateOutperformancePercentage(1, [])
        }).toThrow(TypeError)
    })

    it('throws when peerReturns contains non-finite or non-number values', () => {
        const invalidPeerReturns = [
            [1, '2', 3],
            [1, NaN, 3],
            [1, Infinity, 3],
            [1, -Infinity, 3],
            [1, null, 3],
            [1, undefined, 3],
        ]

        invalidPeerReturns.forEach((peerReturns) => {
            expect(() => {
                calculateOutperformancePercentage(1, peerReturns)
            }).toThrow(TypeError)
        })
    })

    it('returns 100 when comparison return outperforms every peer return', () => {
        const outperformancePercentage = calculateOutperformancePercentage(10, [1, 2, 3])

        expect(outperformancePercentage).toBe(100)
    })

    it('returns 0 when comparison return outperforms no peer returns', () => {
        const outperformancePercentage = calculateOutperformancePercentage(1, [2, 3, 4])

        expect(outperformancePercentage).toBe(0)
    })

    it('does not count ties as outperformance', () => {
        const outperformancePercentage = calculateOutperformancePercentage(5, [1, 5, 9])

        expect(outperformancePercentage).toBe(33.33333333333333)
    })

    it('handles negative daily returns correctly', () => {
        const outperformancePercentage = calculateOutperformancePercentage(-0.02, [-0.05, -0.01, 0])

        expect(outperformancePercentage).toBe(33.33333333333333)
    })

    it('handles changing outperformance across independent days', () => {
        const comparisonReturns = [1, 9, 14, 16, 2]
        const peerReturnsByDay = [
            [5, 10, 15, 20],
            [5, 10, 15, 20],
            [5, 10, 15, 20],
            [5, 10, 15, 20],
            [5, 10, 15, 20],
        ]

        const outperformancePercentages = comparisonReturns.map((comparisonReturn, index) =>
            calculateOutperformancePercentage(comparisonReturn, peerReturnsByDay[index]),
        )

        expect(outperformancePercentages).toEqual([0, 25, 50, 75, 0])
    })
})
