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

// State for tracking checkboxes
const attendanceCheckedItems: Ref<Record<string, boolean>> = ref({});
const drinkCheckedItems: Ref<Record<string, boolean>> = ref(
  Object.fromEntries(
    JSON.parse(Cookies.get(`${props.eventId}-drinks`) || '[]').map(
      (key: string) => [key, true]
    )
  )
);
const noShowCheckedItems: Ref<Record<string, boolean>> = ref({}); // New state for No Show

const eventParticipants = ref<AdminEventParticipant[]>(props.participants);

// Helper function to update checkbox states
const updateCheckedItems = (participants: AdminEventParticipant[]) => {
  participants.forEach((person) => {
    attendanceCheckedItems.value = {
      ...attendanceCheckedItems.value,
      [person.email]: person.inAttendance,
    };
    noShowCheckedItems.value = {
      ...noShowCheckedItems.value,
      [person.email]: person.noShow || false, // Default false if no show status doesn't exist
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

// Filter male and female attendees
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
    Cookies.set(`${props.eventId}-drinks`, JSON.stringify(selectedDrinks), { expires: 1 });
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
            <!-- Attendance -->
            <input type="checkbox" :id="'checkbox1-' + person.email" v-model="attendanceCheckedItems[person.email]" disabled />
            <!-- Drinks -->
            <input type="checkbox" :id="'checkbox2-' + person.email" v-model="drinkCheckedItems[person.email]" />
            <!-- No Show -->
            <input type="checkbox" :id="'checkbox-ns-' + person.email" v-model="noShowCheckedItems[person.email]" /> <!-- No Show Checkbox -->
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
            <!-- Attendance -->
            <input type="checkbox" :id="'checkbox3-' + person.email" v-model="attendanceCheckedItems[person.email]" disabled />
            <!-- Drinks -->
            <input type="checkbox" :id="'checkbox4-' + person.email" v-model="drinkCheckedItems[person.email]" />
            <!-- No Show -->
            <input type="checkbox" :id="'checkbox-ns-' + person.email" v-model="noShowCheckedItems[person.email]" /> <!-- No Show Checkbox -->
          </div>
        </fieldset>

        <div class="button-box">
          <button type="submit" :disabled="requestLoading || disableRefresh">REFRESH</button>
        </div>
      </form>
    </section>

    <!-- Toast notification -->
    <div v-if="toastVisible" id="snackbar">{{ toastMessage }}</div>
  </div>
</template>
