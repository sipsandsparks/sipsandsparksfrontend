<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';
import axios from 'axios';

defineProps<{
  isTablet: boolean;
}>();

const emit = defineEmits<{
  (e: 'continue', eventId: string): void;
}>();

interface Event {
    id: string;
    name: string;
    date: Date;
}

const loading = ref(true);
const error: Ref<string | undefined> = ref(undefined);
const events: Ref<Event[]> = ref([]);
const selectedEventId: Ref<string | undefined> = ref(undefined);
    
onMounted(async () => {
    try {
        const response = await axios.get('https://sips-and-sparks-77e98866d158.herokuapp.com/events');
        if (response.data.error) {
            error.value = response.data.error + ' Refresh the page to try again.';
        } else {
            events.value = response.data.events.map((element: any) => ({id: element.id, name: element.name, date: new Date(element.start)}));
        }
    } catch (e) {
        error.value = "Failed to load event data. Refresh the page to try again.";
    }
    loading.value = false;
});

const submitForm = () => {
    if (selectedEventId.value) {
        emit('continue', selectedEventId.value);
    }
};

const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
        month: 'long', // Full month name (e.g., "June")
        day: 'numeric', // Day of the month (e.g., 27)
        hour: 'numeric', // Hour in 12-hour clock (e.g., 6)
        minute: 'numeric', // Minutes (e.g., 45)
        hour12: true // Whether to use 12-hour clock (true) or 24-hour clock (false)
    });
};
</script>

<template>
    <div :class="loading && isTablet ? 'loadingBody' : 'body'">
        <section class="contact">
            <h2>MATCH FORM</h2>
            <div v-if="loading" class="flex">
                <div class="loader"></div>
                <p class="loading">Loading events...</p>
            </div>
            <div v-else-if="error">
                <p class="loading red">{{ error }}</p>
            </div>
            <div v-else>
                <p v-if="events.length === 0" class="loading">There are not currently any eligible events for the match form.</p>
                <form v-else @submit.prevent="submitForm">
                    <fieldset class="event-selection">
                        <legend>Which event are you attending?</legend>
                        <div v-for="item in events" :key="item.id">
                            <input type="radio" :id="item.id" :value="item.id" name="eventSelection" v-model="selectedEventId">
                            <label :for="item.id">{{ formatDate(item.date) + ' - ' + item.name }}</label>
                        </div>
                    </fieldset>

                    <div class="button-box">
                        <button type="submit" :disabled="!selectedEventId">CONTINUE</button>
                    </div>
                </form>
            </div>
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

.loadingBody {
    display: flex;
    align-items: center;
    padding-top: 80px;
    padding-bottom: 15px;
    margin-left: -32px;
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

.event-selection div {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.event-selection input[type="radio"] {
  -webkit-appearance: none; /* Remove default styles */
  -moz-appearance: none; /* Remove default styles */
  appearance: none; /* Remove default styles */
  width: 20px; /* Set custom width */
  height: 20px; /* Set custom height */
  border: 1px solid #ccc; /* Optional: Add a border for clarity */
  border-radius: 50%; /* Round the checkbox */
  margin-right: 10px; /* Add spacing between checkbox and label */
  cursor: pointer; /* Change cursor to pointer on hover */
  flex-shrink: 0;
}

.event-selection input[type="radio"]:checked {
  background-color: #007BFF; /* Optional: Change background color when checked */
}

.event-selection label {
  cursor: pointer; /* Change cursor to pointer on hover */
  font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
    font-size: 1.75rem;
    text-align: left;
}

.loading {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 2rem;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1); /* Border width and color */
  border-radius: 50%; /* Make it a circle */
  border-top: 4px solid #007BFF; /* Color of the spinner */
  width: 30px; /* Width of the spinner */
  height: 30px; /* Height of the spinner */
  animation: spin 1s linear infinite; /* Animation: name duration timing-function iteration-count */
  margin-right: 10px; /* Add spacing between spinner and text */
}

.red {
    color: #cc0000;
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