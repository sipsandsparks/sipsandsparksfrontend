<script setup lang="ts">
import { computed, Ref, ref, watch } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import type {AdminEventParticipant} from '../MatchPage.vue';

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
const attendanceCheckedItems: Ref<Record<string, boolean>> = ref({});
const drinkCheckedItems: Ref<Record<string, boolean>> = ref(Object.fromEntries(JSON.parse(Cookies.get(`${props.eventId}-drinks`) || '[]').map((key: string) => [key, true])));
const eventParticipants = ref<AdminEventParticipant[]>(props.participants);
eventParticipants.value.forEach((person) => {
    if (person.inAttendance) {
        attendanceCheckedItems.value = {...attendanceCheckedItems.value, [person.email]: true};
    }
});
    
const refreshForm = async () => {
    requestLoading.value = true;
    try {
        // Make the POST request to the backend server
        const response = await axios.post('https://sips-and-sparks-77e98866d158.herokuapp.com/event-participants', {
            firstName: props.firstName,
            lastName: props.lastName,
            email: props.email,
            eventId: props.eventId
        });
        if (response.data.attendees) {
            response.data.attendees.forEach((person: any) => {
                if (person.inAttendance) {
                    attendanceCheckedItems.value = {...attendanceCheckedItems.value, [person.email]: true};
                }
            });
            eventParticipants.value = response.data.attendees;
        }
        requestLoading.value = false;
    } catch (error) {
        console.error(error);
        requestLoading.value = false;
    }
};

const maleAttendees = computed(() => eventParticipants.value.filter((att) => att.gender === 'Male'));
const femaleAttendees = computed(() => eventParticipants.value.filter((att) => att.gender === 'Female'));

watch(
    () => drinkCheckedItems.value,
    (val) => {
        Cookies.set(`${props.eventId}-drinks`, JSON.stringify(Object.keys(Object.fromEntries(Object.entries(val).filter(([key, value]) => value)))), { expires: 1});
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
                    <div v-for="person in maleAttendees" :key="person.id">
                        <input type="checkbox" :id="'checkbox1-' + person.email" v-model="attendanceCheckedItems[person.email]" disabled />
                        <input type="checkbox" :id="'checkbox2-' + person.email" v-model="drinkCheckedItems[person.email]" />
                        <label :for="'checkbox2-' + person.email">{{person.id + ' | ' + person.firstName + ' ' + person.lastName}}<br />{{person.email}}</label>
                    </div>

                    <br />
                    <legend>
                        Female Attendees<br />
                        <span class="legend-note">The first checkbox indicates if they have accessed their match form.</span>
                    </legend>
                    <div v-for="person in femaleAttendees" :key="person.id">
                        <input type="checkbox" :id="'checkbox3-' + person.email" v-model="attendanceCheckedItems[person.email]" disabled />
                        <input type="checkbox" :id="'checkbox4-' + person.email" v-model="drinkCheckedItems[person.email]" />
                        <label :for="'checkbox4-' + person.email">{{person.id + ' | ' + person.firstName + ' ' + person.lastName}}<br />{{person.email}}</label>
                    </div>
                </fieldset>

                <div class="button-box">
                    <button type="submit" :disabled="requestLoading || disableRefresh">REFRESH</button>
                </div>
            </form>
        </section>
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

.flex {
    display: flex;
    align-items: center;
}

.contact form {
    width: 90%; /* Adjust width to 90% of the viewport */
    max-width: 500px; /* Limit maximum width for larger screens */
    text-align: center; /* Center align form elements */
}

form .button-box {
    display: flex;
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
  max-width: 100%; /* Ensure fieldset does not exceed screen width */
  word-wrap: break-word;
}

.event-selection legend {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 2rem;
    text-align: left;
    margin-bottom: 10px;
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
    font-size: 0.875em; /* Smaller text size */
    color: grey; /* Grey color */
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.loading {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 2rem;
}

label {
    max-width: 100%;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

@keyframes spin {
  0% {
    transform: rotate(0deg); /* Starting rotation */
  }
  100% {
    transform: rotate(360deg); /* Ending rotation */
  }
}
    
/* Animations to fade the snackbar in and out */
@-webkit-keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}
    
@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 30px; opacity: 1;}
}
    
@-webkit-keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
    
@keyframes fadeout {
    from {bottom: 30px; opacity: 1;}
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
  }

</style>