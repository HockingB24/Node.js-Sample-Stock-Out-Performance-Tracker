const priceMap = new Map()
const dailyReturnSeriesMap = new Map()
const outperformanceMap = new Map()

export const storage = {
    setPriceSeries: (ticker, priceData) => priceMap.set(ticker, priceData),
    getPriceSeries: (ticker) => priceMap.get(ticker),
    setDailyReturnSeries: (ticker, performanceData) =>
        dailyReturnSeriesMap.set(ticker, performanceData),
    getDailyReturnSeries: (ticker) => dailyReturnSeriesMap.get(ticker),
    setOutperformanceSeries: (ticker, universeId, performanceData) =>
        outperformanceMap.set(`${ticker}:${universeId}`, performanceData),
    getOutperformanceSeries: (ticker, universeId) =>
        outperformanceMap.get(`${ticker}:${universeId}`),
    clear: () => {
        priceMap.clear()
        dailyReturnSeriesMap.clear()
        outperformanceMap.clear()
    },
}
