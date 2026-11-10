<template>
  <article class="workshop-page">
    <v-container class="workshop-shell py-12 py-md-16">
      <header>
        <router-link class="workshop-back-link" :to="{ name: 'home' }">← กลับหน้า Workshop</router-link>
        <section-heading class="page-heading mt-12" level="h1" :eyebrow="`PERSONAL PORTFOLIO / WORKSHOP ${number}`">
          {{ title }}
        </section-heading>
        <p class="intro">{{ description }}</p>
      </header>

      <section class="auth-section mt-10" aria-label="เข้าสู่ระบบหรือสมัครสมาชิก">
        <div class="auth-intro">
          <p class="auth-kicker">YOUR E-COMMERCE ACCOUNT</p>
          <h2>เริ่มต้นใช้งานร้านค้าออนไลน์</h2>
          <p>เข้าสู่ระบบเพื่อใช้งานต่อ หรือสมัครสมาชิกเพื่อสร้างบัญชีใหม่</p>
        </div>

        <v-card class="auth-card" outlined>
          <v-tabs v-model="activeTab" grow>
            <v-tab>เข้าสู่ระบบ</v-tab>
            <v-tab>สมัครสมาชิก</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item>
              <v-form ref="loginForm" class="auth-form" @submit.prevent="submitAuth('login')">
                <v-text-field v-model="login.username" label="ชื่อผู้ใช้" autocomplete="username" outlined :rules="requiredRules" />
                <v-text-field v-model="login.password" label="รหัสผ่าน" type="password" autocomplete="current-password" outlined :rules="requiredRules" />
                <v-btn class="auth-submit" type="submit" block large depressed :loading="loading">เข้าสู่ระบบ</v-btn>
              </v-form>
            </v-tab-item>

            <v-tab-item>
              <v-form ref="registerForm" class="auth-form" @submit.prevent="submitAuth('register')">
                <v-text-field v-model="registration.username" label="ชื่อผู้ใช้" autocomplete="username" outlined :rules="requiredRules" />
                <v-text-field v-model="registration.password" label="รหัสผ่าน" type="password" autocomplete="new-password" outlined :rules="requiredRules" />
                <v-btn class="auth-submit" type="submit" block large depressed :loading="loading">สมัครสมาชิก</v-btn>
              </v-form>
            </v-tab-item>
          </v-tabs-items>

          <v-alert v-if="feedback" class="auth-feedback" :type="feedbackType" dense text role="status" aria-live="polite">
            {{ feedback }}
          </v-alert>
        </v-card>
      </section>

    </v-container>
  </article>
</template>

<script>
import SectionHeading from '../components/SectionHeading.vue'
import { authenticate, getAuthToken } from '../services/auth'

export default {
  name: 'WorkshopPage',
  components: { SectionHeading },
  data: () => ({
    activeTab: 0,
    loading: false,
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
    if (getAuthToken()) this.$router.replace({ name: 'products' })
  },
  methods: {
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
        if (action === 'login') {
          await this.$router.push({ name: 'products' })
        }
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
.page-heading ::v-deep .heading-text { margin-bottom: 0; font-size: clamp(42px, 7vw, 76px); }
.intro { margin-top: 14px; color: #777; font-size: 16px; }
.auth-section { display: grid; grid-template-columns: 1fr minmax(320px, 440px); gap: 64px; align-items: start; }
.auth-kicker { margin: 0 0 14px; color: #888; font-size: 10px; font-weight: 700; letter-spacing: .16em; }
.auth-intro h2 { margin: 0 0 12px; font-size: clamp(24px, 3vw, 34px); font-weight: 800; }
.auth-intro > p:last-child { max-width: 360px; color: #777; line-height: 1.8; }
.auth-card { border-color: #deded9 !important; background: #fff !important; }
.auth-form { display: grid; gap: 4px; padding: 28px 24px 22px; }
.auth-submit { color: #fff !important; background: #111 !important; letter-spacing: 0 !important; }
.auth-feedback { margin: 0 24px 20px; }
@media (max-width: 760px) {
  .auth-section { grid-template-columns: 1fr; gap: 28px; }
}
</style>
