<template>
  <article class="workshop-page">
    <merchant-navigation />
    <v-container class="workshop-shell py-12 py-md-16">
      <header class="orders-header">
        <div>
          <p class="orders-kicker">E-COMMERCE / ORDERS</p>
          <h1>ออเดอร์ลูกค้า</h1>
          <p class="orders-intro">รายการออเดอร์และสินค้าที่ลูกค้าสั่งซื้อ</p>
        </div>
        <v-btn text :loading="loading" @click="loadOrders">รีเฟรช</v-btn>
      </header>

      <div class="orders-filters">
        <SearchField
          v-model="searchQuery"
          label="ค้นหาออเดอร์"
          placeholder="ชื่อสินค้า"
        />
      </div>

      <v-alert v-if="errorMessage" type="error" outlined dense role="alert" aria-live="assertive">
        {{ errorMessage }}
        <v-btn text small @click="loadOrders">ลองอีกครั้ง</v-btn>
      </v-alert>

      <v-data-table
        v-else
        class="orders-table"
        :headers="headers"
        :items="filteredOrders"
        :loading="loading"
        no-data-text="ไม่พบออเดอร์"
        :footer-props="{ itemsPerPageOptions: [10, 25, 50] }"
      >
        <template slot="item.sequence" slot-scope="{ item }">{{ orderSequence(item) }}</template>
        <template slot="item.productName" slot-scope="{ item }">{{ productNames(item) }}</template>
        <template slot="item.quantity" slot-scope="{ item }">{{ orderQuantity(item) }}</template>
        <template slot="item.unitPrice" slot-scope="{ item }">{{ orderUnitPrices(item) }}</template>
        <template slot="item.total" slot-scope="{ item }">{{ formatPrice(orderTotal(item)) }}</template>
        <template slot="item.createdAt" slot-scope="{ item }">{{ formatDate(item.createdAt || item.orderDate) }}</template>
      </v-data-table>
    </v-container>
  </article>
</template>

<script>
import { getOrders } from '../services/orders'
import MerchantNavigation from '../components/MerchantNavigation.vue'
import SearchField from '../components/SearchField.vue'
import { extractCollection } from '../utils/collections'
import { formatPrice } from '../utils/formatters'
import { getOrderProductNames, getOrderQuantity, getOrderTotal, getOrderUnitPrices } from '../utils/orders'

export default {
  name: 'OrdersView',
  components: { MerchantNavigation, SearchField },
  data: () => ({
    orders: [],
    loading: false,
    errorMessage: '',
    searchQuery: '',
    headers: [
      { text: 'ลำดับ', value: 'sequence', sortable: false },
      { text: 'สินค้า', value: 'productName' },
      { text: 'จำนวนที่สั่ง', value: 'quantity' },
      { text: 'ราคาต่อชิ้น', value: 'unitPrice' },
      { text: 'ยอดรวม', value: 'total' },
      { text: 'วันที่', value: 'createdAt' },
    ],
  }),
  computed: {
    filteredOrders() {
      const query = (this.searchQuery || '').trim().toLowerCase()
      return this.orders.filter(order => {
        const matchesQuery = !query || [
          this.productNames(order),
        ].some(value => String(value || '').toLowerCase().includes(query))
        return matchesQuery
      })
    },
  },
  created() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      this.loading = true
      this.errorMessage = ''
      try {
        const result = await getOrders()
        this.orders = extractCollection(result, 'orders')
      } catch (error) {
        this.errorMessage = error.message || 'โหลดรายการออเดอร์ไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    orderSequence(order) {
      return this.orders.indexOf(order) + 1
    },
    productNames(order) {
      return getOrderProductNames(order)
    },
    orderQuantity(order) {
      return getOrderQuantity(order)
    },
    orderUnitPrices(order) {
      return getOrderUnitPrices(order)
    },
    orderTotal(order) {
      return getOrderTotal(order)
    },
    formatPrice(value) {
      return formatPrice(value)
    },
    formatDate(value) {
      if (!value) return '—'
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? value : date.toLocaleString('th-TH')
    },
  },
}
</script>

<style scoped>
.orders-header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 32px; }
.orders-kicker { margin: 0 0 12px; color: var(--muted); font-size: 10px; font-weight: 700; letter-spacing: .16em; }
h1 { margin: 0; font-size: clamp(38px, 6vw, 64px); font-weight: 800; letter-spacing: -.05em; }
.orders-intro { margin: 12px 0 0; color: var(--muted); }
.orders-filters { max-width: 480px; margin-bottom: 24px; }
.orders-table { border: 1px solid var(--border); }
@media (max-width: 700px) {
  .orders-header { align-items: start; flex-direction: column; }
}
</style>
