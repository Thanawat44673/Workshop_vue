<template>
  <div class="section-heading">
    <p class="eyebrow">{{ eyebrow }}</p>
    <component :is="level" class="heading-text"><slot /></component>
  </div>
</template>

<script>
export default {
  name: 'SectionHeading',
  props: {
    eyebrow: { type: String, required: true },
    level: { type: String, default: 'h2' },
  },
}
</script>

<style scoped>
.eyebrow { margin: 0 0 18px; color: var(--muted); font-size: 11px; font-weight: 700; letter-spacing: .18em; }
.heading-text { margin: 0 0 28px; font-size: clamp(32px, 4vw, 48px); font-weight: 800; letter-spacing: -.045em; line-height: 1.18; }
.heading-text ::v-deep span { color: var(--muted); }
</style>
