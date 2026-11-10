import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkshopPage from '../views/WorkshopPage.vue'
import ProfileWorkshopView from '../views/ProfileWorkshopView.vue'
import GradeCalculatorView from '../views/GradeCalculatorView.vue'
import { workshops } from '../data/portfolio'

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: () => import('../layouts/AppLayout.vue'),
  children: [
    { path: '', name: 'home', component: HomeView },
    ...workshops.map(workshop => ({
      path: workshop.path,
      name: workshop.route,
      component: workshop.kind === 'profile'
        ? ProfileWorkshopView
        : workshop.kind === 'grade'
          ? GradeCalculatorView
          : WorkshopPage,
      props: { number: workshop.number, title: workshop.title, description: workshop.description },
    })),
  ],
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
