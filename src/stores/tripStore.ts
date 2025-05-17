import {defineStore} from 'pinia'
import axios from 'axios'
import type {Trip} from '../models/trip'

const API_BASE = 'https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips'

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
                const response = await axios.get<Trip[]>(API_BASE)
                this.trips = response.data
                this.tripsById = Object.fromEntries(response.data.map(trip => [trip.tripId, trip]))
            } catch (err: any) {
                this.error = err.response?.data?.message || err.message || 'Failed to fetch trips.'
            } finally {
                this.loading = false
            }
        },

        async fetchTrip(id: string, force = false): Promise<Trip> {
            if (this.tripsById[id] && !force) return this.tripsById[id]

            try {
                const response = await axios.get<Trip>(`${API_BASE}/${id}`)
                const trip = response.data
                this.tripsById[id] = trip

                if (!this.trips.find(t => t.tripId === id)) this.trips.push(trip)
                return trip
            } catch (err: any) {
                throw new Error(err.response?.data?.message || err.message || 'Failed to fetch trip.')
            }
        },

        async createTrip(payload: Omit<Trip, 'tripId' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
            try {
                const response = await axios.post<Trip>(API_BASE, payload)
                const newTrip = response.data
                this.trips.push(newTrip)
                this.tripsById[newTrip.tripId] = newTrip
                return newTrip
            } catch (err: any) {
                this.error = err.response?.data?.message || err.message || 'Failed to create trip.'
                throw new Error(this.error ?? 'Unknown error')
            }
        },

        async updateTrip(updatedTrip: Trip): Promise<void> {
            try {
                const response = await axios.put<Trip>(`${API_BASE}/${updatedTrip.tripId}`, updatedTrip)
                const updated = response.data

                this.tripsById[updated.tripId] = updated
                const index = this.trips.findIndex(t => t.tripId === updated.tripId)
                if (index !== -1) this.trips[index] = updated
                else this.trips.push(updated)
            } catch (err: any) {
                this.error = err.response?.data?.message || err.message || 'Failed to update trip.'
                throw new Error(this.error ?? 'Unknown error')
            }
        },

        async deleteTrip(id: string) {
            this.trips = this.trips.filter(trip => trip.tripId !== id)
            delete this.tripsById[id]

            try {
                await axios.delete(`${API_BASE}/${id}`)
            } catch (err: any) {
                this.error = err.response?.data?.message || err.message || 'Failed to delete trip.'
                throw new Error(this.error ?? 'Unknown error')
            }
        },
    }
})
