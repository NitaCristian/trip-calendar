<script setup lang="ts">
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useTripStore} from '../stores/tripStore'

const router = useRouter()
const store = useTripStore()

onMounted(async () => {
  const needsRefresh = !!router.options.history.state.refreshTrips
  await store.fetchTrips(needsRefresh)
  router.options.history.state.refreshTrips = false
})

const goToEdit = (tripId: string) => router.push(`/edit/${tripId}`)
const goToCreate = () => router.push('/create')
const goToDetail = (tripId: string) => router.push(`/trip/${tripId}`)
const deleteTrip = async (tripId: string) => {
  if (confirm('Delete this trip?')) {
    await store.deleteTrip(tripId)
  }
}
</script>

<template>
  <div class="p-8 bg-white min-h-screen">
    <header class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Trips</h1>
      <button
          @click="goToCreate"
          class="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition"
      >
        + New Trip
      </button>
    </header>

    <div v-if="store.loading" class="text-lg font-medium text-gray-500">Loading...</div>
    <div v-else-if="store.error" class="text-red-500 font-medium">{{ store.error }}</div>

    <table v-else class="w-full table-auto border-collapse shadow text-sm">
      <thead>
      <tr class="bg-gray-100 text-left">
        <th class="p-3 border-b">Name</th>
        <th class="p-3 border-b">Destination</th>
        <th class="p-3 border-b">Status</th>
        <th class="p-3 border-b">Duration (days)</th>
        <th class="p-3 border-b">Created At</th>
        <th class="p-3 border-b">Updated At</th>
        <th class="p-3 border-b">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="trip in store.trips"
          :key="trip.tripId"
          class="hover:bg-gray-50 transition"
      >
        <td class="p-3 border-b">{{ trip.name }}</td>
        <td class="p-3 border-b">{{ trip.destination }}</td>
        <td class="p-3 border-b">{{ trip.status }}</td>
        <td class="p-3 border-b">{{ trip.desiredDuration }}</td>
        <td class="p-3 border-b">{{ new Date(trip.createdAt).toLocaleDateString() }}</td>
        <td class="p-3 border-b">{{ new Date(trip.updatedAt).toLocaleDateString() }}</td>
        <td class="p-3 border-b space-x-2">
          <button @click="goToEdit(trip.tripId)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition">Edit
          </button>
          <button @click="deleteTrip(trip.tripId)"
                  class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete
          </button>
          <button @click="goToDetail(trip.tripId)"
                  class="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 transition">View
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
