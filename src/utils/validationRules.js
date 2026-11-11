function hasInput(value) {
  return value !== null && value !== undefined && value !== ''
}

export const requiredFieldRules = [value => hasInput(value) || 'กรุณากรอกข้อมูล']

export const priceRules = [value => hasInput(value) && Number.isFinite(Number(value)) && Number(value) >= 0 || 'กรุณากรอกราคาตั้งแต่ 0 ขึ้นไป']

export const stockRules = [value => hasInput(value) && Number.isInteger(Number(value)) && Number(value) >= 0 || 'กรุณากรอกจำนวนเต็มตั้งแต่ 0 ขึ้นไป']

export const quantityRules = [value => Number.isInteger(Number(value)) && Number(value) > 0 || 'กรุณากรอกจำนวนเต็มอย่างน้อย 1']
