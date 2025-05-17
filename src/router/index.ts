import { createRouter, createWebHistory } from 'vue-router'
import TripList from '../views/TripList.vue'
import TripCreate from "../views/TripCreate.vue";

const routes = [
    { path: '/', component: TripList },
    { path: '/create', component: TripCreate },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
