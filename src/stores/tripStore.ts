// stores/tripStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'

interface Trip {
    tripId: string
    name: string
    destination: string
    status: string
    desiredDuration: string
    createdAt: string
    updatedAt: string
}

export const useTripStore = defineStore('tripStore', {
    state: () => ({
        trips: [] as Trip[],
        loading: false,
        error: null as string | null
    }),

    actions: {
        async fetchTrips(force = false) {
            if (this.trips.length > 0 && !force) return
            this.loading = true
            this.error = null

            try {
                const response = await axios.get<Trip[]>('https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips')
                this.trips = response.data
            } catch (err: any) {
                this.error = err.response?.data?.message || err.message || 'Failed to fetch trips.'
            } finally {
                this.loading = false
            }
        },

        async deleteTrip(id: string) {
            await axios.delete(`https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips/${id}`)
            this.trips = this.trips.filter(trip => trip.tripId !== id)
        }
    }
})
