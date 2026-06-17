import { HttpError } from './HttpError.js'

export class NotFoundError extends HttpError {
    constructor(message) {
        super(404, message)
        this.name = 'NotFoundError'
    }
}
