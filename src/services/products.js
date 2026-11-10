import { authenticatedApi, getApiErrorMessage, resolveApiAssetUrl } from './apiClient'
import { getAuthToken } from './auth'

export async function getProducts() {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนดูรายการสินค้า')
  }

  try {
    const response = await authenticatedApi.get('/products')
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'โหลดรายการสินค้าไม่สำเร็จ'))
  }
}

export async function createProduct(payload) {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้า')
  }

  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  try {
    const response = await authenticatedApi.post('/products', formData)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'เพิ่มสินค้าไม่สำเร็จ'))
  }
}

export function getProductImageUrl(product) {
  const image = product.image || product.imageUrl || (product.images && product.images[0])
  return resolveApiAssetUrl(image)
}
