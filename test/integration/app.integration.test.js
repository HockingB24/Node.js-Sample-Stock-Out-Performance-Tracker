import request from 'supertest'
import app from '../../src/app.js'
import { initializeData } from '../../src/services/data_initialization/initializeData.js'

describe('API integration Test', () => {
    beforeAll(() => {
        initializeData()
    })

    it('GET /health returns ok', async () => {
        const response = await request(app).get('/health')
        expect(response.status).toBe(200)
        expect(response.body).toEqual({ status: 'ok' })
    })

    it('GET /api/stocks/:ticker/prices returns price data for a ticker', async () => {
        const response = await request(app).get('/api/stocks/AAPL/prices')
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(365)
        expect(response.body[0]).toHaveProperty('date')
        expect(response.body[0]).toHaveProperty('price')
        expect(typeof response.body[0].price).toBe('number')
    })

    it('GET /api/stocks/:ticker/returns returns daily returns for a ticker', async () => {
        const response = await request(app).get('/api/stocks/AAPL/returns')
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(365)
        expect(response.body[0]).toHaveProperty('date')
        expect(response.body[0]).toHaveProperty('dailyReturn')
        expect(typeof response.body[0].dailyReturn).toBe('number')
    })

    it('GET /api/universes/:universeId/stocks/:ticker/outperformance returns outperformance for a ticker in a universe', async () => {
        const response = await request(app).get('/api/universes/1/stocks/AAPL/outperformance')
        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(365)
        expect(response.body.data[0]).toHaveProperty('date')
        expect(response.body.data[0]).toHaveProperty('outperformancePercentage')
        expect(typeof response.body.data[0].outperformancePercentage).toBe('number')
    })

    it('handles lowercase tickers', async () => {
        const response = await request(app).get('/api/stocks/aapl/prices')
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(365)
    })

    it('returns 404 for an unknown route', async () => {
        const response = await request(app).get('/api/does-not-exist')
        expect(response.status).toBe(404)
        expect(response.body.error.statusCode).toBe(404)
    })

    it('returns 404 for missing price data', async () => {
        const response = await request(app).get('/api/stocks/NOPE/prices')
        expect(response.status).toBe(404)
        expect(response.body.error.statusCode).toBe(404)
    })

    it('returns 404 for missing daily series data', async () => {
        const response = await request(app).get('/api/stocks/NOPE/returns')
        expect(response.status).toBe(404)
        expect(response.body.error.statusCode).toBe(404)
    })

    it('returns 404 for missing outperformance data', async () => {
        const response = await request(app).get('/api/universes/999/stocks/AAPL/outperformance')
        expect(response.status).toBe(404)
        expect(response.body.error.statusCode).toBe(404)
    })

    it('POST /api/outperformance returns outperformance data for a matching universe ticker set', async () => {
        const response = await request(app)
            .post('/api/outperformance')
            .send({
                comparisonTicker: 'AAPL',
                universe: [
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
                ],
            })

        expect(response.status).toBe(200)
        expect(response.body.universeId).toBe('1')
        expect(response.body.ticker).toBe('AAPL')
        expect(response.body.data).toHaveLength(365)
        expect(response.body.data[0]).toHaveProperty('date')
        expect(response.body.data[0]).toHaveProperty('outperformancePercentage')
    })

    it('POST /api/outperformance treats universe tickers as a case-insensitive set', async () => {
        const response = await request(app)
            .post('/api/outperformance')
            .send({
                comparisonTicker: 'aapl',
                universe: [
                    'intc',
                    'AMD',
                    'NFLX',
                    'META',
                    'TSLA',
                    'NVDA',
                    'AMZN',
                    'GOOG',
                    'MSFT',
                    'AAPL',
                    'aapl',
                ],
            })

        expect(response.status).toBe(200)
        expect(response.body.universeId).toBe('1')
        expect(response.body.ticker).toBe('AAPL')
        expect(response.body.data).toHaveLength(365)
        expect(response.body.data[0]).toHaveProperty('date')
        expect(response.body.data[0]).toHaveProperty('outperformancePercentage')
    })


    it('POST /api/outperformance returns 404 when universe ticker set does not match a known universe', async () => {
        const response = await request(app)
            .post('/api/outperformance')
            .send({
                comparisonTicker: 'AAPL',
                universe: ['AAPL', 'MSFT', 'FAKE'],
            })

        expect(response.status).toBe(404)
        expect(response.body.error.statusCode).toBe(404)
    })

    it('POST /api/outperformance returns 400 when comparisonTicker is missing', async () => {
        const response = await request(app)
            .post('/api/outperformance')
            .send({
                universe: ['AAPL', 'MSFT'],
            })

        expect(response.status).toBe(400)
        expect(response.body.error.statusCode).toBe(400)
    })

    it('POST /api/outperformance returns 400 when universe is missing', async () => {
        const response = await request(app).post('/api/outperformance').send({
            comparisonTicker: 'AAPL',
        })

        expect(response.status).toBe(400)
        expect(response.body.error.statusCode).toBe(400)
    })

    it('POST /api/outperformance returns 400 when universe contains non-string values', async () => {
        const response = await request(app)
            .post('/api/outperformance')
            .send({
                comparisonTicker: 'AAPL',
                universe: ['AAPL', 123],
            })

        expect(response.status).toBe(400)
        expect(response.body.error.statusCode).toBe(400)
    })
})
