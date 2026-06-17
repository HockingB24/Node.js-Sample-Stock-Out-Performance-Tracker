export const ALL_TICKERS = [
    'AAPL',
    'MSFT',
    'GOOG',
    'AMZN',
    'NVDA',
    'TSLA',
    'META',
    'NFLX',
    'AMD',
    'INTC',
    'JPM',
    'BAC',
    'GS',
    'V',
    'MA',
    'XOM',
    'CVX',
    'JNJ',
    'PFE',
    'KO',
]

export const ALL_UNIVERSE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export const UNIVERSE_ID_TO_TICKERS = new Map([
    ['1', ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'NVDA', 'TSLA', 'META', 'NFLX', 'AMD', 'INTC']],
    ['2', ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'NVDA', 'META', 'JPM', 'V', 'XOM', 'JNJ']],
    ['3', ['JPM', 'BAC', 'GS', 'V', 'MA']],
    ['4', ['NVDA', 'AMD', 'INTC']],
    ['5', ['JNJ', 'PFE']],
    ['6', ['XOM', 'CVX']],
    ['7', ['TSLA', 'NVDA', 'AMD', 'NFLX', 'META']],
    ['8', ['JNJ', 'PFE', 'KO', 'XOM', 'CVX', 'JPM']],
    ['9', ['AMZN', 'NFLX', 'KO', 'TSLA']],
    ['10', ['AAPL', 'MSFT', 'GOOG', 'AMZN', 'META']],
])

export const getUniverseKey = (tickers) => {
    const normalizedTickers = tickers.map((ticker) => ticker.toUpperCase())
    const uniqueTickers = [...new Set(normalizedTickers)]

    return uniqueTickers.sort().join(',')
}

export const UNIVERSE_TICKERS_TO_ID = new Map(
    [...UNIVERSE_ID_TO_TICKERS.entries()].map(([universeId, tickers]) => [
        getUniverseKey(tickers),
        universeId,
    ]),
)

export const DEFAULT_VOLATILITY_PERCENT = 2
