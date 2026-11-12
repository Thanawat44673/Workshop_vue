<template>
  <article class="workshop-page auth-page">
    <section class="auth-layout" aria-label="เข้าสู่ระบบหรือสมัครสมาชิก">
      <div class="auth-panel">
        <div class="auth-content">
          <h1>{{ activeTab === 0 ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีผู้ใช้' }}</h1>
          <p class="auth-subtitle">
            {{ activeTab === 0 ? 'เข้าสู่ระบบเพื่อดำเนินการต่อ' : 'สมัครสมาชิกเพื่อเริ่มต้นใช้งาน' }}
          </p>

          <v-form v-if="activeTab === 0" ref="loginForm" class="auth-form" @submit.prevent="submitAuth('login')">
            <v-text-field
              v-model="login.username"
              label="ชื่อผู้ใช้งาน"
              autocomplete="username"
              outlined
              :rules="requiredRules"
              hide-details="auto"
            />
            <v-text-field
              v-model="login.password"
              label="รหัสผ่าน"
              :type="showLoginPassword ? 'text' : 'password'"
              :append-icon="showLoginPassword ? 'mdi-eye-off' : 'mdi-eye'"
              autocomplete="current-password"
              outlined
              :rules="requiredRules"
              hide-details="auto"
              @click:append="showLoginPassword = !showLoginPassword"
            />
            <v-btn class="auth-submit" type="submit" block large depressed :loading="loading">
              เข้าสู่ระบบ
            </v-btn>
          </v-form>

          <v-form v-else ref="registerForm" class="auth-form" @submit.prevent="submitAuth('register')">
            <v-text-field
              v-model="registration.username"
              label="ชื่อผู้ใช้งาน"
              autocomplete="username"
              outlined
              :rules="requiredRules"
              hide-details="auto"
            />
            <v-text-field
              v-model="registration.password"
              label="รหัสผ่าน"
              :type="showRegistrationPassword ? 'text' : 'password'"
              :append-icon="showRegistrationPassword ? 'mdi-eye-off' : 'mdi-eye'"
              autocomplete="new-password"
              outlined
              :rules="requiredRules"
              hide-details="auto"
              @click:append="showRegistrationPassword = !showRegistrationPassword"
            />
            <v-btn class="auth-submit" type="submit" block large depressed :loading="loading">
              สร้างบัญชี
            </v-btn>
          </v-form>

          <v-alert v-if="feedback" class="auth-feedback" :type="feedbackType" dense text role="status" aria-live="polite">
            {{ feedback }}
          </v-alert>

          <p class="auth-switch">
            {{ activeTab === 0 ? 'ยังไม่มีบัญชีใช่ไหม' : 'มีบัญชีอยู่แล้วใช่ไหม' }}
            <a href="#" @click.prevent="toggleAuthMode">{{ activeTab === 0 ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ' }}</a>
          </p>
        </div>
      </div>

      <aside class="auth-brand-panel" aria-label="ข้อมูล Workshop">
        <div class="brand-copy">
          <p class="brand-eyebrow">MY WORKSHOP</p>
          <div class="brand-number" aria-hidden="true">{{ number }}</div>
          <h2>{{ title }}</h2>
          <p class="brand-description">{{ description }}</p>
          <span class="brand-caption">ร้านค้าออนไลน์ของคุณเริ่มต้นที่นี่</span>
        </div>
      </aside>
    </section>
  </article>
</template>

<script>
import { authenticate, getAuthToken, isAdmin } from '../services/auth'

export default {
  name: 'WorkshopPage',
  data: () => ({
    activeTab: 0,
    loading: false,
    showLoginPassword: false,
    showRegistrationPassword: false,
    feedback: '',
    feedbackType: 'info',
    login: { username: '', password: '' },
    registration: { username: '', password: '' },
    requiredRules: [value => !!value || 'กรุณากรอกข้อมูล'],
  }),
  props: {
    number: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  created() {
    if (getAuthToken()) this.$router.replace({ name: isAdmin() ? 'admin-approvals' : 'dashboard' })
  },
  methods: {
    toggleAuthMode() {
      this.activeTab = this.activeTab === 0 ? 1 : 0
      this.feedback = ''
    },
    async submitAuth(action) {
      const form = action === 'login' ? this.$refs.loginForm : this.$refs.registerForm
      if (!form.validate()) return

      this.feedback = ''
      this.loading = true
      try {
        const payload = action === 'login' ? this.login : this.registration
        const result = await authenticate(action, payload)
        this.feedbackType = 'success'
        this.feedback = result.message || (action === 'login' ? 'เข้าสู่ระบบสำเร็จ' : 'สมัครสมาชิกสำเร็จ')
        if (action === 'login') await this.$router.push({ name: isAdmin() ? 'admin-approvals' : 'dashboard' })
      } catch (error) {
        this.feedbackType = 'error'
        this.feedback = error.message || 'เชื่อมต่อระบบไม่สำเร็จ กรุณาลองอีกครั้ง'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.auth-page { min-height: calc(100vh - 64px); background: var(--surface); font-family: 'Noto Sans Thai', 'Inter', sans-serif; }
.auth-layout { display: grid; min-height: calc(100vh - 64px); grid-template-areas: 'brand form'; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.auth-panel { display: flex; grid-area: form; align-items: center; justify-content: center; padding: 64px clamp(28px, 8vw, 112px); background: var(--surface); }
.auth-content { width: 100%; max-width: 410px; }
.auth-kicker { margin: 0 0 18px; color: var(--muted); font-size: 14px; font-weight: 700; letter-spacing: normal; }
.auth-content h1 { margin: 0 0 8px; color: var(--text); font-size: clamp(30px, 3.2vw, 40px); font-weight: 700; letter-spacing: normal; line-height: 1.3; }
.auth-subtitle { margin: 0 0 30px; color: var(--muted); font-size: 16px; line-height: 1.7; }
.auth-form { display: grid; gap: 8px; }
.auth-form ::v-deep .v-input { margin-bottom: 2px; }
.auth-form ::v-deep .v-input__slot { background: #FAF3E1 !important; }
.auth-form ::v-deep input { font-size: 16px; letter-spacing: normal; }
.auth-form ::v-deep .v-label { color: var(--text); font-size: 16px; font-weight: 500; letter-spacing: normal; }
.auth-submit { min-height: 50px; margin-top: 8px; color: var(--on-primary) !important; background: var(--primary) !important; font-size: 16px; font-weight: 700; letter-spacing: 0 !important; text-transform: none; }
.auth-feedback { margin-top: 20px; }
.auth-switch { margin: 28px 0 0; color: var(--text); font-size: 15px; line-height: 1.7; }
.auth-switch a { margin-left: 4px; color: var(--primary); font-weight: 700; text-decoration: none; }
.auth-switch a:hover { text-decoration: underline; }
.auth-brand-panel { display: flex; grid-area: brand; align-items: center; justify-content: center; min-height: 100%; padding: 72px 48px; background: var(--secondary); text-align: center; }
.brand-copy { max-width: 460px; }
.brand-eyebrow { margin-bottom: 36px; }
.brand-number { color: var(--primary); font-size: clamp(100px, 20vw, 220px); font-weight: 900; letter-spacing: -.1em; line-height: .82; }
.brand-copy h2 { margin: 32px 0 10px; color: var(--text); font-size: clamp(28px, 4vw, 46px); font-weight: 800; letter-spacing: -.05em; line-height: 1.12; white-space: pre-line; }
.brand-description { max-width: 360px; margin: 0 auto; color: var(--muted); font-size: 15px; line-height: 1.7; }
.brand-caption { display: inline-block; margin-top: 42px; padding-top: 14px; border-top: 1px solid var(--border); color: var(--muted); font-size: 15px; font-weight: 700; letter-spacing: normal; }
@media (max-width: 760px) {
  .auth-page, .auth-layout { min-height: auto; }
  .auth-layout { grid-template-areas: 'form' 'brand'; grid-template-columns: 1fr; }
  .auth-panel { min-height: calc(100vh - 64px); padding: 48px 28px; }
  .auth-brand-panel { min-height: 340px; padding: 48px 28px; }
  .brand-number { font-size: 112px; }
  .brand-copy h2 { margin-top: 22px; }
  .brand-eyebrow { margin-bottom: 28px; }
}
</style>
