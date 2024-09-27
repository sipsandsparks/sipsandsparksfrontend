<script setup lang="ts">
import { computed, ref } from 'vue';
import axios from 'axios';

const windowWidth = ref(window.innerWidth);

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});

const isTablet = computed(() => {
  return windowWidth.value >= 639;
});
    
const name = ref('');
const email = ref('');
const message = ref('');
const toastVisible = ref(false);
const requestLoading = ref(false);
const toastMessage = ref('Sending...');
    
const submitForm = async () => {
    requestLoading.value = true;
    try {
        toastMessage.value = 'Sending...';
        toastVisible.value = true;
        // Make the POST request to the backend server
        const response = await axios.post('https://sips-and-sparks-77e98866d158.herokuapp.com/contact', {
            name: name.value,
            email: email.value,
            message: message.value
        });
        toastVisible.value = false;

        if (response.data.error) {
            toastMessage.value = response.data.error;
        } else {  
            // Reset form fields after successful submission
            name.value = '';
            email.value = '';
            message.value = '';
        
            toastMessage.value = 'Contact query submitted!';
        }

        toastVisible.value = true;
    
        // After 3 seconds, remove the show class from DIV
        setTimeout(() => {
            requestLoading.value = false;
            toastVisible.value = false;
        }, 3000);
    } catch (error) {
        // Handle any errors
        toastMessage.value = 'Error. Please try again later.';
        setTimeout(() => {
            name.value = '';
            email.value = '';
            message.value = '';
            requestLoading.value = false;
            toastVisible.value = false;
        }, 3000);
    }
};
</script>

<template>
    <div class="body">
        <section class="contact">
            <h2>CONTACT US</h2>
            <form @submit.prevent="submitForm">
                <div class="input-box">
                    <div class="input-field field" :class="isTablet ? 'half-width' : 'full-width'">
                        <input type="text" placeholder="Name *" v-model="name" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                    <div v-if="isTablet" class="input-field field half-width">
                        <input type="text" placeholder="Email *" v-model="email" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                </div>

                <div v-if="!isTablet" class="input-box">
                    <div class="input-field field full-width">
                        <input type="text" placeholder="Email *" v-model="email" class="item" autocomplete="off" :disabled="requestLoading" required />
                    </div>
                </div>

                <div class="textarea-field field">
                    <textarea name="" cols="30" rows="6" v-model="message" placeholder="Comment" class="item" autocomplete="off" :disabled="requestLoading" required></textarea>
                </div>
                <div class="button-box">
                    <button type="submit" :disabled="requestLoading">Send</button>
                </div>
            </form>
        </section>
        <div id="snackbar" v-if="toastVisible" class="show">{{ toastMessage }}</div>
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
    visibility: hidden; /* Hidden by default. Visible on click */
    min-width: 250px; /* Set a default minimum width */
    margin-left: -125px; /* Divide value of min-width by 2 */
    background-color: #333; /* Black background color */
    color: #fff; /* White text color */
    text-align: center; /* Centered text */
    border-radius: 2px; /* Rounded borders */
    padding: 16px; /* Padding */
    position: fixed; /* Sit on top of the screen */
    z-index: 1; /* Add a z-index if needed */
    left: 50%; /* Center the snackbar */
    bottom: 10vh; /* 30px from the bottom */
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.25rem;
}
    
/* Show the snackbar when clicking on a button (class added with JavaScript) */
#snackbar.show {
    visibility: visible; /* Show the snackbar */
    /* Add animation: Take 0.5 seconds to fade in and out the snackbar.
    However, delay the fade out process for 2.5 seconds */
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
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

</style>
    