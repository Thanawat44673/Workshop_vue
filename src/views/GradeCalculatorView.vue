<template>
  <article class="workshop-page">
    <v-container class="workshop-shell py-12 py-md-16">
      <header>
        <router-link class="workshop-back-link" :to="{ name: 'home' }">← กลับหน้า Workshop</router-link>
        <section-heading class="grade-heading mt-12" level="h1" :eyebrow="`WORKSHOP ${number} / GRADE CALCULATOR`">
          {{ title }}
        </section-heading>
        <p class="intro">{{ description }}</p>
      </header>

      <form class="calculator-form mt-10" aria-label="แบบฟอร์มคำนวณเกรด" @submit.prevent="calculateGrade">
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
        <v-row>
          <v-col v-for="item in gradeRanges" :key="item.grade" cols="6" sm="4" md="2">
            <div class="scale-item">
              <strong>{{ item.grade }}</strong>
              <span>{{ item.range }}</span>
            </div>
          </v-col>
        </v-row>
      </section>

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
.grade-heading ::v-deep .heading-text { margin-bottom: 0; font-size: clamp(42px, 7vw, 76px); }
.intro { margin-top: 14px; color: #777; font-size: 16px; }
.calculator-form { max-width: 640px; margin-left: auto; margin-right: auto; }
.calculator-card { border-color: #deded9 !important; background: #fff !important; }
.calculator-card .v-card__text { padding: 28px; }
.field-label { display: block; margin-bottom: 10px; color: #222; font-size: 14px; font-weight: 700; }
.score-field { max-width: 360px; }
.calculate-button { color: #fff !important; background: #111 !important; letter-spacing: 0 !important; }
.button-arrow { margin-left: 14px; font-size: 18px; }
.feedback-alert { max-width: 360px; }
.result-card { display: flex; max-width: 360px; align-items: center; justify-content: space-between; padding: 20px 22px; border: 1px solid #111; background: #f5f5f2; }
.result-label, .result-caption { margin: 0; }
.result-label { color: #555; font-size: 13px; }
.result-caption { margin-top: 4px; color: #888; font-size: 11px; }
.grade-letter { font-size: 56px; font-weight: 900; line-height: 1; }
.grading-scale { margin-top: 78px; }
.grading-scale ::v-deep h2 { margin-bottom: 18px; font-size: 30px; }
.scale-item { display: flex; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid #d8d8d3; }
.scale-item strong { font-size: 50px; }
.scale-item span { color: #777; font-size: 25px; }
</style>
