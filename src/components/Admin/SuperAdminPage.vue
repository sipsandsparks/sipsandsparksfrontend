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

const isTablet = computed(() => {
  return windowWidth.value >= 450;
});

const isBigTablet = computed(() => {
  return windowWidth.value >= 639;
});

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

const loadParticipants = async () => {
    try {
        // Make the POST request to the backend server
        const response = await axios.post('https://sips-and-sparks-77e98866d158.herokuapp.com/admin/event-participants', {
            username: username.value,
            password: password.value,
            eventId: selectedEventId.value
        });

        if (response.data.error) {
            toastMessage.value = response.data.error;
            toastVisible.value = true;
        } else {
            participants.value = response.data.public_attendees;
            adminParticipants.value = response.data.admin_attendees;
            toastMessage.value = 'Success!'
            return;
        }
    
        setTimeout(() => {
            toastFadeout.value = true;
        }, 3000);
        setTimeout(() => {
            toastVisible.value = false;
            toastFadeout.value = false;
        }, 4000);
    } catch (error) {
        toastMessage.value = 'Error. Please try again later or contact us.';
        toastVisible.value = true;
        setTimeout(() => {
            toastFadeout.value = true;
        }, 3000);
        setTimeout(() => {
            toastVisible.value = false;
            toastFadeout.value = false;
        }, 3500);
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
}
</script>

<template>
    <div>
        <AdminLogin v-if="availableEvents.length === 0" :is-tablet="isBigTablet" @continue="continueToEventSelection" />
        <AdminEventSelection v-else-if="availableEvents.length > 0 && !selectedEventId" :is-tablet="isTablet" :events="availableEvents" @continue="continueToForm" />
        <AdminChooseView v-else-if="selectedEventId && !continueToAdminForm && !continueToNormalForm" :is-tablet="isBigTablet" @continue="continueToView" />
        <MatchForm v-else-if="selectedEventId && continueToNormalForm && participants.length > 0" :is-tablet="isTablet" :participants="participants" :event-id="selectedEventId" :first-name="''" :last-name="''" :email="''" :previous-info="undefined" :disable-submit="true" />
        <HostPage v-else-if="selectedEventId && continueToAdminForm && adminParticipants.length > 0" :is-tablet="isTablet" :participants="adminParticipants" :event-id="selectedEventId" :first-name="''" :last-name="''" :email="''" :disable-refresh="true" />
        <div id="snackbar" :class="{show: toastVisible, fadeout: toastFadeout}">{{ toastMessage }}</div>
    </div>
</template>

<style scoped>
/* The snackbar - position it at the bottom and in the middle of the screen */
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
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.25rem;
}
    
/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
    visibility: visible; /* Show the snackbar */
    -webkit-animation: fadein 0.5s;
    animation: fadein 0.5s;
}

#snackbar.fadeout {
    -webkit-animation: fadeout 0.5s forwards;
    animation: fadeout 0.5s forwards;
}
    
/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 10vh; opacity: 1;}
}
    
@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 10vh; opacity: 1;}
}
    
@-webkit-keyframes fadeout {
    from {bottom: 10vh; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
    
@keyframes fadeout {
    from {bottom: 10vh; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
</style>