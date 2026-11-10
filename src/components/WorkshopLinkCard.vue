<template>
  <v-card class="workshop-card" :to="{ name: workshop.route }" outlined>
    <v-card-text>
      <div class="workshop-topline">
        <span>WORKSHOP {{ workshop.number }}</span>
        <span class="card-arrow">↗</span>
      </div>
      <h3>{{ workshop.title }}</h3>
      <p>{{ workshop.description }}</p>
    </v-card-text>
    <v-card-actions>
      <span>เปิดหน้านี้</span>
      <v-spacer />
      <span class="action-arrow">→</span>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'WorkshopLinkCard',
  props: {
    workshop: { type: Object, required: true },
  },
}
</script>

<style scoped>
.workshop-card { height: 100%; border-color: #d8d8d3 !important; background: #fff !important; transition: transform .2s ease, border-color .2s ease; }
.workshop-card:hover { transform: translateY(-5px); border-color: #111 !important; }
.workshop-card .v-card__text { min-height: 175px; padding: 22px 22px 16px; }
.workshop-topline { display: flex; justify-content: space-between; margin-bottom: 26px; color: #888; font-size: 10px; font-weight: 700; letter-spacing: .13em; }
.card-arrow { color: #111; font-size: 18px; }
h3 { margin-bottom: 8px; color: #111; font-size: 22px; font-weight: 700; }
.workshop-card p { margin: 0; color: #777; font-size: 13px; line-height: 1.6; }
.workshop-card .v-card__actions { padding: 14px 22px; border-top: 1px solid #eee; color: #555; font-size: 12px; }
.action-arrow { color: #111; font-size: 18px; }
</style>
