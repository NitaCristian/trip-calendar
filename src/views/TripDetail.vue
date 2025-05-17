<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTripStore} from '../stores/tripStore'
import type { Trip } from '../stores/tripStore'

const route = useRoute()
const router = useRouter()
const tripId = route.params.id as string

const trip = ref<Trip | null>(null)
const store = useTripStore()
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    trip.value = await store.fetchTrip(tripId)
  } catch (err: any) {
    error.value = err.message || 'Failed to load trip.'
  } finally {
    loading.value = false
  }
})

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this trip?')) return
  try {
    await store.deleteTrip(tripId)
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Failed to delete trip.'
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div v-if="loading" class="text-gray-500">Loading trip...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="trip" class="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 class="text-2xl font-bold text-gray-800">{{ trip.name }}</h2>
      <p><strong>Destination:</strong> {{ trip.destination }}</p>
      <p><strong>Status:</strong> {{ trip.status }}</p>
      <p><strong>Duration:</strong> {{ trip.desiredDuration }} days</p>
      <p><strong>Created At:</strong> {{ new Date(trip.createdAt).toLocaleDateString() }}</p>
      <p><strong>Updated At:</strong> {{ new Date(trip.updatedAt).toLocaleDateString() }}</p>

      <div class="flex gap-4 mt-4">
        <button @click="router.push(`/edit/${tripId}`)"
                class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit
        </button>
        <button @click="handleDelete"
                class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete
        </button>
        <button @click="router.push('/')" class="text-gray-600 underline">
          Back
        </button>
      </div>
    </div>
  </div>
</template>