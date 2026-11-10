<template>
  <article class="workshop-page">
    <v-container class="workshop-shell py-12 py-md-16">
      <header class="products-header">
        <div>
          <p class="products-kicker">E-COMMERCE / CATALOG</p>
          <h1>สินค้าทั้งหมด</h1>
          <p class="products-intro">รายการสินค้าจากระบบร้านค้าออนไลน์</p>
        </div>
        <v-btn class="add-product-button" depressed @click="productDialog = true">เพิ่มสินค้า</v-btn>
      </header>

      <v-dialog v-model="productDialog" max-width="560">
        <v-card>
          <v-card-title>เพิ่มสินค้า</v-card-title>
          <v-form ref="productForm" class="product-form" @submit.prevent="addProduct">
            <v-text-field v-model="newProduct.name" label="ชื่อสินค้า" outlined :rules="requiredRules" />
            <v-textarea v-model="newProduct.description" label="รายละเอียด" rows="3" outlined :rules="requiredRules" />
            <div class="number-fields">
              <v-text-field v-model="newProduct.price" label="ราคา" type="number" min="0" step="0.01" outlined :rules="priceRules" />
              <v-text-field v-model="newProduct.stock" label="จำนวนสินค้า" type="number" min="0" step="1" outlined :rules="stockRules" />
            </div>
            <v-file-input
              v-model="newProduct.image"
              label="รูปสินค้า"
              accept="image/*"
              prepend-icon="mdi-camera"
              outlined
              :rules="requiredRules"
              @change="previewImage"
            />
            <v-img v-if="imagePreview" class="image-preview" :src="imagePreview" height="150" contain />
            <v-alert v-if="formError" type="error" dense text>{{ formError }}</v-alert>
            <v-card-actions class="dialog-actions">
              <v-spacer />
              <v-btn text @click="closeProductDialog">ยกเลิก</v-btn>
              <v-btn class="add-product-button" type="submit" depressed :loading="savingProduct">บันทึกสินค้า</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <v-progress-linear v-if="loading" class="products-progress" indeterminate color="black" />
      <v-alert v-if="errorMessage" type="error" outlined dense role="alert" aria-live="assertive">
        {{ errorMessage }}
        <v-btn text small @click="loadProducts">ลองอีกครั้ง</v-btn>
      </v-alert>
      <v-alert v-else-if="!loading && products.length === 0" type="info" outlined dense>ยังไม่มีสินค้าให้แสดง</v-alert>

      <v-row v-else>
        <v-col v-for="(product, index) in products" :key="product.id || product._id || product.sku || index" cols="12" sm="6" md="4">
          <v-card class="product-card" outlined>
            <v-img
              v-if="getProductImageUrl(product) && !failedImages[productKey(product, index)]"
              :src="getProductImageUrl(product)"
              height="210"
              @error="markImageError(product, index)"
            />
            <div v-else class="product-image-placeholder" aria-label="พื้นที่สำหรับรูปสินค้า">
              <v-icon large color="grey lighten-1">mdi-image-outline</v-icon>
              <span>พื้นที่สำหรับรูปสินค้า</span>
            </div>
            <v-card-text>
              <h2>{{ product.name || product.title || 'สินค้า' }}</h2>
              <p v-if="product.description" class="product-description">{{ product.description }}</p>
              <p v-if="product.stock" class="product-description">จำนวนสินค้าคงเหลือ {{ product.stock }}</p>
            </v-card-text>
            <v-card-actions class="product-actions">
              <strong v-if="product.price !== undefined || product.salePrice !== undefined" class="product-price">
                {{ formatPrice(product.price !== undefined ? product.price : product.salePrice) }}
              </strong>
              <v-spacer />
              <v-btn class="order-button" small depressed @click="mockOrder(product)">สั่งซื้อ</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-snackbar v-model="orderNotice" :timeout="3500" color="grey darken-4">
      {{ orderMessage }}
    </v-snackbar>
  </article>
</template>

<script>
import { getAuthUser } from '../services/auth'
import { createProduct, getProductImageUrl, getProducts } from '../services/products'

export default {
  name: 'ProductsView',
  data: () => ({
    user: null,
    products: [],
    failedImages: {},
    loading: false,
    errorMessage: '',
    orderNotice: false,
    orderMessage: '',
    productDialog: false,
    savingProduct: false,
    formError: '',
    newProduct: { name: '', description: '', price: '', stock: '', image: '' },
    imagePreview: '',
    requiredRules: [value => !!value || 'กรุณากรอกข้อมูล'],
    priceRules: [value => value !== '' && Number(value) >= 0 || 'กรุณากรอกราคาตั้งแต่ 0 ขึ้นไป'],
    stockRules: [value => value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0 || 'กรุณากรอกจำนวนเต็มตั้งแต่ 0 ขึ้นไป'],
  }),
  created() {
    this.user = getAuthUser()
    this.loadProducts()
  },
  beforeDestroy() {
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
  },
  methods: {
    previewImage(file) {
      if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
      this.imagePreview = file ? URL.createObjectURL(file) : ''
    },
    async loadProducts() {
      this.loading = true
      this.errorMessage = ''
      try {
        const result = await getProducts()
        const data = result.data
        this.failedImages = {}
        this.products = Array.isArray(data)
          ? data
          : Array.isArray(data && data.products)
            ? data.products
            : Array.isArray(result.products)
              ? result.products
              : []
      } catch (error) {
        this.errorMessage = error.message || 'โหลดรายการสินค้าไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    formatPrice(value) {
      const amount = Number(value)
      return Number.isFinite(amount)
        ? new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount)
        : value
    },
    getProductImageUrl(product) {
      return getProductImageUrl(product)
    },
    productKey(product, index) {
      return product.id || product._id || product.sku || index
    },
    markImageError(product, index) {
      this.$set(this.failedImages, this.productKey(product, index), true)
    },
    mockOrder(product) {
      const name = product.name || product.title || 'สินค้า'
      this.orderMessage = `ตัวอย่าง: เลือกสั่งซื้อ ${name} (ยังไม่ส่งคำสั่งซื้อไป backend)`
      this.orderNotice = true
    },
    async addProduct() {
      if (!this.$refs.productForm.validate()) return

      this.formError = ''
      this.savingProduct = true
      try {
        const result = await createProduct({
          name: this.newProduct.name,
          description: this.newProduct.description,
          price: Number(this.newProduct.price),
          stock: Number(this.newProduct.stock),
          image: this.newProduct.image,
        })
        this.productDialog = false
        this.newProduct = { name: '', description: '', price: '', stock: '', image: '' }
        if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
        this.imagePreview = ''
        this.$refs.productForm.resetValidation()
        this.orderMessage = result.message || 'เพิ่มสินค้าเรียบร้อยแล้ว'
        this.orderNotice = true
        await this.loadProducts()
      } catch (error) {
        this.formError = error.message || 'เพิ่มสินค้าไม่สำเร็จ'
      } finally {
        this.savingProduct = false
      }
    },
    closeProductDialog() {
      this.productDialog = false
      this.formError = ''
      if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
      this.imagePreview = ''
      this.newProduct = { name: '', description: '', price: '', stock: '', image: '' }
    },
  },
}
</script>

<style scoped>
.products-header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 42px; }
.products-kicker { margin: 0 0 14px; color: #888; font-size: 10px; font-weight: 700; letter-spacing: .16em; }
h1 { margin: 0; font-size: clamp(38px, 6vw, 64px); font-weight: 800; letter-spacing: -.05em; }
.products-intro { margin: 12px 0 0; color: #777; }
.products-progress { margin-bottom: 24px; }
.product-card { height: 100%; border-color: #deded9 !important; background: #fff !important; }
.product-image-placeholder { display: flex; height: 210px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #eeeee9; color: #888; font-size: 12px; }
.product-card h2 { margin: 0 0 10px; color: #111; font-size: 18px; }
.product-description { color: #777; font-size: 13px; line-height: 1.6; }
.product-actions { min-height: 58px; padding: 12px 16px; border-top: 1px solid #eee; }
.product-price { color: #111; font-size: 15px; }
.order-button { color: #fff !important; background: #111 !important; letter-spacing: 0 !important; }
.add-product-button { color: #fff !important; background: #111 !important; letter-spacing: 0 !important; }
.product-form { padding: 0 24px 16px; }
.number-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.image-preview { margin: -8px 0 16px; background: #f5f5f2; }
.dialog-actions { padding: 8px 0 0; }
@media (max-width: 600px) {
  .products-header { align-items: start; flex-wrap: wrap; }
}
</style>
