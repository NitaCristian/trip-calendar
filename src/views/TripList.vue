<script setup lang="ts">
import {onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {useTripStore} from '../stores/tripStore'

const router = useRouter()
const store = useTripStore()

onMounted(() => {
  store.fetchTrips()
})

const goToEdit = (id: string) => router.push(`/edit/${id}`)
const goToCreate = () => router.push('/create')
const deleteTrip = async (id: string) => {
  if (confirm('Delete this trip?')) {
    await store.deleteTrip(id)
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
          <button
              @click="goToEdit(trip.tripId)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
              @click="deleteTrip(trip.tripId)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
