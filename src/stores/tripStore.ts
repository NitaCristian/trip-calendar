import { defineStore } from 'pinia'
import axios from 'axios'

export interface Trip {
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
        tripsById: {} as Record<string, Trip>,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async fetchTrips(force = false) {
            if (this.trips.length > 0 && !force) return

            this.loading = true
            this.error = null

            try {
                const response = await axios.get<Trip[]>('https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips')
                this.trips = response.data
                this.tripsById = {}

                for (const trip of this.trips) {
                    this.tripsById[trip.tripId] = trip
                }
            } catch (err: any) {
                this.error = err.response?.data?.message || err.message || 'Failed to fetch trips.'
            } finally {
                this.loading = false
            }
        },

        async fetchTrip(id: string, force = false): Promise<Trip> {
            if (this.tripsById[id] && !force) {
                return this.tripsById[id]
            }

            try {
                const response = await axios.get<Trip>(`https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips/${id}`)
                const trip = response.data
                this.tripsById[id] = trip

                // Optional: update trips list if it’s missing
                const exists = this.trips.find(t => t.tripId === id)
                if (!exists) this.trips.push(trip)

                return trip
            } catch (err: any) {
                throw new Error(err.response?.data?.message || err.message || 'Failed to fetch trip.')
            }
        },

        async deleteTrip(id: string) {
            // Optimistic local update
            this.trips = this.trips.filter(trip => trip.tripId !== id)
            delete this.tripsById[id]

            try {
                await axios.delete(`https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips/${id}`)
            } catch (err: any) {
                const message = err.response?.data?.message || err.message || 'Failed to delete trip.'
                this.error = message
                throw new Error(message)

            }
        },
    },
})
