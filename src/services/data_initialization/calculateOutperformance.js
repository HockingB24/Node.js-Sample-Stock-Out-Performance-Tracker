export const calculateOutperformancePercentage = (comparisonReturn, peerReturns) => {
    if (!isFiniteNumber(comparisonReturn)) {
        throw TypeError('comparisonReturn must be a finite number')
    }

    if (
        !Array.isArray(peerReturns) ||
        peerReturns.length === 0 ||
        peerReturns.some((peerReturn) => !isFiniteNumber(peerReturn))
    ) {
        throw TypeError('peerReturns must be a non-empty array of finite numbers')
    }

    const outperformCount = peerReturns.reduce(
        (count, peerReturn) => count + (peerReturn < comparisonReturn ? 1 : 0),
        0,
    )

    return (outperformCount / peerReturns.length) * 100
}

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value)
