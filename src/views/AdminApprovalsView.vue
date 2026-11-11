<template>
  <article class="workshop-page">
    <v-container class="workshop-shell py-12 py-md-16">
      <header class="approvals-header">
        <div>
          <p class="approvals-kicker">ADMIN / STORE APPROVALS</p>
          <h1>อนุมัติร้านค้า</h1>
          <p class="approvals-intro">ตรวจสอบบัญชีร้านค้าที่สมัครเข้ามาและอนุมัติการเข้าใช้งาน</p>
        </div>
        <v-btn text :loading="loading" @click="loadPendingUsers">รีเฟรช</v-btn>
      </header>

      <v-alert v-if="errorMessage" type="error" outlined dense role="alert" aria-live="assertive">
        {{ errorMessage }}
        <v-btn text small @click="loadPendingUsers">ลองอีกครั้ง</v-btn>
      </v-alert>

      <v-progress-linear v-if="loading" class="approvals-progress" indeterminate color="black" />

      <v-data-table
        class="approvals-table"
        :headers="headers"
        :items="pendingUsers"
        :loading="loading"
        item-key="_id"
        no-data-text="ไม่มีบัญชีร้านค้าที่รออนุมัติ"
        :footer-props="{ itemsPerPageOptions: [10, 25, 50] }"
      >
        <template slot="item.username" slot-scope="{ item }">
          <strong>{{ userName(item) }}</strong>
        </template>
        <template slot="item.email" slot-scope="{ item }">
          {{ item.email || '—' }}
        </template>
        <template slot="item.createdAt" slot-scope="{ item }">
          {{ formatDate(item.createdAt || item.created_at || item.registeredAt) }}
        </template>
        <template slot="item.actions" slot-scope="{ item }">
          <v-btn
            color="black"
            dark
            small
            depressed
            :disabled="Boolean(approvingUserId)"
            :loading="approvingUserId === userId(item)"
            @click="approve(item)"
          >
            อนุมัติร้านค้า
          </v-btn>
        </template>
      </v-data-table>

      <v-snackbar v-model="notice" :timeout="3500" color="grey darken-4" role="status">
        {{ noticeMessage }}
      </v-snackbar>
    </v-container>
  </article>
</template>

<script>
import { approveUser, getPendingUsers } from '../services/users'
import { extractCollection } from '../utils/collections'

export default {
  name: 'AdminApprovalsView',
  data: () => ({
    pendingUsers: [],
    loading: false,
    errorMessage: '',
    approvingUserId: null,
    notice: false,
    noticeMessage: '',
    headers: [
      { text: 'ชื่อบัญชีร้านค้า', value: 'username' },
      { text: 'วันที่สมัคร', value: 'createdAt' },
      { text: 'จัดการ', value: 'actions', sortable: false, align: 'end' },
    ],
  }),
  created() {
    this.loadPendingUsers()
  },
  methods: {
    async loadPendingUsers() {
      this.loading = true
      this.errorMessage = ''
      try {
        const result = await getPendingUsers()
        this.pendingUsers = extractCollection(result, ['users', 'pendingUsers'])
      } catch (error) {
        this.errorMessage = error.message || 'โหลดบัญชีร้านค้าที่รออนุมัติไม่สำเร็จ'
      } finally {
        this.loading = false
      }
    },
    userId(user) {
      return user.id || user._id || user.userId
    },
    userName(user) {
      return user.username || user.name || user.email || this.userId(user) || 'ไม่ระบุชื่อบัญชี'
    },
    formatDate(value) {
      if (!value) return '—'
      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? value : date.toLocaleString('th-TH')
    },
    async approve(user) {
      const id = this.userId(user)
      this.approvingUserId = id
      try {
        const result = await approveUser(id)
        this.pendingUsers = this.pendingUsers.filter(item => String(this.userId(item)) !== String(id))
        this.noticeMessage = result.message || `อนุมัติบัญชี ${this.userName(user)} เรียบร้อยแล้ว`
        this.notice = true
      } catch (error) {
        this.errorMessage = error.message || 'อนุมัติบัญชีร้านค้าไม่สำเร็จ'
      } finally {
        this.approvingUserId = null
      }
    },
  },
}
</script>

<style scoped>
.approvals-header { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 32px; }
.approvals-kicker { margin: 0 0 12px; color: #888; font-size: 10px; font-weight: 700; letter-spacing: .16em; }
h1 { margin: 0; font-size: clamp(38px, 6vw, 64px); font-weight: 800; letter-spacing: -.05em; }
.approvals-intro { margin: 12px 0 0; color: #777; }
.approvals-progress { margin-bottom: 20px; }
.approvals-table { border: 1px solid #deded9; background: #fff; }
@media (max-width: 700px) {
  .approvals-header { align-items: start; flex-direction: column; }
}
</style>
