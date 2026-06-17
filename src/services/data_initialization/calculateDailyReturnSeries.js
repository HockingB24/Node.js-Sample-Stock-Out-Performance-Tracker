export const calculateDailyReturnSeries = (priceData) => {
    if (
        !Array.isArray(priceData) ||
        priceData.some(
            (price) => typeof price !== 'number' || !Number.isFinite(price) || price <= 0,
        ) ||
        priceData.length < 2
    ) {
        throw TypeError('priceData should be an array of positive numbers with length >= 2')
    }

    const dailyReturns = [0]
    for (let i = 1; i < priceData.length; i++) {
        const previousPrice = priceData[i - 1]
        const currentPrice = priceData[i]
        const dailyReturn = (currentPrice - previousPrice) / previousPrice
        dailyReturns.push(dailyReturn)
    }

    return dailyReturns
}
