import axios from 'axios'

const baseURL = (process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api/v1').replace(/\/$/, '')
const apiOrigin = new URL(baseURL, window.location.origin).origin

export const publicApi = axios.create({ baseURL })
export const authenticatedApi = axios.create({ baseURL })

authenticatedApi.interceptors.request.use(config => {
  const token = sessionStorage.getItem('authToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(error, fallback) {
  if (!error) return fallback

  const responseData = error.response && error.response.data
  const responseMessage = typeof responseData === 'string'
    ? responseData
    : responseData && (responseData.message || responseData.error)
  if (typeof responseMessage === 'string' && responseMessage.trim()) return responseMessage
  if (!error.response && error.message) return error.message
  return fallback
}

export function resolveApiAssetUrl(path) {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  return new URL(path, `${apiOrigin}/`).toString()
}
