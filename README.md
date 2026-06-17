# Price, Daily Return, and Outperformance Tracker

A small Node.js / Express API that generates mock stock prices over the course of a year, calculates the day-over-day returns, then measures stock performance relative to other stocks within predefined universes. This is defined as "outperformance", or the percentage of stocks within the universe that the comparison stock outperformed that day in terms of daily return.

The app seeds in-memory data on start-up, regenerating random stock data on every launch. This is to keep things simple and avoid external data dependencies.

## How To Use

### Install

```bash
npm install
```

### Run

```bash
npm start
```

### Run Tests

```bash
npm test
```

## API

### Health-Check

```http
GET /health
```

Response:

```json
{ "status": "ok" }
```

### Price Series

```http
GET /api/stocks/:ticker/prices
```

Returns the generated price series for a ticker. Returns 404 when not found.

Response:

```json
[
    {
        "date": "2025-06-17T05:00:00.000Z",
        "price": 100.42
    },
    {
        "date": "2025-06-18T05:00:00.000Z",
        "price": 101.15
    }
]
```

### Daily Returns

```http
GET /api/stocks/:ticker/returns
```

Returns the daily return series for a ticker. Returns 404 when not found.
Daily return is the percentage difference between that day's price and the previous day's, expressed as a decimal.

- Example: 100 -> 125
    - Price increase: 25%
    - dailyReturn value: 0.25

Response:

```json
[
    {
        "date": "2025-06-17T05:00:00.000Z",
        "dailyReturn": 0
    },
    {
        "date": "2025-06-18T05:00:00.000Z",
        "dailyReturn": 0.007269355201743765
    }
]
```

### Outperformance by Universe ID

```http
GET /api/universes/:universeId/stocks/:ticker/outperformance
```

Returns the outperformance series for a ticker within a known universe. Returns 404 when any inputs are not found.

Response:

```json
[
    {
        "date": "2025-06-17T05:00:00.000Z",
        "outperformancePercentage": 75
    },
    {
        "date": "2025-06-18T05:00:00.000Z",
        "outperformancePercentage": 50
    }
]
```

### Outperformance by Universe Tickers

```http
POST /api/outperformance
Content-Type: application/json
```

Returns the outperformance series for a ticker within a known universe, defined by tickers. Returns 404 when any inputs are not found.

Body:

```json
{
    "comparisonTicker": "AAPL",
    "universe": ["AAPL", "MSFT", "GOOG", "AMZN", "NVDA", "TSLA", "META", "NFLX", "AMD", "INTC"]
}
```

Response:

```json
{
    "universeId": "1",
    "ticker": "AAPL",
    "data": [
        {
            "date": "2025-06-17T05:00:00.000Z",
            "outperformancePercentage": 75
        }
    ]
}
```

## Determining "Out-Performance"

For each date, "out-performance" of a selected ticker is calculated by comparing that ticker's daily return vs. the daily returns of every other ticker in the same universe on that same date.

The outperformance calculation is:

```text
count(peerReturn < comparisonReturn) / peerCount * 100
```

Notes:

- Ties are not considered outperforming.
- Date alignment is strict when building outperformance data, so missing peer dates fail fast during initialization.
- The POST body's universe tickers are de-duplicated for lookup.

## Example curl

```bash
curl -X POST http://localhost:3000/api/outperformance \
  -H "Content-Type: application/json" \
  -d '{
    "comparisonTicker": "AAPL",
    "universe": ["AAPL", "MSFT", "GOOG", "AMZN", "NVDA", "TSLA", "META", "NFLX", "AMD", "INTC"]
  }'
```
