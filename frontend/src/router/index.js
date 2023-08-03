import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/stake',
    name: 'stake',
    component: () => import( '../views/StakeView/StakeView.vue')
  },
  {
    path: '/lending',
    name: 'lending',
    component: () => import( '../views/LendView.vue')
  },

  {
    path: '/auction/:type',
    name: 'auction',
    component: () => import( '../views/AuctionView/AuctionView.vue')
  },

  {
    path: '/mynft',
    name: 'mynft',
    component: () => import( '../views/MyNFTView/MyNFTView.vue')
  },
  {
    path: '/governance/:id',
    name: 'governance',
    component: () => import( '../views/GovernanceView/GovernanceView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
