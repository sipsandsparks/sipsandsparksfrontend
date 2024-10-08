import { onMounted, computed, Ref, ref, watch } from 'vue';
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

// Fetch participants when the component is mounted
onMounted(async () => {
  try {
    const response = await axios.get(event-participants/:eventId
      `https://sips-and-sparks-77e98866d158.herokuapp.com/event-participants/${props.eventId}`
    );
    if (response.data.attendees) {
      eventParticipants.value = response.data.attendees;
      updateCheckedItems(response.data.attendees); // Update checkboxes with fetched data
    }
  } catch (error) {
    console.error("Failed to fetch participants", error);
  }
});

// Initialize checked items
updateCheckedItems(eventParticipants.value);

// Update refreshForm to include noShow data
const refreshForm = async () => {
  requestLoading.value = true;
  try {
    const payload = {
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      eventId: props.eventId,
      noShowStatus: noShowCheckedItems.value, // Send noShow data
    };

    // Make the POST request to the backend server
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

// Watch for changes in drink selections and store in cookies
watch(
  () => drinkCheckedItems.value,
  (val) => {
    const selectedDrinks = Object.keys(val).filter((key) => val[key]);
    Cookies.set(`${props.eventId}-drinks`, JSON.stringify(selectedDrinks), { expires: 1 });
  },
  { deep: true }
);
