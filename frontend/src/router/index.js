import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Launchpads',
    redirect:"/Launchpads",
  },
  {
    path: '/Token',
    name: 'Token',
    component: () => import( '../views/Token.vue')
  },
  {
    path: '/CreateToken',
    name: 'CreateToken',
    component: () => import( '../views/CreateToken.vue')
  },
  {
    path: '/TokenAdmin',
    name: 'TokenAdmin',
    component: () => import( '../views/TokenAdmin.vue')
  },
  {
    path: '/Launchpads',
    name: 'Launchpads',
    component: () => import( '../views/Launchpads/Launchpads.vue')
  },
  {
    path: '/CreateLaunchpads',
    name: 'CreateLaunchpads',
    component: () => import( '../views/Launchpads/CreateLaunchpads.vue')
  },

  {
    path: '/LaunchpadsDetail',
    name: 'LaunchpadsDetail',
    component: () => import( '../views/Launchpads/Detail.vue')
  },

]

const router = new VueRouter({
  routes
})

export default router
