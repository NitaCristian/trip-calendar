<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '../stores/tripStore'

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
  <div class="trip-list">
    <header class="header">
      <h1>Trips</h1>
      <button @click="goToCreate" class="create-btn">+ New Trip</button>
    </header>

    <div v-if="store.loading">Loading...</div>
    <div v-else-if="store.error">{{ store.error }}</div>
    <table v-else>
      <thead>
      <tr>
        <th>Name</th>
        <th>Destination</th>
        <th>Status</th>
        <th>Duration (days)</th>
        <th>Created At</th>
        <th>Updated At</th>
        <th>Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="trip in store.trips" :key="trip.tripId">
        <td>{{ trip.name }}</td>
        <td>{{ trip.destination }}</td>
        <td>{{ trip.status }}</td>
        <td>{{ trip.desiredDuration }}</td>
        <td>{{ new Date(trip.createdAt).toLocaleDateString() }}</td>
        <td>{{ new Date(trip.updatedAt).toLocaleDateString() }}</td>
        <td>
          <button @click="goToEdit(trip.tripId)">Edit</button>
          <button @click="deleteTrip(trip.tripId)" class="delete">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.trip-list {
  padding: 2rem;
  background: #fff;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.create-btn {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-btn:hover {
  background-color: #369973;
}

table {
  color: #333;
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
}

th, td {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background-color: #f9f9f9;
}

button {
  padding: 0.3rem 0.6rem;
  margin-right: 0.5rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}

button.delete {
  background-color: #e74c3c;
  color: white;
}

.loading, .error {
  padding: 1rem;
  font-size: 1.2rem;
}
</style>
