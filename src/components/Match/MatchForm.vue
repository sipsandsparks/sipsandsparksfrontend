<script setup lang="ts">
import { Ref, ref, watch } from 'vue';
import axios from 'axios';
import type {EventParticipant, PreviousInfo} from '../MatchPage.vue';
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
const referralInfo = ref(props.previousInfo?.referralInfo ? (referralInfoOptions.has(props.previousInfo.referralInfo) ? props.previousInfo.referralInfo : 'Other') : (Cookies.get(`${props.eventId}-referralInfo`) || ''));
const otherReferralInfo = ref(props.previousInfo?.referralInfo ?? (Cookies.get(`${props.eventId}-otherReferralInfo`) || ''));
const cellPhone = ref(props.previousInfo?.cellPhone ?? (Cookies.get(`${props.eventId}-cellPhone`) || ''));
const sendContactToNonMutual = ref(props.previousInfo?.sendContactToNonMutual ?? (Cookies.get(`${props.eventId}-sendContactToNonMutual`) || 'true') === 'true');

const checkedItems: Ref<Record<string, boolean>> = ref(
  props.previousInfo?.interests 
    ? Object.fromEntries(props.previousInfo?.interests.map((key) => [key, true])) 
    : Object.fromEntries(JSON.parse(Cookies.get(`${props.eventId}-matches`) || '[]').map((key: string) => [key, true]))
);

const clearCookies = () => {
    Cookies.remove(`${props.eventId}-notes`);
    Cookies.remove(`${props.eventId}-feedback`);
    Cookies.remove(`${props.eventId}-websiteFeedback`);
    Cookies.remove(`${props.eventId}-referralInfo`);
    Cookies.remove(`${props.eventId}-otherReferralInfo`);
    Cookies.remove(`${props.eventId}-matches`);
    Cookies.remove(`${props.eventId}-cellPhone`);
    Cookies.remove(`${props.eventId}-sendContactToNonMutual`);
};

const submitForm = async () => {
    requestLoading.value = true;
    try {
        toastMessage.value = 'Sending...';
        toastVisible.value = true;
        const response = await axios.post('https://sips-and-sparks-77e98866d158.herokuapp.com/match', {
            firstName: props.firstName,
            lastName: props.lastName,
            email: props.email,
            eventId: props.eventId,
            matches: Object.keys(Object.fromEntries(Object.entries(checkedItems.value).filter(([key, value]) => value))),
            notes: notes.value.trim(),
            feedback: feedback.value.trim(),
            referralInfo: referralInfo.value === 'Other' ? otherReferralInfo.value.trim() : referralInfo.value,
            cellPhone: cellPhone.value.trim(),
            websiteFeedback: websiteFeedback.value.trim(),
            sendContactToNonMutual: sendContactToNonMutual.value
        });
        toastVisible.value = false;

        if (response.data.error) {
            toastMessage.value = response.data.error;
            toastVisible.value = true;
        } else {
            toastMessage.value = 'Success!';
            toastVisible.value = true;
            clearCookies();
            success.value = true;
        }

        setTimeout(() => {
            requestLoading.value = false;
            toastFadeout.value = true;
        }, 3000);
        setTimeout(() => {
            toastVisible.value = false;
            toastFadeout.value = false;
        }, 4000);
    } catch (error) {
        toastFadeout.value = true;
        setTimeout(() => {
            toastVisible.value = false;
            toastFadeout.value = false;
            toastMessage.value = 'Error. Please try again later or contact us.';
            toastVisible.value = true;
        }, 500);
        setTimeout(() => {
            requestLoading.value = false;
            toastFadeout.value = true;
        }, 3500);
        setTimeout(() => {
            toastVisible.value = false;
            toastFadeout.value = false;
        }, 4000);
    }
};

watch(() => notes.value, (val) => {
    Cookies.set(`${props.eventId}-notes`, val, { expires: 1 });
});
watch(() => feedback.value, (val) => {
    Cookies.set(`${props.eventId}-feedback`, val, { expires: 1 });
});
watch(() => websiteFeedback.value, (val) => {
    Cookies.set(`${props.eventId}-websiteFeedback`, val, { expires: 1 });
});
watch(() => referralInfo.value, (val) => {
    Cookies.set(`${props.eventId}-referralInfo`, val, { expires: 1 });
});
watch(() => otherReferralInfo.value, (val) => {
    Cookies.set(`${props.eventId}-otherReferralInfo`, val, { expires: 1 });
});
watch(() => checkedItems.value, (val) => {
    Cookies.set(`${props.eventId}-matches`, JSON.stringify(Object.keys(Object.fromEntries(Object.entries(val).filter(([key, value]) => value)))), { expires: 1 });
}, { deep: true });
watch(() => cellPhone.value, (val) => {
    Cookies.set(`${props.eventId}-cellPhone`, val, { expires: 1 });
});
watch(() => sendContactToNonMutual.value, (val) => {
    Cookies.set(`${props.eventId}-sendContactToNonMutual`, String(val), { expires: 1 });
});
</script>

<template>
    <div class="match-form">
        <h2>Sips and Sparks Match Form</h2>
        <form @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Full Name:</label>
                <input type="text" id="name" v-model="props.firstName" required />
            </div>

            <div class="form-group">
                <label for="email">Email Address:</label>
                <input type="email" id="email" v-model="props.email" required />
            </div>

            <div class="form-group">
                <label for="event">Select Event:</label>
                <select id="event" v-model="props.eventId" required>
                    <option v-for="participant in props.participants" :key="participant.id" :value="participant.id">
                        {{ participant.eventName }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label for="cellPhone">Cell Phone:</label>
                <input type="tel" id="cellPhone" v-model="cellPhone" placeholder="Enter your phone number" />
            </div>

            <div class="form-group">
                <label for="feedback">Feedback:</label>
                <textarea id="feedback" v-model="feedback" placeholder="Enter your feedback" required></textarea>
            </div>

            <div class="form-group">
                <label>
                    <input type="checkbox" v-model="sendContactToNonMutual" /> Send contact info to non-mutual matches
                </label>
            </div>

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
    color: #4d0011; /* Headline color */
}

.form-group {
    margin-bottom: 20px;
}

input[type="text"],
input[type="email"],
textarea,
select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    background-color: #f0f0f0; /* Light grey background */
    color: #333; /* Dark grey text */
}

button {
    width: 100%;
    padding: 12px;
    background-color: #ffccd5; /* Blush pink button */
    border: none;
    color: white;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

button:hover {
    background-color: #ff99a1; /* Darker blush pink */
}

.toast {
    text-align: center;
    color: red;
    font-weight: bold;
    margin-top: 10px;
}
</style>
