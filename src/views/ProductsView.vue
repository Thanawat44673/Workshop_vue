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

      <SearchField
        v-model="searchQuery"
        field-class="product-search"
        label="ค้นหาสินค้า"
        placeholder="พิมพ์ชื่อสินค้า"
      />

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
      <v-alert v-else-if="!loading && filteredProducts.length === 0" type="info" outlined dense>ไม่พบสินค้าที่ตรงกับคำค้นหา</v-alert>

      <v-row v-else>
        <v-col v-for="(product, index) in filteredProducts" :key="product.id || product._id || product.sku || index" cols="12" sm="6" md="4">
          <v-card
            class="product-card"
            outlined
            role="button"
            tabindex="0"
            @click="openProductDetails(product)"
            @keydown.enter.prevent="openProductDetails(product)"
            @keydown.space.prevent="openProductDetails(product)"
          >
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
              <p v-if="product.stock !== undefined && Number(product.stock) <= 0" class="out-of-stock">สินค้าหมด</p>
              <p v-else-if="product.stock !== undefined" class="product-description">จำนวนสินค้าคงเหลือ {{ product.stock }}</p>
            </v-card-text>
            <v-card-actions class="product-actions">
              <strong v-if="product.price !== undefined || product.salePrice !== undefined" class="product-price">
                {{ formatPrice(product.price !== undefined ? product.price : product.salePrice) }}
              </strong>
              <v-spacer />
              <v-btn class="sale-button" small depressed @click.stop="openSaleDialog(product)">บันทึกยอดขาย</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="saleDialog" max-width="420">
      <v-card>
        <v-card-title>บันทึกยอดขาย</v-card-title>
        <v-card-text>
          <p v-if="selectedProduct" class="sale-product-name">{{ selectedProduct.name || selectedProduct.title || 'สินค้า' }}</p>
          <v-form ref="saleForm" @submit.prevent="submitSale">
            <v-text-field v-model="saleQuantity" label="จำนวนที่ขายได้" type="number" min="1" step="1" outlined :rules="quantityRules" />
            <v-alert v-if="saleError" type="error" dense text>{{ saleError }}</v-alert>
            <div class="sale-actions">
              <v-spacer />
              <v-btn text @click="closeSaleDialog">ยกเลิก</v-btn>
              <v-btn class="sale-button" type="submit" depressed :loading="savingSale">บันทึกยอดขาย</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="detailsDialog" max-width="680">
      <v-card>
        <v-card-title>รายละเอียดสินค้า</v-card-title>
        <v-card-text v-if="selectedProduct" class="details-content">
          <h2>{{ selectedProduct.name || selectedProduct.title || 'สินค้า' }}</h2>
          <p v-if="selectedProduct.description">{{ selectedProduct.description }}</p>
          <p v-if="selectedProduct.price !== undefined">ราคาต่อชิ้น: {{ formatPrice(selectedProduct.price) }}</p>
          <p v-if="selectedProduct.stock !== undefined">คงเหลือ: {{ selectedProduct.stock }}</p>
          <v-divider class="my-5" />
          <h3>รายการยอดขาย</h3>
      <v-progress-linear v-if="ordersLoading" class="my-4" indeterminate color="black" />
          <v-alert v-if="ordersError" class="mt-4" type="error" dense text>{{ ordersError }}</v-alert>
          <v-alert v-else-if="!ordersLoading && productOrders.length === 0" class="mt-4" type="info" dense text>ยังไม่มีรายการยอดขายของสินค้านี้</v-alert>
          <v-list v-else class="order-list" dense>
            <v-list-item v-for="(order, index) in productOrders" :key="order._id || order.id || index">
              <v-list-item-content>
                <v-list-item-title>{{ order.productName || selectedProduct.name || selectedProduct.title || 'สินค้า' }}</v-list-item-title>
                <v-list-item-subtitle>จำนวน {{ order.quantity }} × {{ formatPrice(order.unitPrice) }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <strong>{{ formatPrice(order.totalPrice) }}</strong>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="detailsDialog = false">ปิด</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
      <v-snackbar v-model="salesNotice" :timeout="3500" color="grey darken-4">
      {{ salesMessage }}
    </v-snackbar>
  </article>
</template>

<script>
import { createProduct, getProductImageUrl, getProducts, getProductOrders, recordSale } from '../services/products'
import SearchField from '../components/SearchField.vue'
import { extractCollection } from '../utils/collections'
import { formatPrice } from '../utils/formatters'

export default {
  name: 'ProductsView',
  components: { SearchField },
  data: () => ({
    products: [],
    failedImages: {},
    loading: false,
    errorMessage: '',
    salesNotice: false,
    salesMessage: '',
    saleDialog: false,
    selectedProduct: null,
    saleQuantity: '1',
    savingSale: false,
    saleError: '',
    detailsDialog: false,
    ordersLoading: false,
    ordersError: '',
    productOrders: [],
    quantityRules: [value => Number.isInteger(Number(value)) && Number(value) > 0 || 'กรุณากรอกจำนวนเต็มอย่างน้อย 1'],
    productDialog: false,
    savingProduct: false,
    formError: '',
    newProduct: { name: '', description: '', price: '', stock: '', image: '' },
    imagePreview: '',
    searchQuery: '',
    requiredRules: [value => !!value || 'กรุณากรอกข้อมูล'],
    priceRules: [value => value !== '' && Number(value) >= 0 || 'กรุณากรอกราคาตั้งแต่ 0 ขึ้นไป'],
    stockRules: [value => value !== '' && Number.isInteger(Number(value)) && Number(value) >= 0 || 'กรุณากรอกจำนวนเต็มตั้งแต่ 0 ขึ้นไป'],
  }),
  created() {
    this.loadProducts()
  },
  beforeDestroy() {
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview)
  },
  computed: {
    filteredProducts() {
      const query = (this.searchQuery || '').trim().toLowerCase()
      if (!query) return this.products

      return this.products.filter(product => [
        product.name,
        product.title,
        product.description,
        product.sku,
        product.category,
      ].some(value => String(value || '').toLowerCase().includes(query)))
    },
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
        this.failedImages = {}
        this.products = extractCollection(result, 'products')
      } catch (error) {
        this.errorMessage = error.message || 'โหลดรายการสินค้าไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    formatPrice(value) {
      return formatPrice(value)
    },
    getProductImageUrl(product) {
      return getProductImageUrl(product)
    },
    productKey(product, index) {
      return product.id || product._id || product.sku || index
    },
    productId(product) {
      return product.id || product._id
    },
    markImageError(product, index) {
      this.$set(this.failedImages, this.productKey(product, index), true)
    },
    openSaleDialog(product) {
      this.selectedProduct = product
      this.saleQuantity = '1'
      this.saleError = ''
      this.saleDialog = true
    },
    async openProductDetails(product) {
      this.selectedProduct = product
      this.productOrders = []
      this.ordersError = ''
      this.detailsDialog = true
      this.ordersLoading = true
      try {
        const result = await getProductOrders(this.productId(product))
        const orders = extractCollection(result, 'orders')
        const data = result && result.data
        const order = data && !Array.isArray(data) ? data : result
        this.productOrders = orders.length
          ? orders
          : order && (order.productName || order.totalPrice !== undefined)
            ? [order]
            : []
      } catch (error) {
        this.ordersError = error.message || 'โหลดรายละเอียดสินค้าไม่สำเร็จ'
      } finally {
        this.ordersLoading = false
      }
    },
    async submitSale() {
      if (!this.$refs.saleForm.validate()) return

      this.saleError = ''
      this.savingSale = true
      try {
        const productId = this.selectedProduct.id || this.selectedProduct._id
        const result = await recordSale(productId, Number(this.saleQuantity))
        this.saleDialog = false
        this.salesMessage = result.message || 'บันทึกยอดขายเรียบร้อยแล้ว'
        this.salesNotice = true
        await this.loadProducts()
      } catch (error) {
        this.saleError = error.message || 'บันทึกยอดขายไม่สำเร็จ'
      } finally {
        this.savingSale = false
      }
    },
    closeSaleDialog() {
      this.saleDialog = false
      this.saleError = ''
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
        this.salesMessage = result.message || 'เพิ่มสินค้าเรียบร้อยแล้ว'
        this.salesNotice = true
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
.product-search { max-width: 560px; margin-bottom: 28px; }
.products-progress { margin-bottom: 24px; }
.product-card { height: 100%; border-color: #deded9 !important; background: #fff !important; }
.product-card { cursor: pointer; }
.product-image-placeholder { display: flex; height: 210px; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: #eeeee9; color: #888; font-size: 12px; }
.product-card h2 { margin: 0 0 10px; color: #111; font-size: 18px; }
.product-description { color: #777; font-size: 13px; line-height: 1.6; }
.out-of-stock { margin: 8px 0 0; color: #c62828; font-size: 13px; font-weight: 700; }
.product-actions { min-height: 58px; padding: 12px 16px; border-top: 1px solid #eee; }
.product-price { color: #111; font-size: 15px; }
.sale-button { color: #fff !important; background: #111 !important; letter-spacing: 0 !important; }
.sale-product-name { color: #555; }
.details-content h2 { margin-bottom: 10px; color: #111; font-size: 22px; }
.details-content > p { margin: 4px 0; color: #666; }
.details-content h3 { color: #111; font-size: 16px; }
.order-list { padding: 0; }
.sale-actions { display: flex; align-items: center; padding-top: 12px; }
.add-product-button { color: #fff !important; background: #111 !important; letter-spacing: 0 !important; }
.product-form { padding: 0 24px 16px; }
.number-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.image-preview { margin: -8px 0 16px; background: #f5f5f2; }
.dialog-actions { padding: 8px 0 0; }
@media (max-width: 600px) {
  .products-header { align-items: start; flex-wrap: wrap; }
}
</style>
