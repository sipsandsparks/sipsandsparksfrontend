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

const referralInfoOptions = new Set(["Facebook advertisement", "Facebook group", "Facebook event", "Instagram advertisement", "Instagram post", "Friend/family/coworker", "I've attended an event in the past"]);

const toastVisible = ref(false);
const toastFadeout = ref(false);
const requestLoading = ref(false);
const toastMessage = ref('Sending...');
const success = ref(false);
const notes = ref(props.previousInfo?.notes ?? (Cookies.get(`${props.eventId}-notes`) || ''));
const feedback = ref(props.previousInfo?.feedback ?? (Cookies.get(`${props.eventId}-feedback`) || ''));
const websiteFeedback = ref(props.previousInfo?.websiteFeedback ?? (Cookies.get(`${props.eventId}-websiteFeedback`) || ''));
const referralInfo = ref(props.previousInfo?.referralInfo ? (referralInfoOptions.has(props.previousInfo.referralInfo) ?  props.previousInfo.referralInfo : 'Other') : (Cookies.get(`${props.eventId}-referralInfo`) || ''));
const otherReferralInfo = ref(props.previousInfo?.referralInfo ?? (Cookies.get(`${props.eventId}-otherReferralInfo`) || ''));
const cellPhone = ref(props.previousInfo?.cellPhone ?? (Cookies.get(`${props.eventId}-cellPhone`) || ''));
const sendContactToNonMutual = ref(props.previousInfo?.sendContactToNonMutual ?? (Cookies.get(`${props.eventId}-sendContactToNonMutual`) || 'true') === 'true');

const checkedItems: Ref<Record<string, boolean>> = ref(props.previousInfo?.interests ? Object.fromEntries(props.previousInfo?.interests.map((key) => [key, true])) : Object.fromEntries(JSON.parse(Cookies.get(`${props.eventId}-matches`) || '[]').map((key: string) => [key, true])));

// const isAnyoneChecked = computed(() => Object.values(checkedItems.value).filter((val) => val === true).length > 0);
const clearCookies = () => {
    Cookies.remove(`${props.eventId}-notes`);
    Cookies.remove(`${props.eventId}-feedback`);
    Cookies.remove(`${props.eventId}-websiteFeedback`);
    Cookies.remove(`${props.eventId}-referralInfo`);
    Cookies.remove(`${props.eventId}-otherReferralInfo`);
    Cookies.remove(`${props.eventId}-matches`);
    Cookies.remove(`${props.eventId}-cellPhone`);
    Cookies.remove(`${props.eventId}-sendContactToNonMutual`);
}
    
const submitForm = async () => {
    requestLoading.value = true;
    try {
        toastMessage.value = 'Sending...';
        toastVisible.value = true;
        // Make the POST request to the backend server
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

watch(
    () => notes.value,
    (val) => {
        Cookies.set(`${props.eventId}-notes`, val, { expires: 1});
    }
);

watch(
    () => feedback.value,
    (val) => {
        Cookies.set(`${props.eventId}-feedback`, val, { expires: 1});
    }
);

watch(
    () => websiteFeedback.value,
    (val) => {
        Cookies.set(`${props.eventId}-websiteFeedback`, val, { expires: 1});
    }
);

watch(
    () => referralInfo.value,
    (val) => {
        Cookies.set(`${props.eventId}-referralInfo`, val, { expires: 1});
    }
);

watch(
    () => otherReferralInfo.value,
    (val) => {
        Cookies.set(`${props.eventId}-otherReferralInfo`, val, { expires: 1});
    }
);

watch(
    () => checkedItems.value,
    (val) => {
        Cookies.set(`${props.eventId}-matches`, JSON.stringify(Object.keys(Object.fromEntries(Object.entries(val).filter(([key, value]) => value)))), { expires: 1});
    },
    { deep: true }
);

watch(
    () => cellPhone.value,
    (val) => {
        Cookies.set(`${props.eventId}-cellPhone`, val, { expires: 1});
    }
);

watch(
    () => sendContactToNonMutual.value,
    (val) => {
        Cookies.set(`${props.eventId}-sendContactToNonMutual`, String(val), { expires: 1});
    }
);
</script>

<template>
    <div class="body">
        <section class="contact" v-if="!success">
            <h2 style="margin-bottom: 20px">MATCH FORM</h2>
            <h3 v-if="previousInfo" class="legend-note" style="color: red; margin-top: -10px">WARNING: You are currently viewing your previously submitted response. If you submit this form again it will override what you previously submitted.</h3>
            <form @submit.prevent="submitForm">
                <fieldset class="event-selection" style="margin-bottom: 20px;">
                    <legend>What is your cell phone number?</legend>
                    <div class="button-box">
                        <span class="legend-note">This will be sent out to your mutual matches!</span>
                    </div>
                    <div class="input-field field full-width">
                        <input type="text" v-model="cellPhone" class="item smallitem" autocomplete="off" maxlength="17" :disabled="requestLoading" />
                    </div>
                    <div class="optin">
                        <input type="checkbox" id="optin" v-model="sendContactToNonMutual" :disabled="requestLoading" />
                        <label for="optin">Send contact info to non-mutual matches</label>
                    </div>
                    <div class="button-box">
                        <span class="legend-note">If selected, your contact information will be shared with people you chose who did not choose you in return. This allows them the opportunity to reconsider their decision, knowing you're interested.</span>
                    </div>
                </fieldset>
                <hr>
                <fieldset class="event-selection" style="margin-bottom: 20px;">
                    <legend>Notes</legend>
                    <div class="button-box">
                        <span class="legend-note">Use this area to take notes that you can view later <b style="color: black;">to help you remember who's who after tonight!</b></span>
                    </div>
                    <div class="input-field field full-width">
                        <textarea type="text" v-model="notes" class="item itemarea" autocomplete="off" :disabled="requestLoading" />
                    </div>
                </fieldset>
                <fieldset class="event-selection" style="margin-bottom: 20px;">
                    <legend style="margin-bottom: 1.25rem">Who would you like to see again after today?</legend>
                    <div v-for="person in participants" :key="person.id">
                        <input type="checkbox" :id="'checkbox-' + person.id" v-model="checkedItems[person.id]" :disabled="requestLoading" />
                        <label :for="'checkbox-' + person.id">{{ person.id + '. ' + person.name }}</label>
                    </div>
                </fieldset>
                <hr>
                <fieldset class="event-selection" style="margin-bottom: 20px;">
                    <legend>Feedback</legend>
                    <div class="button-box">
                        <span class="legend-note">Please share your feedback on the venue, event flow, icebreaker questions, host, and anything else that stood out! What went well? What could still use improvement?</span>
                    </div>
                    <div class="input-field field full-width">
                        <textarea type="text" v-model="feedback" class="item itemarea" autocomplete="off" :disabled="requestLoading" />
                    </div>
                </fieldset>
                <fieldset class="event-selection" style="margin-bottom: 20px;">
                    <legend>Where did you hear about this event?</legend>
                    <div class="button-box">
                        <span class="legend-note">Also, if you enjoyed tonight's event and could take a minute to leave us
                        a review on <a href="https://www.facebook.com/sipsandsparks" target="_blank" rel="noopener noreferrer">Facebook</a> we would really appreciate it!</span>
                    </div>
                    <div>
                        <select class="minimal-dropdown" :disabled="requestLoading" v-model="referralInfo" required>
                            <option value="Facebook advertisement">Facebook advertisement</option>
                            <option value="Facebook group">Facebook group</option>
                            <option value="Facebook event">Facebook event</option>
                            <option value="Instagram advertisement">Instagram advertisement</option>
                            <option value="Instagram post">Instagram post</option>
                            <option value="Friend/family/coworker">Friend/family/coworker</option>
                            <option value="I've attended an event in the past">I've attended an event in the past</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div v-if="referralInfo === 'Other'" class="input-field field full-width">
                        <input type="text" v-model="otherReferralInfo" class="item smallitem" autocomplete="off" :disabled="requestLoading" placeholder="Please provide details *" required />
                    </div>
                </fieldset>
                <fieldset class="event-selection">
                    <legend>Website Feedback</legend>
                    <div class="button-box">
                        <span class="legend-note">Please provide feedback on the website and the match form. Was anything unclear or confusing? What did you find helpful or easy to use? How do you think we could improve the experience?</span>
                    </div>
                    <div class="input-field field full-width">
                        <textarea type="text" v-model="websiteFeedback" class="item itemarea" autocomplete="off" :disabled="requestLoading" />
                    </div>
                </fieldset>
                <div class="button-box">
                    <button type="submit" :disabled="requestLoading || disableSubmit">SUBMIT</button>
                </div>
            </form>
        </section>
        <section class="contact" v-else>
            <h2>Your form has been submitted.</h2>
        </section>
        <div id="snackbar" :class="{show: toastVisible, fadeout: toastFadeout}">{{ toastMessage }}</div>
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

.textarea {
    width: 100%;
    height: 7rem;
}

.flex {
    display: flex;
    align-items: center;
}

.contact form {
    width: 90%; /* Adjust width to 90% of the viewport */
    max-width: 500px; /* Limit maximum width for larger screens */
    text-align: center; /* Center align form elements */
    margin-bottom: 30px;
}

form .button-box {
    display: flex;
}

form .input-box {
    display: flex;
    justify-content: space-between;
}

.field .item {
    width: 100%;
    padding-top: 18px;
    padding-bottom: 18px;
    padding-left: 18px;
    background: transparent;
    border: 2px solid rgb(136,136,136);
    outline: none;
    margin: 12px 0;
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.5rem;
    color: black;
}

.field .smallitem {
    padding: 0;
    padding-left: 5px;
    padding-right: 5px;
    font-weight: 600;
    font-size: 1.25rem;
    height: 2.75rem;
    margin-top: -0.125rem;
}

.field .itemarea {
    padding: 0;
    padding-left: 5px;
    padding-right: 5px;
    height: 7rem;
    font-weight: 600;
    font-size: 1.25rem; /* Keep the original font size */
    text-align: left;
    line-height: 1; /* Adjust line-height for proper vertical alignment */
    margin-top: -0.125rem;
}

.field .item::placeholder {
    color: rgba(136,136,136,.8);
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.5rem;
}

input[type="text"]:disabled, textarea:disabled {
    color: rgba(136,136,136,.8) !important;
}

input[type="text"]:focus, textarea:focus {
    outline: none !important;
    border: 3px solid rgb(101,101,101);
    box-shadow: 0 0 10px #719ECE;
}

.contact h2 {
    font-family: "Syncopate", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 2rem;
    color: black;
    line-height: 1.4;
    text-align: left;
    margin-bottom: 10px;
}

form button {
    padding: 12px 32px;
    background: black;
    border: none;
    outline: none;
    box-shadow: none;
    color: white;
    cursor: pointer;
    margin-top: 20px;
    transition: 0.1s;
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.5rem;
}

form button:hover {
    box-shadow: 0 0 10px #719ECE;
}

form button:disabled {
    cursor: auto;
    box-shadow: none;
    background: rgba(136,136,136,.8);
}

.event-selection {
  border: none; /* Remove border from fieldset */
  margin: 0; /* Remove default margin */
  padding: 0; /* Remove default padding */
}

.event-selection legend {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 2rem;
    text-align: left;
    margin-bottom: 10px;
    line-height: 90%;
}

.event-selection label {
    cursor: pointer;
    font-family: "Darker Grotesque", sans-serif;
    font-weight: 600;
    font-size: 1.75rem; /* Keep the original font size */
    text-align: left;
    line-height: 1.4; /* Adjust line-height for proper vertical alignment */
    display: flex; /* Use flexbox */
    align-items: center; /* Align items vertically */
    margin-bottom: 3px;
}

.optin label {
    font-size: 1.5rem; /* Keep the original font size */
    line-height: 1; /* Adjust line-height for proper vertical alignment */
    margin-bottom: 3px;
}

.event-selection div {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* Adjust spacing between each checkbox and label */
}

.event-selection input[type="checkbox"] {
    width: 20px;
    height: 20px;
    margin-right: 10px; /* Adjust spacing between checkbox and label */
    flex-shrink: 0;
}

.legend-note {
    font-size: 1.25rem; /* Smaller text size */
    color: grey; /* Grey color */
    text-align: left;
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    line-height: 90%;
}

.loading {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 2rem;
}

.minimal-dropdown {
  width: 100%;
  height: 2.75rem; /* Match the height of the .smallitem input */
  padding: 0;
  padding-left: 5px;
  padding-right: 5px;
  background: transparent;
  border: 2px solid rgb(136, 136, 136);
  font-family: "Darker Grotesque", sans-serif;
  font-weight: 650;
  font-size: 1.5rem;
  color: black;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><polygon points="5,6 10,11 15,6" fill="%23333"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
}

.minimal-dropdown:focus {
  outline: none;
  border: 3px solid rgb(101, 101, 101);
  box-shadow: 0 0 10px #719ECE;
}


@keyframes spin {
  0% {
    transform: rotate(0deg); /* Starting rotation */
  }
  100% {
    transform: rotate(360deg); /* Ending rotation */
  }
}

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

  @media screen and (min-width: 450px) {
    .body, .loadingBody {
        justify-content: center;
    }
  }

  @media screen and (min-width: 800px) {
    .body, .loadingBody {
        margin-top: 8%;
    }
  }

  @media screen and (min-width: 1200px) {
    .body, .loadingBody {
        margin-top: 1%;
    }
    .contact form {
        max-width: 700px;
    }
  }

  textarea {
  resize: none;
}

</style>