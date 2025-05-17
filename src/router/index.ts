import {createRouter, createWebHistory} from 'vue-router'
import TripList from '../views/TripList.vue'
import TripCreate from '../views/TripCreate.vue'
import TripDetail from '../views/TripDetail.vue'
import EditTrip from "../views/EditTrip.vue";


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
    {
        path: '/edit/:id',
        component: EditTrip
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
