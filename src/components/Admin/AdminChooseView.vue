<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  isTablet: boolean;
}>();

const emit = defineEmits<{
  (e: 'continue', viewNormal: boolean): void;
}>();

const selectedView = ref('');

const submitForm = async () => {
    emit('continue', selectedView.value === 'participant')
};
</script>

<template>
    <div class="body">
        <section class="contact">
            <h2>ADMIN LOGIN</h2>
            <form @submit.prevent="submitForm">
                <fieldset class="event-selection" style="margin-bottom: 20px;">
                    <legend>Who would you like to view the Match Form as?</legend>
                    <div>
                        <input type="radio" id="participantRadio" name="viewSelection" value="participant" v-model="selectedView" />
                        <label for="participantRadio">Participant</label>
                        <input type="radio" id="adminRadio" name="viewSelection" value="admin" v-model="selectedView" />
                        <label for="adminRadio">Host</label>
                    </div>
                </fieldset>
                <div class="button-box">
                    <button type="submit" :disabled="selectedView === ''">CONTINUE</button>
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
    padding-right: 25px;
}

.event-selection div {
    display: flex;
    align-items: center;
    margin-bottom: 10px; /* Adjust spacing between each checkbox and label */
}

.event-selection input[type="radio"] {
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
  }

  textarea {
  resize: none;
}

</style>
    