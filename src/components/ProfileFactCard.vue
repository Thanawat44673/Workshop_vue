<template>
  <article class="fact-card">
    <v-card outlined>
      <v-card-text>
        <p class="fact-index">{{ fact.index }}</p>
        <h3>{{ fact.label }}</h3>
        <template v-if="fact.value1 !== undefined || fact.value2 !== undefined">
          <div v-if="fact.value1 !== undefined" class="fact-value-group">
            <p class="fact-value">{{ fact.value1 }}</p>
            <p v-if="fact.note1" class="fact-note">{{ fact.note1 }}</p>
          </div>
          <div v-if="fact.value2 !== undefined" class="fact-value-group">
            <p class="fact-value">{{ fact.value2 }}</p>
            <p v-if="fact.note2" class="fact-note">{{ fact.note2 }}</p>
          </div>
        </template>
        <template v-else>
          <p class="fact-value">{{ fact.value }}</p>
          <p class="fact-note">
            <template v-if="fact.noteLines">
              <span v-for="(line, index) in fact.noteLines" :key="`${fact.index}-note-${index}`" class="fact-note-line">{{ line }}</span>
            </template>
            <span v-else>{{ fact.note }}</span>
          </p>
        </template>
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
.fact-value-group { margin-bottom: 12px; }
.fact-value { margin: 0 0 5px; color: #333; font-size: 15px; font-weight: 600; }
.fact-note { margin: 0; color: #858585; font-size: 12px; line-height: 1.6; }
.fact-note-line { display: block; }
</style>
