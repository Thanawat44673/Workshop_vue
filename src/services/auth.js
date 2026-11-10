import { publicApi, getApiErrorMessage } from './apiClient'

function notifyAuthChange() {
  window.dispatchEvent(new Event('auth-changed'))
}

export async function authenticate(action, payload) {
  const endpoints = {
    login: '/login',
    register: '/register',
  }
  const endpoint = endpoints[action]

  if (!endpoint) {
    throw new Error('ไม่พบ endpoint สำหรับการยืนยันตัวตนนี้')
  }

  let result
  try {
    const response = await publicApi.post(endpoint, payload)
    result = response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'ข้อมูลไม่ถูกต้อง หรือระบบไม่สามารถดำเนินการได้'))
  }

  if (action === 'login') {
    const { token, user } = result.data || {}
    if (!token) {
      throw new Error('เข้าสู่ระบบแล้ว แต่ API ไม่ได้ส่ง token กลับมา')
    }

    sessionStorage.setItem('authToken', token)
    sessionStorage.setItem('authUser', JSON.stringify(user || {}))
    notifyAuthChange()
  }

  return result
}

export function getAuthUser() {
  const user = sessionStorage.getItem('authUser')
  return user ? JSON.parse(user) : null
}

export function getAuthToken() {
  return sessionStorage.getItem('authToken')
}

export function clearAuthSession() {
  sessionStorage.removeItem('authToken')
  sessionStorage.removeItem('authUser')
  notifyAuthChange()
}
