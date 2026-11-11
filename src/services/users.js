import { authenticatedApi, getApiErrorMessage } from './apiClient'
import { getAuthToken } from './auth'

function requireToken() {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบในฐานะแอดมินก่อนจัดการบัญชีร้านค้า')
  }
}

export async function getPendingUsers() {
  requireToken()

  try {
    const response = await authenticatedApi.get('/users/pending')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'โหลดบัญชีร้านค้าที่รออนุมัติไม่สำเร็จ'))
  }
}

export async function approveUser(userId) {
  requireToken()

  if (!userId) {
    throw new Error('ไม่พบรหัสบัญชีร้านค้าที่ต้องการอนุมัติ')
  }

  try {
    const response = await authenticatedApi.put(`/users/${encodeURIComponent(userId)}/approve`)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'อนุมัติบัญชีร้านค้าไม่สำเร็จ'))
  }
}
