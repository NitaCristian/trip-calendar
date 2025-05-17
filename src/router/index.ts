import {createRouter, createWebHistory} from 'vue-router'
import TripList from '../views/TripList.vue'
import TripCreate from '../views/TripCreate.vue'
import TripDetail from '../views/TripDetail.vue'


const routes = [
    {
        path: '/',
        component: TripList
    },
    {
        path: '/create',
        component: TripCreate
    },
    {
        path: '/trip/:id',
        component: TripDetail
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
