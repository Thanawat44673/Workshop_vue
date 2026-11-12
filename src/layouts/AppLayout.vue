<template>
  <div class="site-layout">
    <header>
      <v-app-bar app flat color="white" class="site-bar">
        <router-link class="brand-link" :to="{ name: 'home' }" aria-label="กลับหน้ารวม Workshop">
          <span class="brand-mark">My</span>
          <span class="brand-label">Workshop</span>
        </router-link>
        <v-spacer />
        <nav class="desktop-navigation" aria-label="เมนูหลัก">
          <v-btn :to="{ name: 'home' }" exact text class="nav-button">หน้าแรก</v-btn>
          <v-btn v-if="isAdmin" :to="{ name: 'admin-approvals' }" text class="nav-button">อนุมัติร้านค้า</v-btn>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn text small class="nav-button" v-bind="attrs" v-on="on">
                Workshops <span class="menu-caret" aria-hidden="true">⌄</span>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item v-for="workshop in workshops" :key="workshop.route" :to="{ name: workshop.route }">
                <v-list-item-title>Workshop {{ workshop.number }} · {{ workshop.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn v-if="isAuthenticated" text class="nav-button" @click="signOut">ออกจากระบบ</v-btn>
        </nav>
        <div class="mobile-menu-wrapper">
          <v-menu v-model="mobileMenuOpen" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon aria-label="เปิดเมนูนำทาง" v-bind="attrs" v-on="on">
                <v-icon>mdi-menu</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item :to="{ name: 'home' }" exact>
                <v-list-item-title>หน้าแรก</v-list-item-title>
              </v-list-item>
              <v-list-item v-if="isAdmin" :to="{ name: 'admin-approvals' }">
                <v-list-item-title>อนุมัติร้านค้า</v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-subheader>Workshops</v-subheader>
              <v-list-item v-for="workshop in workshops" :key="workshop.route" :to="{ name: workshop.route }">
                <v-list-item-title>Workshop {{ workshop.number }} · {{ workshop.title }}</v-list-item-title>
              </v-list-item>
              <template v-if="isAuthenticated">
                <v-divider />
                <v-list-item @click="signOut">
                  <v-list-item-title>ออกจากระบบ</v-list-item-title>
                </v-list-item>
              </template>
            </v-list>
          </v-menu>
        </div>
      </v-app-bar>
    </header>
    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { workshops } from '../data/portfolio'
import { clearAuthSession, getAuthToken, isAdmin } from '../services/auth'

export default {
  name: 'AppLayout',
  data: () => ({ workshops, isAuthenticated: Boolean(getAuthToken()), isAdmin: isAdmin(), mobileMenuOpen: false }),
  watch: {
    '$vuetify.breakpoint.mdAndUp'(isDesktop) {
      if (isDesktop) this.mobileMenuOpen = false
    },
  },
  created() {
    this.handleAuthChange = () => {
      this.isAuthenticated = Boolean(getAuthToken())
      this.isAdmin = isAdmin()
    }
    window.addEventListener('auth-changed', this.handleAuthChange)
  },
  beforeDestroy() {
    window.removeEventListener('auth-changed', this.handleAuthChange)
  },
  methods: {
    signOut() {
      this.mobileMenuOpen = false
      clearAuthSession()
      this.$router.push({ name: 'workshop-three' })
    },
  },
}
</script>

<style scoped>
.site-bar { border-bottom: 1px solid var(--border) !important; background: var(--secondary) !important; }
.brand-link { display: inline-flex; align-items: center; color: var(--text); text-decoration: none; }
.brand-mark { margin-right: 10px; font-size: 35px; font-weight: 900; letter-spacing: -.1em; }
.brand-mark span { color: var(--primary); }
.brand-label { font-size: 15px; font-weight: 500; letter-spacing: .16em; }
.nav-button { margin-left: 8px; color: var(--text) !important; letter-spacing: .02em; }
.nav-button:hover { color: var(--primary) !important; }
.menu-caret { margin-left: 7px; font-size: 15px; }
.mobile-menu-wrapper { display: none; }
@media (max-width: 959px) {
  .desktop-navigation { display: none; }
  .mobile-menu-wrapper { display: block; }
}
</style>
