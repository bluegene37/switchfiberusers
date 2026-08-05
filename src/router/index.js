import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlansView from '../views/PlansView.vue'
import CoverageView from '../views/CoverageView.vue'
import RegisterView from '../views/RegisterView.vue'
import ApplicationStatusView from '../views/ApplicationStatusView.vue'
import PayBillsView from '../views/PayBillsView.vue'
import TechSupportView from '../views/TechSupportView.vue'
import CareersView from '../views/CareersView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/plans',
    name: 'Plans',
    component: PlansView
  },
  {
    path: '/coverage',
    name: 'Coverage',
    component: CoverageView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/status',
    name: 'ApplicationStatus',
    component: ApplicationStatusView
  },
  {
    path: '/pay-bills',
    name: 'PayBills',
    component: PayBillsView
  },
  {
    path: '/tech-support',
    name: 'TechSupport',
    component: TechSupportView
  },
  {
    path: '/careers',
    name: 'Careers',
    component: CareersView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
