<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';
import type {AdminEventParticipant, EventParticipant, PreviousInfo} from '../MatchPage.vue';
import Cookies from 'js-cookie';

const props = defineProps<{
  isTablet: boolean;
  eventId: string;
}>();

const emit = defineEmits<{
  (e: 'continue', participants: EventParticipant[], firstName: string, lastName: string, email: string, previousInfo?: PreviousInfo): void;
  (e: 'admin', participants: AdminEventParticipant[], firstName: string, lastName: string, email: string): void;
}>();

const firstName = ref(Cookies.get('firstName') || '');
const lastName = ref(Cookies.get('lastName') || '');
const email = ref(Cookies.get('email') || '');
const toastVisible = ref(false);
const toastFadeout = ref(false);
const requestLoading = ref(false);
const toastMessage = ref('Sending...');
    
const submitForm = async () => {
    requestLoading.value = true;
    try {
        toastMessage.value = 'Sending...';
        toastVisible.value = true;
        // Make the POST request to the backend server
        const response = await axios.post('https://sips-and-sparks-77e98866d158.herokuapp.com/event-participants', {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            eventId: props.eventId
        });

        if (response.data.error) {
            toastMessage.value = response.data.error;
        } else {
            if (response.data.attendees.some((element: any) => element.email)) {
                emit('admin', response.data.attendees.map((element: any) => ({id: element.id, firstName: element.firstName, lastName: element.lastName, email: element.email, gender: element.gender, inAttendance: element.inAttendance})), firstName.value, lastName.value, email.value);
            } else {
                if (response.data.previousInfo) {
                    const prevInfo = response.data.previousInfo;
                    emit('continue', response.data.attendees.map((element: any) => ({id: element.id, name: element.name})), firstName.value, lastName.value, email.value, {notes: prevInfo.notes, referralInfo: prevInfo.referralInfo, cellPhone: prevInfo.cellPhone, feedback: prevInfo.feedback, interests: prevInfo.interests, websiteFeedback: prevInfo.websiteFeedback, sendContactToNonMutual: prevInfo.sendContactToNonMutual});
                } else {
                    emit('continue', response.data.attendees.map((element: any) => ({id: element.id, name: element.name})), firstName.value, lastName.value, email.value);
                }
            }
            return;
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
    () => firstName.value,
    (val) => {
        Cookies.set('firstName', val, { expires: 1});
    }
);

watch(
    () => lastName.value,
    (val) => {
        Cookies.set('lastName', val, { expires: 1});
    }
);

watch(
    () => email.value,
    (val) => {
        Cookies.set('email', val, { expires: 1});
    }
);
</script>

<template>
    <div class="body">
        <section class="contact">
            <h2>MATCH FORM</h2>
            <form @submit.prevent="submitForm">
                <div class="input-box">
                    <div class="input-field field" :class="isTablet ? 'half-width' : 'full-width'">
                        <input type="text" placeholder="First Name *" v-model="firstName" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                    <div v-if="isTablet" class="input-field field half-width">
                        <input type="text" placeholder="Last Name *" v-model="lastName" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                </div>

                <div v-if="!isTablet" class="input-box">
                    <div class="input-field field full-width">
                        <input type="text" placeholder="Last Name *" v-model="lastName" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                </div>

                <div class="input-box">
                    <div class="input-field field full-width">
                        <input type="text" placeholder="Email *" v-model="email" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                </div>
                <div class="button-box">
                    <p class="legend-note">You must use the email you registered on Eventbrite with. Please ask the host if you are unsure which email you used.</p>
                </div>
                <div class="button-box">
                    <button type="submit" :disabled="requestLoading">CONTINUE</button>
                </div>
            </form>
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
    margin-left: 20px;
    padding-bottom: 15px;
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

.contact form {
    width: 90%;
    text-align: center;
}

.legend-note {
    font-size: 1rem; /* Smaller text size */
    color: grey; /* Grey color */
    text-align: left;
    margin-top: -0.4rem;
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    line-height: 85%;
}

form .input-box {
    display: flex;
    justify-content: space-between;
}

form .button-box {
    display: flex;
    align-items: baseline;
}

.half-width {
    width: 46%;
}

.full-width {
    width: 100%;
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

.field .item::placeholder {
    color: rgba(136,136,136,.8);
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.5rem;
}

form .textarea-field .item {
    resize: none;
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

input[type="text"]:disabled, textarea:disabled {
    color: rgba(136,136,136,.8) !important;
}

input[type="text"]:focus, textarea:focus {
    outline: none !important;
    border: 3px solid rgb(101,101,101);
    box-shadow: 0 0 10px #719ECE;
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

@media screen and (min-width: 639px) {
    .body {
        justify-content: center;
        margin-left: 0;
        padding-right: 18px;
        padding-bottom: 50px;
    }
    .contact form {
        width: 600px;
    }
  }

  @media screen and (min-width: 399px) and (max-width: 638px) {
    .body {
        justify-content: center;
        margin-left: 0;
        padding-right: 18px;
    }
    .contact form {
        width: 340px;
    }
  }

  @media screen and (min-width: 1200px) {
    .body {
        margin-top: 1%;
    }
    .contact form {
        width: 800px;
    }
  }

</style>
    