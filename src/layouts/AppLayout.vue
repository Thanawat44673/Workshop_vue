<template>
  <div class="site-layout">
    <header>
      <v-app-bar app flat color="white" class="site-bar">
        <router-link class="brand-link" :to="{ name: 'home' }" aria-label="กลับหน้ารวม Workshop">
          <span class="brand-mark">My</span>
          <span class="brand-label">Workshop</span>
        </router-link>
        <v-spacer />
        <nav aria-label="เมนูหลัก">
          <v-btn :to="{ name: 'home' }" text small class="nav-button">หน้าแรก</v-btn>
          <v-btn v-if="isAuthenticated" :to="{ name: 'products' }" text small class="nav-button">สินค้าทั้งหมด</v-btn>
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
          <v-btn v-if="isAuthenticated" text small class="nav-button" @click="signOut">ออกจากระบบ</v-btn>
        </nav>
      </v-app-bar>
    </header>
    <v-main>
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { workshops } from '../data/portfolio'
import { clearAuthSession, getAuthToken } from '../services/auth'

export default {
  name: 'AppLayout',
  data: () => ({ workshops, isAuthenticated: Boolean(getAuthToken()) }),
  created() {
    this.handleAuthChange = () => {
      this.isAuthenticated = Boolean(getAuthToken())
    }
    window.addEventListener('auth-changed', this.handleAuthChange)
  },
  beforeDestroy() {
    window.removeEventListener('auth-changed', this.handleAuthChange)
  },
  methods: {
    signOut() {
      clearAuthSession()
      this.$router.push({ name: 'workshop-three' })
    },
  },
}
</script>

<style scoped>
.site-bar { border-bottom: 1px solid #e9e9e6 !important; }
.brand-link { display: inline-flex; align-items: center; color: #111; text-decoration: none; }
.brand-mark { margin-right: 10px; font-size: 25px; font-weight: 900; letter-spacing: -.1em; }
.brand-mark span { color: #888; }
.brand-label { font-size: 9px; font-weight: 700; letter-spacing: .16em; }
.nav-button { margin-left: 8px; color: #333 !important; letter-spacing: .02em; }
.menu-caret { margin-left: 7px; font-size: 15px; }
</style>
