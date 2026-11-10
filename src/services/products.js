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

export async function updateProduct(productId, payload) {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนแก้ไขสินค้า')
  }

  if (!productId) {
    throw new Error('ไม่พบรหัสสินค้า จึงแก้ไขสินค้าไม่ได้')
  }

  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value)
    }
  })

  try {
    const response = await authenticatedApi.put(`/products/${encodeURIComponent(productId)}`, formData)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'แก้ไขสินค้าไม่สำเร็จ'))
  }
}

export async function deleteProduct(productId) {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนลบสินค้า')
  }

  if (!productId) {
    throw new Error('ไม่พบรหัสสินค้า จึงลบสินค้าไม่ได้')
  }

  try {
    const response = await authenticatedApi.delete(`/products/${encodeURIComponent(productId)}`)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'ลบสินค้าไม่สำเร็จ'))
  }
}

export async function recordSale(productId, quantity) {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนบันทึกยอดขาย')
  }

  if (!productId) {
    throw new Error('ไม่พบรหัสสินค้า จึงบันทึกยอดขายไม่ได้')
  }

  try {
    const response = await authenticatedApi.post(`/products/${encodeURIComponent(productId)}/orders`, { quantity })
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'บันทึกยอดขายไม่สำเร็จ'))
  }
}

export async function getProductOrders(productId) {
  if (!getAuthToken()) {
    throw new Error('กรุณาเข้าสู่ระบบก่อนดูรายละเอียดสินค้า')
  }

  if (!productId) {
    throw new Error('ไม่พบรหัสสินค้า จึงโหลดรายละเอียดไม่ได้')
  }

  try {
    const response = await authenticatedApi.get(`/products/${encodeURIComponent(productId)}/orders`)
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'โหลดรายละเอียดสินค้าไม่สำเร็จ'))
  }
}

export function getProductImageUrl(product) {
  const image = product.image || product.imageUrl || (product.images && product.images[0])
  return resolveApiAssetUrl(image)
}
