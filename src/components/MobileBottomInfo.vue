<script setup lang="ts">
</script>

<template>
    <div class="bottom-box">
        <div>
            <h2 class="header margin-left">ABOUT</h2>
            <div class="flex">
                <div class="box margin-left">
                    <div class="flexColumn">
                        <ul>
                            <li><router-link to="/about">About Us</router-link></li>
                            <li><router-link to="/contact">Contact</router-link></li>
                        </ul>
                    </div>
                </div>
                <div class="box">
                    <div class="flexColumn">
                        <ul>
                            <li><a href="https://www.eventbrite.com/o/hartford-county-speed-dating-73343957833" target="_blank" rel="noopener noreferrer">Register</a></li>
                            <li><router-link to="/match">Match Form</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <hr class="solid">
        <div>
            <h2 class="margin-left">FIND US</h2>
            <div class="flex">
                <div class="box margin-left">
                    <div class="flexColumn">
                        <ul>
                            <li><a href="https://www.facebook.com/sipsandsparks" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href="https://www.instagram.com/sipsandsparks" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div class="box">
                    <div class="flexColumn">
                        <ul>
                            <li><a href="https://www.eventbrite.com/o/hartford-county-speed-dating-73343957833" target="_blank" rel="noopener noreferrer">Eventbrite</a></li>
                            <li><a href="https://www.meetup.com/sipsandsparks/" target="_blank" rel="noopener noreferrer">Meetup</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&family=Syncopate:wght@400;700&display=swap');
@import '../assets/fonts/Mourgen/stylesheet.css';

.flex {
    display: flex;
    justify-content: flex-start;
}

.margin-left {
    margin-left: 20px;
}

.bottom-box {
    background-color: rgba(190, 190, 190);
}

.box {
  flex: 1;
  display: flex;
}

.flexColumn {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header {
    padding-top: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 4.75dvw;
    text-align: left;
    color: #515151;
}

h2 {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 4.75dvw;
    text-align: left;
    color: black;
    margin-bottom: -1%;
}

a {
  color: inherit;
  text-decoration: inherit;
}

a:hover {
    text-decoration: underline;
}

hr.solid {
  border: 1px dashed #515151;
  margin-inline: 20px;
}
</style>