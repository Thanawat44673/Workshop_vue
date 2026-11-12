<template>
  <div class="home-page">
    <v-container class="home-shell py-12 py-md-16">
      <header class="home-heading">
        <div>
          <p class="eyebrow">WORKSHOP COLLECTION <span>—</span> 2026</p>
          <h1>พื้นที่รวม<br><span>Workshop</span></h1>
        </div>
        <p>เลือกดูเนื้อหาจาก Workshop ทั้ง 3 หน้าได้ที่นี่</p>
      </header>

      <nav class="workshop-grid" aria-label="เลือกหน้า Workshop">
        <v-row>
          <v-col v-for="workshop in workshops" :key="workshop.number" cols="12" md="4">
            <workshop-link-card :workshop="workshop" />
          </v-col>
        </v-row>
      </nav>

      <footer class="home-footer">
        <span>WORKSHOP COLLECTION</span>
      </footer>
    </v-container>
  </div>
</template>

<script>
import WorkshopLinkCard from '../components/WorkshopLinkCard.vue'
import { workshops } from '../data/portfolio'

export default {
  name: 'HomeView',
  components: { WorkshopLinkCard },
  data: () => ({ workshops }),
}
</script>

<style scoped>
.home-page { min-height: 100vh; color: var(--text); background: var(--background); font-family: 'Inter', 'Noto Sans Thai', sans-serif; }
.home-shell { max-width: 1180px; }
.eyebrow { margin: 0 0 36px; color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .18em; padding: 0px 0px 48px 0px;}
.eyebrow span { color: var(--primary); }
.home-heading { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 56px; }
.home-heading h1 { margin: 0; font-size: clamp(48px, 8vw, 88px); font-weight: 800; letter-spacing: -.06em; line-height: 1.08; }
.home-heading h1 span { color: var(--primary); }
.home-heading p { max-width: 300px; margin: 0 0 8px; color: var(--muted); font-size: 15px; line-height: 1.8; }
.workshop-grid { margin-bottom: 70px; }
.home-footer { display: flex; justify-content: space-between; padding: 20px 0; border-top: 1px solid var(--border); color: var(--muted); font-size: 10px; letter-spacing: .08em; }
.home-footer b { color: var(--primary); }
@media (max-width: 700px) {
  .home-heading { display: block; margin-bottom: 34px; }
  .home-heading p { margin-top: 18px; }
  .home-footer { gap: 14px; flex-wrap: wrap; }
}
</style>
