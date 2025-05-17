<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import axios from 'axios'
import {useTripStore} from '../stores/tripStore'

const router = useRouter()
const store = useTripStore()

const name = ref('')
const destination = ref('')
const status = ref('')
const desiredDuration = ref('')

const error = ref<string | null>(null)
const submitting = ref(false)

const createTrip = async () => {
  submitting.value = true
  error.value = null

  try {
    const payload = {
      name: name.value,
      destination: destination.value,
      status: status.value,
      desiredDuration: desiredDuration.value
    }

    const response = await axios.post('https://2ckijyr7q1.execute-api.us-east-1.amazonaws.com/trips', payload)
    const newTrip = response.data

    store.trips.push(newTrip)

    await router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Failed to create trip.'
    console.error(err)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-2xl font-semibold mb-6 text-gray-800 text-center">Create New Trip</h2>

    <form @submit.prevent="createTrip" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
            v-model="name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Destination</label>
        <input
            v-model="destination"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
            v-model="status"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option disabled value="">Select status</option>
          <option>Planned</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
        <input
            type="number"
            v-model="desiredDuration"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <button
          type="submit"
          :disabled="submitting"
          class="w-full bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'Creating...' : 'Create' }}
      </button>
    </form>

    <p v-if="error" class="text-red-500 mt-4 text-sm text-center">{{ error }}</p>
  </div>
</template>
