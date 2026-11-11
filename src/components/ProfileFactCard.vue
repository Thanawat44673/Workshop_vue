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
          <div v-if="fact.teams && fact.teams.length" class="fact-team-list">
            <div v-for="(team, teamIndex) in fact.teams" :key="`${fact.index}-team-${teamIndex}`" class="fact-media-row">
              <div class="fact-image-slot">
                <img v-if="team.imageUrl" :src="team.imageUrl" :alt="`ตราสโมสร${team.name || ''}`">
                <span v-else>รูปทีม</span>
              </div>
              <p class="fact-team-name">{{ team.name || 'เพิ่มชื่อทีม' }}</p>
            </div>
            <p v-if="fact.note" class="fact-note">{{ fact.note }}</p>
          </div>
          <template v-else>
            <p class="fact-value">{{ fact.value }}</p>
            <p class="fact-note">
              <template v-if="fact.noteLines">
                <span v-for="(line, index) in fact.noteLines" :key="`${fact.index}-note-${index}`" class="fact-note-line">{{ line }}</span>
              </template>
              <span v-else>{{ fact.note }}</span>
            </p>
          </template>
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
.fact-card .v-card { height: 100%; }
.fact-card .v-card__text { padding: 22px 20px 24px; }
.fact-index { margin-bottom: 30px; color: #888; font-size: 11px; font-weight: 700; letter-spacing: .13em; }
h3 { margin-bottom: 12px; font-size: 22px; font-weight: 700; }
.fact-value-group { margin-bottom: 12px; }
.fact-value { margin: 0 0 5px; color: #333; font-size: 17px; font-weight: 600; }
.fact-note { margin: 0; color: #858585; font-size: 14px; line-height: 1.7; }
.fact-note-line { display: block; }
.fact-team-list { display: grid; gap: 10px; }
.fact-media-row { display: flex; min-width: 0; align-items: center; gap: 12px; }
.fact-team-name { margin: 0; color: #333; font-size: 16px; font-weight: 600; overflow-wrap: anywhere; }
.fact-image-slot { display: grid; flex: 0 0 48px; width: 48px; height: 48px; place-items: center; overflow: hidden; border: 1px dashed #c9c9c3; border-radius: 6px; background: #f5f5f2; color: #888; font-size: 9px; text-align: center; }
.fact-image-slot img { width: 100%; height: 100%; object-fit: contain; }
</style>
