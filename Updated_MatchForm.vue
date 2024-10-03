<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import axios from 'axios';
import type { EventParticipant, PreviousInfo } from '../MatchPage.vue';
import Cookies from 'js-cookie';

const props = defineProps<{
  isTablet: boolean;
  participants: EventParticipant[];
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  previousInfo: PreviousInfo | undefined;
  disableSubmit?: boolean;
}>();

const referralInfoOptions = new Set([
  "Facebook advertisement",
  "Facebook group",
  "Facebook event",
  "Instagram advertisement",
  "Instagram post",
  "Friend/family/coworker",
  "I've attended an event in the past"
]);

const toastVisible = ref(false);
const toastFadeout = ref(false);
const requestLoading = ref(false);
const toastMessage = ref('Sending...');
const success = ref(false);
const notes = ref(props.previousInfo?.notes ?? (Cookies.get(`${props.eventId}-notes`) || ''));
const feedback = ref(props.previousInfo?.feedback ?? (Cookies.get(`${props.eventId}-feedback`) || ''));
const websiteFeedback = ref(props.previousInfo?.websiteFeedback ?? (Cookies.get(`${props.eventId}-websiteFeedback`) || ''));
const referralInfo = ref(
  props.previousInfo?.referralInfo
    ? referralInfoOptions.has(props.previousInfo.referralInfo)
      ? props.previousInfo.referralInfo
      : 'Other'
    : Cookies.get(`${props.eventId}-referralInfo`) || ''
);
const otherReferralInfo = ref(
  props.previousInfo?.referralInfo ?? (Cookies.get(`${props.eventId}-otherReferralInfo`) || '')
);
const cellPhone = ref(props.previousInfo?.cellPhone ?? (Cookies.get(`${props.eventId}-cellPhone`) || ''));
const acceptTerms = ref(false);

const submitForm = async () => {
  if (!acceptTerms.value || !notes.value || !feedback.value || requestLoading.value) {
    return;
  }
  requestLoading.value = true;
  try {
    // Simulated API call, replace this with the actual Eventbrite integration if needed
    await axios.post('/api/submit', {
      eventId: props.eventId,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      notes: notes.value,
      feedback: feedback.value,
      referralInfo: referralInfo.value,
      cellPhone: cellPhone.value
    });
    success.value = true;
  } catch (e) {
    toastMessage.value = 'Error sending the form.';
  } finally {
    requestLoading.value = false;
    toastVisible.value = true;
    setTimeout(() => {
      toastFadeout.value = true;
    }, 3000);
  }
};
</script>

<template>
  <div class="match-form">
    <h2>Sips and Sparks Match Form</h2>
    <form @submit.prevent="submitForm">
      <!-- Name Input -->
      <div class="form-group">
        <label for="name">Full Name:</label>
        <input type="text" id="name" v-model="props.firstName" required />
      </div>

      <!-- Email Input -->
      <div class="form-group">
        <label for="email">Email Address:</label>
        <input type="email" id="email" v-model="props.email" required />
      </div>

      <!-- Phone Number -->
      <div class="form-group">
        <label for="cellPhone">Cell Phone:</label>
        <input type="tel" id="cellPhone" v-model="cellPhone" placeholder="Enter your phone number" />
      </div>

      <!-- Feedback Text Area -->
      <div class="form-group">
        <label for="feedback">Feedback:</label>
        <textarea id="feedback" v-model="feedback" placeholder="Enter your feedback" required></textarea>
      </div>

      <!-- Terms Checkbox -->
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="acceptTerms" /> I agree to the terms and conditions.
        </label>
      </div>

      <!-- Submit Button -->
      <div class="form-group">
        <button type="submit" :disabled="requestLoading">Submit</button>
      </div>
    </form>

    <p v-if="toastVisible" class="toast">{{ toastMessage }}</p>
  </div>
</template>

<style scoped>
.match-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 2px solid #e5e5e5;
  border-radius: 10px;
  font-family: 'Arial', sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: bold;
  color: #4d0011;
}

.form-group {
  margin-bottom: 20px;
}

input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #ffccd5;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.toast {
  text-align: center;
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
