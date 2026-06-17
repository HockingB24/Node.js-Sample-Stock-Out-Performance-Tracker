import app from './app.js'
import { initializeData } from './services/data_initialization/initializeData.js'

const PORT = Number(process.env.PORT) || 3000

function startServer() {
    initializeData()

    app.listen(PORT, () => {
        console.log(`Performance API listening on port ${PORT}`)
    })
}

startServer()
