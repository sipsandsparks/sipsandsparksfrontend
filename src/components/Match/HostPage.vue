<template>
  <div>
    <h1>Host Page</h1>
    <!-- Add your checkbox for no-show management -->
    <div v-for="participant in eventParticipants" :key="participant.email">
      <label>
        <input type="checkbox" v-model="noShowCheckedItems[participant.email]" />
        No Show
      </label>
    </div>
    <button @click="refreshForm">Refresh</button>

    <!-- Display Eventbrite Attendees -->
    <div v-for="attendee in eventbriteAttendees" :key="attendee.id">
      <p>{{ attendee.name }} ({{ attendee.email }})</p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import type { AdminEventParticipant } from '../MatchPage.vue';

const props = defineProps({
  isTablet: Boolean,
  participants: Array,
  eventId: String,
  firstName: String,
  lastName: String,
  email: String,
  disableRefresh: Boolean,
});

const toastVisible = ref(false);
const requestLoading = ref(false);
const toastMessage = ref('Sending...');
const attendanceCheckedItems = ref({});
const drinkCheckedItems = ref(
  Object.fromEntries(
    JSON.parse(Cookies.get(`${props.eventId}-drinks`) || '[]').map(
      (key) => [key, true]
    )
  )
);
const noShowCheckedItems = ref({});
const eventParticipants = ref(props.participants);
const eventbriteAttendees = ref([]); // State for Eventbrite attendees

const updateCheckedItems = (participants) => {
  participants.forEach((person) => {
    attendanceCheckedItems.value = {
      ...attendanceCheckedItems.value,
      [person.email]: person.inAttendance,
    };
    noShowCheckedItems.value = {
      ...noShowCheckedItems.value,
      [person.email]: person.noShow || false,
    };
  });
};

const fetchEventbriteAttendees = async () => {
  try {
    const response = await axios.get(`https://www.eventbriteapi.com/v3/events/${props.eventId}/attendees/`, {
      headers: { Authorization: `Bearer YOUR_EVENTBRITE_API_TOKEN` }
    });
    eventbriteAttendees.value = response.data.attendees.map(attendee => ({
      id: attendee.id,
      name: attendee.profile.name,
      email: attendee.profile.email
    }));
  } catch (error) {
    console.error('Failed to fetch Eventbrite attendees', error);
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`https://sips-and-sparks-77e98866d158.herokuapp.com/event-participants/${props.eventId}`);
    if (response.data.attendees) {
      eventParticipants.value = response.data.attendees;
      updateCheckedItems(response.data.attendees);
    }
    await fetchEventbriteAttendees(); // Fetch Eventbrite attendees
  } catch (error) {
    console.error('Failed to fetch participants', error);
  }
});

updateCheckedItems(eventParticipants.value);

const refreshForm = async () => {
  requestLoading.value = true;
  try {
    const payload = {
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      eventId: props.eventId,
      noShowStatus: noShowCheckedItems.value,
    };

    const response = await axios.post(
      'https://sips-and-sparks-77e98866d158.herokuapp.com/event-participants',
      payload
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

watch(
  () => drinkCheckedItems.value,
  (val) => {
    const selectedDrinks = Object.keys(val).filter((key) => val[key]);
    Cookies.set(`${props.eventId}-drinks`, JSON.stringify(selectedDrinks), { expires: 1 });
  },
  { deep: true }
);
</script>
