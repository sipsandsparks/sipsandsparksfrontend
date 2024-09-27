<script setup lang="ts">
</script>

<template>
    <div class="flex bottom-box" style="margin-top: 60px">
        <div class="box left">
            <div class="flexColumn">
                <h2>ABOUT</h2>
                <ul>
                    <li><router-link to="/about">About Us</router-link></li>
                    <li><router-link to="/contact">Contact</router-link></li>
                    <li><a href="https://www.eventbrite.com/o/hartford-county-speed-dating-73343957833" target="_blank" rel="noopener noreferrer">Register</a></li>
                    <li><router-link to="/match">Match Form</router-link></li>
                </ul>
            </div>
        </div>
        <div class="box">
            <div class="flexColumn">
                <h2>FIND US</h2>
                <ul>
                    <li><a href="https://www.facebook.com/sipsandsparks" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                    <li><a href="https://www.instagram.com/sipsandsparks" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><a href="https://www.eventbrite.com/o/hartford-county-speed-dating-73343957833" target="_blank" rel="noopener noreferrer">Eventbrite</a></li>
                    <li><a href="https://www.meetup.com/sipsandsparks/" target="_blank" rel="noopener noreferrer">Meetup</a></li>
                </ul>
            </div>
        </div>
        <div class="box right">
            <div class="flexColumn">
                <h2>SIGN UP TO RECEIVE OUR NEWSLETTER</h2>
                <input disabled placeholder="Coming soon!" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/fonts/Mourgen/stylesheet.css';
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&family=Syncopate:wght@400;700&display=swap');

.flex {
    display: flex;
}

.box {
  flex: 1;
  display: flex;
}

.left {
    margin-left: 5%; /* Adjust margin for smaller screens */
}

.right {
    justify-content: flex-end;
    margin-right: 5%; /* Adjust margin for smaller screens */
    text-align: right;
}

.flexColumn {
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
    padding-top: 40px;
}

.bottom-box {
    background-color: rgba(190, 190, 190);
    width: 100%;
}

ul {
    list-style: none;
    padding: 0;
}

h2, li {
    color: black;
    line-height: 2;
}

h2 {
    font-family: "Syncopate", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 2rem;
    margin-bottom: -4px;
}

li {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 750;
    font-style: normal;
    font-size: 1.75rem;
    color: #515151;
}

input {
    margin-top: 50px;
    background: rgba(190, 190, 190);
    padding-top: 20px;
    padding-bottom: 20px;
    padding-left: 20px;
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 750;
    font-style: normal;
    font-size: 2rem;
    color: black;
    border: 3px solid rgb(101,101,101);
}

input:focus {
    outline: none !important;
    border: 3px solid rgb(101,101,101);
    box-shadow: 0 0 10px #719ECE;
}

a {
  color: inherit;
  text-decoration: inherit;
}

a:hover {
    text-decoration: underline;
}

/* Add a media query to adjust margins for smaller screens */
@media (max-width: 768px) {
    .left,
    .right {
        margin-left: 2%; /* Adjust margin for extra small screens */
        margin-right: 2%; /* Adjust margin for extra small screens */
    }
}
</style>