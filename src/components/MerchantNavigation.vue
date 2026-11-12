<template>
  <section class="merchant-navigation-band">
    <v-container class="merchant-navigation-shell">
      <nav class="merchant-navigation-links" aria-label="เมนูจัดการร้านค้า">
        <v-btn
          v-for="link in links"
          :key="link.route"
          text
          rounded
          :to="{ name: link.route }"
          :class="{ 'merchant-nav-active': $route.name === link.route }"
        >
          {{ link.label }}
        </v-btn>
      </nav>
    </v-container>
  </section>
</template>

<script>
const links = [
  { route: 'dashboard', label: 'ภาพรวมร้านค้า' },
  { route: 'products', label: 'สินค้าทั้งหมด' },
  { route: 'orders', label: 'ออเดอร์' },
]

export default {
  name: 'MerchantNavigation',
  data: () => ({ links }),
}
</script>

<style scoped>
.merchant-navigation-band { width: 100%;}
.merchant-navigation-shell { display: flex; max-width: 1000px; justify-content: center; padding-top: 12px; padding-bottom: 12px; }
.merchant-navigation-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.merchant-navigation-links .v-btn { min-width: 180px; height: 44px; border: 2.5px solid orange; border-radius: 999px !important; color: var(--text) !important; letter-spacing: 0; }
.merchant-navigation-links .merchant-nav-active,
.merchant-navigation-links .v-btn:hover {color: var(--primary) !important; }
@media (max-width: 600px) {
  .merchant-navigation-shell { padding-top: 10px; padding-bottom: 10px; }
  .merchant-navigation-links { width: 100%; gap: 8px; }
  .merchant-navigation-links .v-btn { min-width: 0; flex: 1 1 120px; }
}
</style>
