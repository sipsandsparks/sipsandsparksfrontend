<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import MatchAuthorization from './Match/MatchAuthorization.vue';
import EventSelection from './Match/EventSelection.vue';
import MatchForm from './Match/MatchForm.vue';
import HostPage from './Match/HostPage.vue';

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

export interface PreviousInfo {
  interests: string[];
  feedback: string;
  referralInfo: string;
  cellPhone: string;
  notes: string;
  websiteFeedback: string;
  sendContactToNonMutual: boolean;
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

const selectedEventId: Ref<string | undefined> = ref(undefined);
const authorized = ref(false);
const participants: Ref<EventParticipant[] | undefined> = ref(undefined);
const adminParticipants: Ref<AdminEventParticipant[] | undefined> = ref(undefined);
const previousInfo: Ref<PreviousInfo | undefined> = ref(undefined);

const firstName = ref('');
const lastName = ref('');
const email = ref('');

const continueToAuthorization = (eventId: string) => {
  selectedEventId.value = eventId;
};

const continueToAdmin = (eventParticipants: AdminEventParticipant[], fName: string, lName: string, aEmail: string) => {
  adminParticipants.value = eventParticipants.sort((a, b) => (parseInt(a.id) ?? 0) - (parseInt(b.id) ?? 0));
  firstName.value = fName;
  lastName.value = lName;
  email.value = aEmail;
  authorized.value = true;
};

const continueToForm = (eventParticipants: EventParticipant[], fName: string, lName: string, aEmail: string, prevInfo?: PreviousInfo) => {
  participants.value = eventParticipants.sort((a, b) => (parseInt(a.id) ?? 0) - (parseInt(b.id) ?? 0));
  firstName.value = fName;
  lastName.value = lName;
  email.value = aEmail;
  previousInfo.value = prevInfo;
  authorized.value = true;
};
</script>

<template>
    <div>
        <EventSelection v-if="!selectedEventId" :is-tablet="isTablet" @continue="continueToAuthorization" />
        <MatchAuthorization v-else-if="!authorized" :is-tablet="isBigTablet" :event-id="selectedEventId" @continue="continueToForm" @admin="continueToAdmin" />
        <HostPage v-else-if="adminParticipants" :is-tablet="isTablet" :participants="adminParticipants" :event-id="selectedEventId" :first-name="firstName" :last-name="lastName" :email="email" />
        <MatchForm v-else :is-tablet="isTablet" :participants="participants ?? []" :event-id="selectedEventId" :first-name="firstName" :last-name="lastName" :email="email" :previous-info="previousInfo" />
    </div>
</template>