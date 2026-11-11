import { formatPrice } from './formatters'

const ORDER_ITEM_FIELDS = ['items', 'orderItems', 'products']
const ORDER_SUMMARY_FIELDS = ['productName', 'totalPrice', 'total', 'amount', 'quantity', 'unitPrice']

function hasValue(value) {
  return value !== undefined && value !== null && value !== ''
}

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

export function getOrderItems(order) {
  if (!order) return []

  for (const field of ORDER_ITEM_FIELDS) {
    if (Array.isArray(order[field])) {
      return order[field].filter(item => item && typeof item === 'object')
    }
  }

  return []
}

export function isOrderLike(order) {
  if (!order || typeof order !== 'object') return false

  return ORDER_SUMMARY_FIELDS.some(field => hasValue(order[field])) || getOrderItems(order).length > 0
}

export function getOrderQuantity(order) {
  if (!order) return 0
  if (hasValue(order.quantity)) return toNumber(order.quantity)

  return getOrderItems(order).reduce((total, item) => total + toNumber(item.quantity), 0)
}

export function getOrderProductNames(order, fallback = 'ไม่ระบุสินค้า') {
  if (!order) return fallback
  if (order.productName) return order.productName

  const names = getOrderItems(order)
    .map(item => item.productName || item.name || (item.product && item.product.name))
    .filter(Boolean)

  return names.join(', ') || fallback
}

export function getOrderUnitPrices(order) {
  if (!order) return '—'
  if (hasValue(order.unitPrice)) return formatPrice(order.unitPrice)

  const prices = getOrderItems(order)
    .map(item => {
      const price = hasValue(item.unitPrice)
        ? item.unitPrice
        : hasValue(item.price)
          ? item.price
          : item.product && item.product.price
      return hasValue(price) ? formatPrice(price) : ''
    })
    .filter(Boolean)

  return prices.join(', ') || '—'
}

export function getOrderTotal(order) {
  if (!order) return 0
  const orderTotal = [order.totalPrice, order.total, order.amount].find(hasValue)
  if (orderTotal !== undefined) return toNumber(orderTotal)

  return getOrderItems(order).reduce((total, item) => {
    if (hasValue(item.totalPrice)) return total + toNumber(item.totalPrice)

    const itemPrice = hasValue(item.unitPrice)
      ? item.unitPrice
      : hasValue(item.price)
        ? item.price
        : item.product && item.product.price
    return total + toNumber(itemPrice) * toNumber(item.quantity)
  }, 0)
}
