<template>
  <article class="workshop-page">
    <v-container class="workshop-shell py-12 py-md-16">
      <header>
        <router-link class="workshop-back-link" :to="{ name: 'home' }">← กลับหน้า Workshop</router-link>
        <section-heading class="profile-heading mt-12" level="h1" eyebrow="WORKSHOP 01 / ABOUT ME">
          สวัสดีครับ<br>ผมชื่อ {{ profile.name }}
        </section-heading>
        <p class="intro">ชื่อเล่น <strong>{{ profile.nickname }}</strong>{{ profile.introduction }}</p>
      </header>

      <section class="facts-section mt-10" aria-label="ข้อมูลแนะนำตัว">
        <section-heading eyebrow="A LITTLE ABOUT ME">
          รู้จักตัวตนของผม<span>ในไม่กี่บรรทัด</span>
        </section-heading>
        <v-row>
          <v-col v-for="fact in profile.facts" :key="fact.label" cols="12" sm="6" md="3">
            <profile-fact-card :fact="fact" />
          </v-col>
        </v-row>
      </section>

      <nav class="next-workshop" aria-label="ไปยัง Workshop ถัดไป">
        <span></span>
        <v-btn text :to="{ name: 'workshop-two' }">ไป Workshop 02 →</v-btn>
      </nav>
    </v-container>
  </article>
</template>

<script>
import ProfileFactCard from '../components/ProfileFactCard.vue'
import SectionHeading from '../components/SectionHeading.vue'
import { profile } from '../data/portfolio'

export default {
  name: 'ProfileWorkshopView',
  components: { ProfileFactCard, SectionHeading },
  data: () => ({ profile }),
}
</script>

<style scoped>
.profile-heading ::v-deep .heading-text { margin-bottom: 0; font-size: clamp(42px, 7vw, 76px); }
.profile-heading ::v-deep .heading-text span { color: inherit; text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 8px; }
.intro { max-width: 490px; margin: 14px 0 0; color: var(--muted); font-size: 20px; line-height: 1.9; }
.intro strong { color: var(--text); }
</style>
