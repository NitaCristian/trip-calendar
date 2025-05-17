<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useTripStore} from '../stores/tripStore'
import type {Trip} from '../models/trip.ts'

const route = useRoute()
const router = useRouter()
const tripId = route.params.id as string

const store = useTripStore()
const trip = ref<Trip | null>(null)
const error = ref<string | null>(null)
const submitting = ref(false)

onMounted(async () => {
  try {
    trip.value = await store.fetchTrip(tripId)
  } catch (err: any) {
    error.value = err.message || 'Failed to load trip.'
  }
})

const updateTrip = async () => {
  if (!trip.value) return
  submitting.value = true
  error.value = null

  try {
    await store.updateTrip(trip.value)
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Failed to update trip.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4">Edit Trip</h2>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <form v-if="trip" @submit.prevent="updateTrip" class="space-y-4">
      <div>
        <label class="block font-medium">Name</label>
        <input v-model="trip.name" class="input" required/>
      </div>

      <div>
        <label class="block font-medium">Destination</label>
        <input v-model="trip.destination" class="input" required/>
      </div>

      <div>
        <label class="block font-medium">Status</label>
        <select v-model="trip.status" class="input" required>
          <option disabled value="">Select status</option>
          <option>Planned</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </div>

      <div>
        <label class="block font-medium">Duration (days)</label>
        <input type="number" v-model="trip.desiredDuration" class="input" required/>
      </div>

      <button type="submit" :disabled="submitting"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Save
      </button>
    </form>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
