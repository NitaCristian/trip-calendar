import { createRouter, createWebHistory } from 'vue-router'
import TripList from '../views/TripList.vue'

const routes = [
    { path: '/', component: TripList },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
