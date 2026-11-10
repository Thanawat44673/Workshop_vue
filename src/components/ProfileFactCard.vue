<template>
  <article class="fact-card">
    <v-card outlined>
      <v-card-text>
        <p class="fact-index">{{ fact.index }}</p>
        <h3>{{ fact.label }}</h3>
        <p class="fact-value">{{ fact.value }}</p>
        <p class="fact-note">{{ fact.note }}</p>
      </v-card-text>
    </v-card>
  </article>
</template>

<script>
export default {
  name: 'ProfileFactCard',
  props: {
    fact: { type: Object, required: true },
  },
}
</script>

<style scoped>
.fact-card { height: 100%; border-color: #deded9 !important; background: transparent !important; }
.fact-card .v-card__text { padding: 22px 20px 24px; }
.fact-index { margin-bottom: 30px; color: #888; font-size: 9px; font-weight: 700; letter-spacing: .13em; }
h3 { margin-bottom: 12px; font-size: 20px; font-weight: 700; }
.fact-value { margin-bottom: 5px; color: #333; font-size: 15px; font-weight: 600; }
.fact-note { margin: 0; color: #858585; font-size: 12px; line-height: 1.6; }
</style>
