<template>
  <div>
    <AdminLogin v-if="availableEvents.length === 0" :is-tablet="isBigTablet" @continue="continueToEventSelection" />
    <AdminEventSelection v-else-if="availableEvents.length > 0 && !selectedEventId" :is-tablet="isTablet" :events="availableEvents" @continue="continueToForm" />
    <AdminChooseView v-else-if="selectedEventId && !continueToAdminForm && !continueToNormalForm" :is-tablet="isBigTablet" @continue="continueToView" />
    <MatchForm v-else-if="selectedEventId && continueToNormalForm && participants.length > 0" :is-tablet="isTablet" :participants="participants" :event-id="selectedEventId" :first-name="''" :last-name="''" :email="''" :previous-info="undefined" :disable-submit="true" />
    <HostPage v-else-if="selectedEventId && continueToAdminForm && adminParticipants.length > 0" :is-tablet="isTablet" :participants="adminParticipants" :event-id="selectedEventId" :first-name="''" :last-name="''" :email="''" :disable-refresh="true" />
    
    <!-- Add your checkbox for no-show management -->
    <div v-for="participant in adminParticipants" :key="participant.email">
      <label>
        <input type="checkbox" v-model="noShowCheckedItems[participant.email]" />
        No Show
      </label>
    </div>

    <div id="snackbar" :class="{ show: toastVisible, fadeout: toastFadeout }">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import axios from 'axios';
import AdminLogin from './AdminLogin.vue';
import AdminEventSelection from './AdminEventSelection.vue';
import AdminChooseView from './AdminChooseView.vue';
import MatchForm from '../Match/MatchForm.vue';
import HostPage from '../Match/HostPage.vue';

export interface EventParticipant {
    id: string;
    name: string;
}

export interface AdminEventParticipant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  inAttendance: boolean;
  noShow?: boolean;  // Add noShow attribute
}

export interface Event {
    id: string;
    name: string;
    date: Date;
}

const windowWidth = ref(window.innerWidth);

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});

const isTablet = computed(() => windowWidth.value >= 450);
const isBigTablet = computed(() => windowWidth.value >= 639);

const toastVisible = ref(false);
const toastFadeout = ref(false);
const toastMessage = ref('Loading...');
const selectedEventId: Ref<string | undefined> = ref(undefined);
const availableEvents = ref<Event[]>([]);
const username = ref('');
const password = ref('');
const continueToNormalForm = ref(false);
const continueToAdminForm = ref(false);
const participants = ref<EventParticipant[]>([]);
const adminParticipants = ref<AdminEventParticipant[]>([]);
const noShowCheckedItems = ref({});  // Add ref for checkbox

// Helper to show toast notifications
const showToast = (message: string, duration: number = 4000) => {
  toastMessage.value = message;
  toastVisible.value = true;
  toastFadeout.value = false;

  setTimeout(() => {
    toastFadeout.value = true;
  }, duration - 1000);

  setTimeout(() => {
    toastVisible.value = false;
    toastFadeout.value = false;
  }, duration);
};

const loadParticipants = async () => {
  try {
    const response = await axios.post('https://sips-and-sparks-77e98866d158.herokuapp.com/admin/event-participants', {
      username: username.value,
      password: password.value,
      eventId: selectedEventId.value
    });

    if (response.data.error) {
      showToast(response.data.error);
    } else {
      participants.value = response.data.public_attendees;
      adminParticipants.value = response.data.admin_attendees;
      adminParticipants.value.forEach((participant) => {
        noShowCheckedItems.value = {
          ...noShowCheckedItems.value,
          [participant.email]: participant.noShow || false,
        };
      });
      showToast('Success!');
    }
  } catch (error) {
    showToast('Error. Please try again later or contact us.');
  }
};

const continueToEventSelection = (events: Event[], user: string, pass: string) => {
  username.value = user;
  password.value = pass;
  availableEvents.value = events;
};

const continueToForm = (eventId: string) => {
  selectedEventId.value = eventId;
};

const continueToView = async (viewNormal: boolean) => {
  if (viewNormal) {
    continueToAdminForm.value = false;
    await loadParticipants();
    continueToNormalForm.value = true;
  } else {
    continueToNormalForm.value = false;
    await loadParticipants();
    continueToAdminForm.value = true;
  }
};
</script>

<style scoped>
#snackbar {
  visibility: hidden;
  min-width: 250px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  bottom: 10vh;
  font-family: "Darker Grotesque", sans-serif;
  font-weight: 650;
  font-size: 1.25rem;
}

#snackbar.show {
  visibility: visible;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@keyframes fadein {
  from { bottom: 0; opacity: 0; }
  to { bottom: 10vh; opacity: 1; }
}

@keyframes fadeout {
  from { bottom: 10vh; opacity: 1; }
  to { bottom: 0; opacity: 0; }
}
</style>
