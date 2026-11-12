<template>
  <article class="workshop-page">
    <merchant-navigation />
    <v-container class="workshop-shell py-12 py-md-16">
      <header class="dashboard-header">
        <div>
          <p class="dashboard-kicker">STORE OVERVIEW</p>
          <h1>ภาพรวมร้านค้า</h1>
          <p class="dashboard-intro">จัดการสินค้าและติดตามยอดขายของร้าน</p>
        </div>
      </header>

      <v-alert v-if="pageError" type="error" outlined dense>
        {{ pageError }}
        <v-btn text small @click="loadDashboardData">ลองอีกครั้ง</v-btn>
      </v-alert>
      <v-alert v-if="salesError" type="warning" outlined dense>
        โหลดข้อมูลยอดขายไม่สำเร็จ: {{ salesError }}
      </v-alert>

      <section class="summary-grid" aria-label="สรุปข้อมูลร้านค้า">
        <v-card outlined class="summary-card">
          <span>สินค้าทั้งหมด</span>
          <strong>{{ products.length }}</strong>
          <small>รายการ</small>
        </v-card>
        <v-card outlined class="summary-card">
          <span>จำนวนสินค้าในสต็อก</span>
          <strong>{{ totalStock }}</strong>
          <small>ชิ้น</small>
        </v-card>
        <v-card outlined class="summary-card">
          <span>มูลค่าสต็อกโดยประมาณ</span>
          <strong>{{ formatPrice(stockValue) }}</strong>
          <small>คำนวณจากราคา × จำนวนคงเหลือ</small>
        </v-card>
        <v-card outlined class="summary-card">
          <span>ยอดขายรวม</span>
          <strong>{{ formatPrice(totalSales) }}</strong>
          <small>{{ orders.length }} รายการออเดอร์</small>
        </v-card>
      </section>

      <section class="inventory-section" aria-labelledby="inventory-heading">
        <div class="inventory-heading">
          <h2 id="inventory-heading">จัดการสินค้า</h2>
          <v-btn text :loading="loading" @click="loadDashboardData">รีเฟรช</v-btn>
        </div>
        <v-data-table :headers="headers" :items="products" :loading="loading" no-data-text="ยังไม่มีสินค้า">
          <template slot="item.price" slot-scope="{ item }">{{ formatPrice(item.price) }}</template>
          <template slot="item.isActive" slot-scope="{ item }">
            <v-chip small :color="productStatus(item).color" text-color="white">{{ productStatus(item).label }}</v-chip>
          </template>
          <template slot="item.actions" slot-scope="{ item }">
            <v-btn icon aria-label="แก้ไขสินค้า" @click="startEdit(item)"><v-icon small>mdi-pencil</v-icon></v-btn>
            <v-btn icon color="error" aria-label="ลบสินค้า" @click="confirmDelete(item)"><v-icon small>mdi-delete-outline</v-icon></v-btn>
          </template>
        </v-data-table>
      </section>

      <v-dialog v-model="editDialog" max-width="560">
        <v-card>
          <v-card-title>แก้ไขสินค้า</v-card-title>
          <v-form ref="editForm" class="edit-form" @submit.prevent="saveProduct">
            <v-text-field v-model="editProduct.name" label="ชื่อสินค้า" outlined :rules="requiredRules" />
            <v-textarea v-model="editProduct.description" label="รายละเอียด" rows="3" outlined :rules="requiredRules" />
            <div class="number-fields">
              <v-text-field v-model="editProduct.price" label="ราคา" type="number" min="0" step="0.01" outlined :rules="priceRules" />
              <v-text-field v-model="editProduct.stock" label="จำนวนสินค้า" type="number" min="0" step="1" outlined :rules="stockRules" />
            </div>
            <v-file-input v-model="editProduct.image" label="เปลี่ยนรูปสินค้า (ไม่บังคับ)" accept="image/*" prepend-icon="mdi-camera" outlined />
            <v-alert v-if="formError" type="error" dense text>{{ formError }}</v-alert>
            <v-card-actions class="dialog-actions">
              <v-spacer />
              <v-btn text @click="editDialog = false">ยกเลิก</v-btn>
              <v-btn class="primary-action" type="submit" depressed :loading="saving">บันทึก</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="deleteDialog" max-width="420">
        <v-card>
          <v-card-title>ยืนยันการลบสินค้า</v-card-title>
          <v-card-text>ต้องการลบ “{{ selectedProduct && selectedProduct.name }}” ใช่หรือไม่</v-card-text>
          <v-alert v-if="formError" class="mx-6" type="error" dense text>{{ formError }}</v-alert>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="deleteDialog = false">ยกเลิก</v-btn>
            <v-btn color="error" text :loading="deleting" @click="removeProduct">ลบสินค้า</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="notice" :timeout="3500" color="grey darken-4">{{ noticeMessage }}</v-snackbar>
    </v-container>
  </article>
</template>

<script>
import { deleteProduct, getProducts, updateProduct } from '../services/products'
import { getOrders } from '../services/orders'
import MerchantNavigation from '../components/MerchantNavigation.vue'
import { extractCollection } from '../utils/collections'
import { formatPrice } from '../utils/formatters'
import { getOrderTotal } from '../utils/orders'
import { priceRules, requiredFieldRules, stockRules } from '../utils/validationRules'

export default {
  name: 'DashboardView',
  components: { MerchantNavigation },
  data: () => ({
    products: [],
    orders: [],
    loading: false,
    pageError: '',
    salesError: '',
    headers: [
      { text: 'สินค้า', value: 'name' },
      { text: 'ราคา', value: 'price' },
      { text: 'คงเหลือ', value: 'stock' },
      { text: 'สถานะ', value: 'isActive', sortable: false },
      { text: 'จัดการ', value: 'actions', sortable: false, align: 'end' },
    ],
    editDialog: false,
    deleteDialog: false,
    selectedProduct: null,
    editProduct: { name: '', description: '', price: '', stock: '', image: null },
    saving: false,
    deleting: false,
    formError: '',
    notice: false,
    noticeMessage: '',
    requiredRules: requiredFieldRules,
    priceRules,
    stockRules,
  }),
  computed: {
    totalStock() {
      return this.products.reduce((total, product) => total + Number(product.stock || 0), 0)
    },
    stockValue() {
      return this.products.reduce((total, product) => total + Number(product.price || 0) * Number(product.stock || 0), 0)
    },
    totalSales() {
      return this.orders.reduce((total, order) => total + getOrderTotal(order), 0)
    },
  },
  created() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      this.pageError = ''
      this.salesError = ''
      try {
        const [productsResult, ordersResult] = await Promise.all([
          getProducts().then(data => ({ data })).catch(error => ({ error })),
          getOrders().then(data => ({ data })).catch(error => ({ error })),
        ])

        if (productsResult.error) {
          this.pageError = productsResult.error.message || 'โหลดข้อมูลร้านค้าไม่สำเร็จ'
        } else {
          this.products = extractCollection(productsResult.data, 'products')
        }

        if (ordersResult.error) {
          this.salesError = ordersResult.error.message || 'โหลดข้อมูลยอดขายไม่สำเร็จ'
        } else {
          this.orders = extractCollection(ordersResult.data, 'orders')
        }
      } finally {
        this.loading = false
      }
    },
    formatPrice(value) {
      return formatPrice(value)
    },
    productStatus(product) {
      if (Number(product.stock || 0) <= 0) return { label: 'สินค้าหมด', color: 'red darken-1' }
      if (product.isActive === false || product.isActive === 'false') return { label: 'ปิดขาย', color: 'grey darken-1' }
      return { label: 'กำลังขาย', color: 'green darken-1' }
    },
    productId(product) {
      return product.id || product._id
    },
    startEdit(product) {
      this.selectedProduct = product
      this.editProduct = {
        name: product.name || '',
        description: product.description || '',
        price: product.price !== undefined ? String(product.price) : '',
        stock: product.stock !== undefined ? String(product.stock) : '',
        image: null,
      }
      this.formError = ''
      this.editDialog = true
    },
    async saveProduct() {
      if (!this.$refs.editForm.validate()) return
      this.saving = true
      this.formError = ''
      try {
        const result = await updateProduct(this.productId(this.selectedProduct), {
          name: this.editProduct.name,
          description: this.editProduct.description,
          price: Number(this.editProduct.price),
          stock: Number(this.editProduct.stock),
          image: this.editProduct.image,
        })
        this.editDialog = false
        this.noticeMessage = result.message || 'แก้ไขสินค้าเรียบร้อยแล้ว'
        this.notice = true
        await this.loadDashboardData()
      } catch (error) {
        this.formError = error.message || 'แก้ไขสินค้าไม่สำเร็จ'
      } finally {
        this.saving = false
      }
    },
    confirmDelete(product) {
      this.selectedProduct = product
      this.formError = ''
      this.deleteDialog = true
    },
    async removeProduct() {
      this.deleting = true
      this.formError = ''
      try {
        const result = await deleteProduct(this.productId(this.selectedProduct))
        const deletedProductId = String(this.productId(this.selectedProduct))
        this.products = this.products.filter(product => String(this.productId(product)) !== deletedProductId)
        this.deleteDialog = false
        this.noticeMessage = result.message || 'ลบสินค้าเรียบร้อยแล้ว'
        this.notice = true
      } catch (error) {
        this.formError = error.message || 'ลบสินค้าไม่สำเร็จ'
      } finally {
        this.deleting = false
      }
    },
  },
}
</script>

<style scoped>
.dashboard-header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 40px; }
.dashboard-kicker { margin: 0 0 12px; color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: .16em; }
h1 { margin: 0; font-size: clamp(38px, 6vw, 64px); font-weight: 800; letter-spacing: -.05em; }
.dashboard-intro { margin: 12px 0 0; color: var(--muted); }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 52px; }
.summary-card { display: grid; gap: 8px; padding: 24px; border-color: var(--border) !important; }
.summary-card span { color: var(--muted); font-size: 13px; }
.summary-card strong { color: var(--text); font-size: 30px; }
.summary-card small { color: var(--muted); font-size: 11px; }
.inventory-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.inventory-heading h2 { margin: 0; font-size: 24px; }
.edit-form { padding: 0 24px 16px; }
.number-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.dialog-actions { padding-top: 8px; }
.primary-action { color: var(--on-primary) !important; background: var(--primary) !important; letter-spacing: 0 !important; }
@media (max-width: 700px) {
  .summary-grid { grid-template-columns: 1fr; }
  .dashboard-header { align-items: start; flex-direction: column; }
}
</style>
