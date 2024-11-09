import api from './api'

// Constants
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

class NotesApiError extends Error {
  constructor(message, statusCode, error) {
    super(message)
    this.name = 'NotesApiError'
    this.statusCode = statusCode
    this.error = error
  }
}

class NotesService {
  async executeWithRetry(operation, retries = MAX_RETRIES) {
    try {
      const response = await operation()
      return response.data
    } catch (error) {
      if (retries > 0 && this.shouldRetry(error)) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
        return this.executeWithRetry(operation, retries - 1)
      }
      throw this.handleError(error)
    }
  }

  shouldRetry(error) {
    return error.response?.status === 429 || // Rate limiting
           error.response?.status === 503 || // Service unavailable
           !error.response // Network error
  }

  handleError(error) {
    const statusCode = error.response?.status || 500
    const message = error.response?.data?.message || 'An error occurred'
    return new NotesApiError(message, statusCode, error)
  }

  async getAllNotes() {
    return this.executeWithRetry(() =>
      api.get('/api/notes')
    ).then(response => response.data)
  }

  async getNote(id) {
    return this.executeWithRetry(() =>
      api.get(`/api/notes/${id}`)
    ).then(response => response.data)
  }

  async createNote(note) {
    return this.executeWithRetry(() =>
      api.post('/api/notes', note)
    ).then(response => response.data)
  }

  async updateNote(id, note) {
    return this.executeWithRetry(() =>
      api.put(`/api/notes/${id}`, note)
    ).then(response => response.data)
  }

  async deleteNote(id) {
    return this.executeWithRetry(() =>
      api.delete(`/api/notes/${id}`)
    ).then(response => response.data)
  }
}

export default new NotesService()
