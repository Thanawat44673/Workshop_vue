<template>
  <article class="workshop-page grade-calculator-page">
    <v-container class="workshop-shell py-12 py-md-16">
      <header>
        <router-link class="workshop-back-link" :to="{ name: 'home' }">← กลับหน้า Workshop</router-link>
        <section-heading class="grade-heading mt-12" level="h1" :eyebrow="`WORKSHOP ${number} / GRADE CALCULATOR`">
          {{ title }}
        </section-heading>
        <p class="intro">{{ description }}</p>
      </header>

      <div class="grade-workspace">
        <form class="calculator-form" aria-label="แบบฟอร์มคำนวณเกรด" @submit.prevent="calculateGrade">
          <v-card class="calculator-card" outlined>
            <v-card-text>
            <label class="field-label" for="score-input">คะแนนที่ได้</label>
            <v-text-field
              id="score-input"
              v-model="scoreInput"
              class="score-field"
              type="text"
              inputmode="decimal"
              placeholder="เช่น 85"
              hint="กรอกคะแนนระหว่าง 0 ถึง 100"
              persistent-hint
              outlined
              clearable
              @input="resetResult"
            />

            <v-btn class="calculate-button" type="submit" large depressed>
              คำนวณเกรด <span class="button-arrow" aria-hidden="true">→</span>
            </v-btn>

            <v-alert v-if="errorMessage" class="feedback-alert mt-5" type="error" outlined dense role="alert" aria-live="assertive">
              {{ errorMessage }}
            </v-alert>

            <v-card v-if="grade !== null" class="result-card mt-6" flat role="status" aria-live="polite">
              <div>
                <p class="result-label">คะแนน {{ displayedScore }} / 100</p>
                <p class="result-caption">เกรดที่ได้</p>
              </div>
              <strong class="grade-letter">{{ grade }}</strong>
            </v-card>
            </v-card-text>
          </v-card>
        </form>

        <section class="grading-scale" aria-label="เกณฑ์การให้คะแนน">
          <section-heading eyebrow="GRADING SCALE">เกณฑ์การให้คะแนน</section-heading>
          <div class="scale-list">
            <div v-for="item in gradeRanges" :key="item.grade" class="scale-item" :class="`grade-${item.grade.toLowerCase()}`">
              <strong>{{ item.grade }}</strong>
              <span>{{ item.range }}</span>
              <span class="scale-meter" aria-hidden="true"><span class="scale-meter-fill"></span></span>
            </div>
          </div>
        </section>
      </div>

      <nav class="next-workshop" aria-label="ไปยัง Workshop ถัดไป">
        <span></span>
        <v-btn text :to="{ name: 'workshop-three' }">ไป Workshop 03 →</v-btn>
      </nav>
    </v-container>
  </article>
</template>

<script>
import SectionHeading from '../components/SectionHeading.vue'
import { getGrade, parseScoreInput } from '../utils/grading'

export default {
  name: 'GradeCalculatorView',
  components: { SectionHeading },
  props: {
    number: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  data: () => ({
    scoreInput: '',
    grade: null,
    displayedScore: '',
    errorMessage: '',
    gradeRanges: [
      { grade: 'A', range: '80–100' },
      { grade: 'B', range: '70–79' },
      { grade: 'C', range: '60–69' },
      { grade: 'D', range: '50–59' },
      { grade: 'F', range: '0–49' },
    ],
  }),
  methods: {
    resetResult() {
      this.grade = null
      this.displayedScore = ''
      this.errorMessage = ''
    },
    calculateGrade() {
      const result = parseScoreInput(this.scoreInput)
      if (result.error) {
        this.grade = null
        this.errorMessage = result.error
        return
      }

      this.errorMessage = ''
      this.displayedScore = result.score
      this.grade = getGrade(result.score)
    },
  },
}
</script>

<style scoped>
/* Page layout and component details; palette values come from workshop.css. */
article.grade-calculator-page { color: var(--text); background: var(--background); }
article.grade-calculator-page .workshop-shell { width: 100%; max-width: 1000px; margin-right: auto; margin-left: auto; }
.grade-heading ::v-deep .heading-text { margin-bottom: 0; font-size: clamp(42px, 7vw, 76px); }
.intro { max-width: 620px; margin-top: 14px; color: var(--muted); font-size: 16px; line-height: 1.8; }
.grade-workspace { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, .9fr); gap: 24px; align-items: stretch; margin-top: 38px; }
.calculator-form { min-width: 0; margin: 0; }
.calculator-card { position: relative; height: 100%; overflow: hidden; border: 1px solid var(--border) !important; border-radius: 18px !important; background: linear-gradient(145deg, var(--surface) 0%, var(--background) 100%) !important; box-shadow: 0 14px 38px rgba(var(--text-rgb), .06) !important; }
.calculator-card .v-card__text { position: relative; z-index: 1; padding: clamp(24px, 4vw, 36px); }
.field-label { display: block; margin-bottom: 10px; color: var(--text); font-size: 14px; font-weight: 700; }
.score-field { max-width: none; }
.calculate-button { min-width: 190px; color: var(--on-primary) !important; background: var(--primary) !important; letter-spacing: 0 !important; box-shadow: 0 8px 18px rgba(var(--primary-rgb), .2) !important; }
.calculate-button:hover { background: var(--accent) !important; }
.button-arrow { margin-left: 14px; font-size: 18px; }
.feedback-alert, .result-card { max-width: none; }
.result-card { display: flex; align-items: center; justify-content: space-between; padding: 20px 22px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface-soft); }
.result-label, .result-caption { margin: 0; }
.result-label { color: var(--text); font-size: 14px; font-weight: 600; }
.result-caption { margin-top: 4px; color: var(--muted); font-size: 12px; }
.grade-letter { display: grid; width: 68px; height: 68px; place-items: center; border-radius: 20px; background: var(--primary); color: var(--on-primary); font-size: 42px; font-weight: 900; line-height: 1; box-shadow: 0 8px 22px rgba(var(--primary-rgb), .2); }
.grading-scale { margin: 0; padding: clamp(22px, 3vw, 30px); border: 1px solid var(--border); border-radius: 18px; background: var(--surface); box-shadow: 0 14px 38px rgba(var(--text-rgb), .045); }
.grading-scale ::v-deep h2 { margin-bottom: 18px; font-size: 26px; }
.scale-list { display: grid; gap: 10px; }
.scale-item { display: grid; grid-template-columns: 46px 1fr; align-items: center; column-gap: 12px; row-gap: 8px; padding: 12px 14px; border: 1px solid var(--border); border-radius: 12px; background: linear-gradient(100deg, var(--surface-soft), var(--surface)); }
.scale-item strong { grid-row: span 2; color: var(--primary); font-size: 32px; line-height: 1; }
.scale-item > span:not(.scale-meter) { color: var(--muted); font-size: 14px; font-weight: 600; }
.scale-meter { display: block; height: 5px; overflow: hidden; border-radius: 999px; background: rgba(var(--primary-rgb), .12); }
.scale-meter-fill { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg, var(--primary), var(--accent)); }
.grade-a .scale-meter-fill { width: 100%; }
.grade-b .scale-meter-fill { width: 80%; }
.grade-c .scale-meter-fill { width: 60%; }
.grade-d .scale-meter-fill { width: 40%; }
.grade-f .scale-meter-fill { width: 20%; }
@media (max-width: 900px) {
  .grade-workspace { grid-template-columns: 1fr; }
  .grading-scale { margin-top: 2px; }
  .scale-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 600px) {
  .grade-workspace { margin-top: 28px; gap: 18px; }
  .scale-list { grid-template-columns: 1fr; }
  .calculate-button { width: 100%; }
}
</style>
