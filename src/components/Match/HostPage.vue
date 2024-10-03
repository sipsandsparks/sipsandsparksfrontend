<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { AdminEventParticipant } from '../MatchPage.vue';

const props = defineProps<{
  isTablet: boolean;
  participants: AdminEventParticipant[];
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  disableRefresh?: boolean;
}>();

const toastVisible = ref(false);
const requestLoading = ref(false);
const toastMessage = ref('Sending...');
const attendanceCheckedItems: Ref<Record<string, boolean>> = ref({});
const drinkCheckedItems: Ref<Record<string, boolean>> = ref(
  Object.fromEntries(
    JSON.parse(Cookies.get(`${props.eventId}-drinks`) || '[]').map(
      (key: string) => [key, true]
    )
  )
);
const eventParticipants = ref<AdminEventParticipant[]>(props.participants);

// Helper function to update checkbox states
const updateCheckedItems = (participants: AdminEventParticipant[]) => {
  participants.forEach((person) => {
    attendanceCheckedItems.value = {
      ...attendanceCheckedItems.value,
      [person.email]: person.inAttendance,
    };
  });
};

// Initialize checked items
updateCheckedItems(eventParticipants.value);

const refreshForm = async () => {
  requestLoading.value = true;
  try {
    // Make the POST request to the backend server
    const response = await axios.post(
      'https://sips-and-sparks-77e98866d158.herokuapp.com/event-participants',
      {
        firstName: props.firstName,
        lastName: props.lastName,
        email: props.email,
        eventId: props.eventId,
      }
    );

    if (response.data.attendees) {
      updateCheckedItems(response.data.attendees);
      eventParticipants.value = response.data.attendees;
      showToast('Participants refreshed successfully');
    }
    requestLoading.value = false;
  } catch (error) {
    console.error(error);
    showToast('Failed to refresh participants');
    requestLoading.value = false;
  }
};

// Helper to display toast notifications
const showToast = (message: string) => {
  toastMessage.value = message;
  toastVisible.value = true;
  setTimeout(() => {
    toastVisible.value = false;
  }, 3000);
};

const maleAttendees = computed(() =>
  eventParticipants.value.filter((att) => att.gender === 'Male')
);
const femaleAttendees = computed(() =>
  eventParticipants.value.filter((att) => att.gender === 'Female')
);

// Watch for changes in drink selections and store in cookies
watch(
  () => drinkCheckedItems.value,
  (val) => {
    const selectedDrinks = Object.keys(val).filter((key) => val[key]);
    Cookies.set(
      `${props.eventId}-drinks`,
      JSON.stringify(selectedDrinks),
      { expires: 1 }
    );
  },
  { deep: true }
);
</script>

<template>
  <div class="body">
    <section class="contact">
      <h2>MATCH FORM</h2>
      <form @submit.prevent="refreshForm">
        <fieldset class="event-selection">
          <legend>
            Male Attendees<br />
            <span class="legend-note">The first checkbox indicates if they have accessed their match form.</span>
          </legend>
          <div v-for="person in maleAttendees" :key="person.id" class="participant-row">
            <label :for="'checkbox2-' + person.email">
              <span>{{ person.firstName }} {{ person.lastName }} | {{ person.email }}</span>
            </label>
            <input type="checkbox" :id="'checkbox1-' + person.email" v-model="attendanceCheckedItems[person.email]" disabled />
            <input type="checkbox" :id="'checkbox2-' + person.email" v-model="drinkCheckedItems[person.email]" />
          </div>

          <br />
          <legend>
            Female Attendees<br />
            <span class="legend-note">The first checkbox indicates if they have accessed their match form.</span>
          </legend>
          <div v-for="person in femaleAttendees" :key="person.id" class="participant-row">
            <label :for="'checkbox4-' + person.email">
              <span>{{ person.firstName }} {{ person.lastName }} | {{ person.email }}</span>
            </label>
            <input type="checkbox" :id="'checkbox3-' + person.email" v-model="attendanceCheckedItems[person.email]" disabled />
            <input type="checkbox" :id="'checkbox4-' + person.email" v-model="drinkCheckedItems[person.email]" />
          </div>
        </fieldset>

        <div class="button-box">
          <button type="submit" :disabled="requestLoading || disableRefresh">REFRESH</button>
        </div>
      </form>
    </section>
    <div v-if="toastVisible" id="snackbar">{{ toastMessage }}</div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&family=Syncopate:wght@400;700&display=swap');

.body {
  display: flex;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 15px;
  margin-left: 20px;
}

.flex {
  display: flex;
  align-items: center;
}

.contact form {
  width: 90%;
  max-width: 500px;
  text-align: center;
}

form .button-box {
  display: flex;
}

.contact h2 {
  font-family: 'Syncopate', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: black;
  text-align: left;
  margin-bottom: 10px;
}

form button {
  padding: 12px 32px;
  background: black;
  color: white;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.1s;
  font-family: 'Darker Grotesque', sans-serif;
  font-weight: 650;
  font-size: 1.5rem;
}

form button:hover {
  box-shadow: 0 0 10px #719ece;
}

form button:disabled {
  cursor: auto;
  background: rgba(136, 136, 136, 0.8);
}

.participant-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
}

.participant-row input[type='checkbox'] {
  margin-left: 10px;
}

.participant-row label {
  flex: 1;
}

.event-selection {
  border: none;
  margin: 0;
  padding: 0;
  max-width: 100%;
  word-wrap: break-word;
}

.event-selection legend {
  font-family: 'Darker Grotesque', sans-serif;
  font-weight: 650;
  font-size: 2rem;
  margin-bottom: 10px;
}

.event-selection label {
  font-family: 'Darker Grotesque', sans-serif;
  font-weight: 600;
  font-size: 1.75rem;
  margin-bottom: 3px;
}

.event-selection input[type='checkbox'] {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.legend-note {
  font-size: 0.875em;
  color: grey;
}

#snackbar {
  visibility: visible;
  background-color: #333;
  color: white;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  bottom: 10vh;
  font-family: 'Darker Grotesque', sans-serif;
  font-weight: 650;
  font-size: 1.25rem;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }
  to {
    bottom: 10vh;
    opacity: 1;
  }
}

@keyframes fadeout {
  from {
    bottom: 10vh;
    opacity: 1;
  }
  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
