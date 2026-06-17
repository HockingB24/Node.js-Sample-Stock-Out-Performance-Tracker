import express from 'express'

import universeRoutes from './routes/universeRoutes.js'
import stockRoutes from './routes/stockRoutes.js'

import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
    })
})

app.use('/api', universeRoutes)
app.use('/api', stockRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
