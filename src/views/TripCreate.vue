<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useTripStore } from '../stores/tripStore'

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
  <div class="create-trip">
    <h2>Create New Trip</h2>

    <form @submit.prevent="createTrip">
      <label>
        Name:
        <input v-model="name" required />
      </label>

      <label>
        Destination:
        <input v-model="destination" required />
      </label>

      <label>
        Status:
        <select v-model="status" required>
          <option disabled value="">Select status</option>
          <option>Planned</option>
          <option>Ongoing</option>
          <option>Completed</option>
        </select>
      </label>

      <label>
        Duration (days):
        <input type="number" v-model="desiredDuration" required />
      </label>

      <button type="submit" :disabled="submitting">Create</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.create-trip {
  color: #333333;
  padding: 2rem;
  max-width: 500px;
  margin: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
}

input, select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background: #42b883;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
