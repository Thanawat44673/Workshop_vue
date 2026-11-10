import { authenticatedApi, getApiErrorMessage } from './apiClient'
import { getAuthToken } from './auth'

export async function getOrders() {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนดูออเดอร์')
  }

  try {
    const response = await authenticatedApi.get('/orders')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'โหลดรายการออเดอร์ไม่สำเร็จ'))
  }
}
