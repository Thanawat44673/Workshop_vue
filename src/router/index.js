import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WorkshopPage from '../views/WorkshopPage.vue'
import ProfileWorkshopView from '../views/ProfileWorkshopView.vue'
import GradeCalculatorView from '../views/GradeCalculatorView.vue'
import ProductsView from '../views/ProductsView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/OrdersView.vue'
import AdminApprovalsView from '../views/AdminApprovalsView.vue'
import { workshops } from '../data/portfolio'
import { getAuthToken, isAdmin } from '../services/auth'

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
    { path: 'products', name: 'products', component: ProductsView, meta: { requiresAuth: true } },
    { path: 'dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: 'orders', name: 'orders', component: OrdersView, meta: { requiresAuth: true } },
    { path: 'admin/approvals', name: 'admin-approvals', component: AdminApprovalsView, meta: { requiresAuth: true, requiresAdmin: true } },
  ],
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !getAuthToken()) {
    next({ name: 'workshop-three' })
    return
  }
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  if (requiresAdmin && !isAdmin()) {
    next({ name: 'dashboard' })
    return
  }
  if (isAdmin() && ['dashboard', 'products', 'orders'].includes(to.name)) {
    next({ name: 'admin-approvals' })
    return
  }
  next()
})

export default router
