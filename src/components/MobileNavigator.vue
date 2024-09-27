<script setup lang="ts">
import router from '@/router';

const emit = defineEmits<{
  (e: 'toggleDirectory'): void;
}>();


const goToRoute = async (name: string) => {
    await router.push({name});
    emit('toggleDirectory');
};

document.body.style.overflow = 'hidden';
</script>

<template>
    <div class="container">
        <ul>
            <li @click="goToRoute('home')">HOME</li>
            <hr class="dashed">
            <li @click="goToRoute('about')">ABOUT</li>
            <hr class="dashed">
            <li @click="goToRoute('contact')">CONTACT</li>
            <hr class="dashed">
            <li @click="goToRoute('match')">MATCH FORM</li>
            <hr class="dashed">
        </ul>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

.container {
    padding-top: 80px;
    padding-left: 20px;
    padding-right: 20px;
    position: fixed;
    height: 100%;
    width: 100%;
    z-index: 999; /* Ensure it's on top of everything */
    background-color: rgb(250, 250, 250);
    overflow-y: auto; /* Enable vertical scrolling if necessary */
    box-sizing: border-box; /* Include padding and border in width */
}

ul {
    list-style-type:none;
    padding:0px;
    margin:0px;
}

li {
    color: black;
    line-height: 1.4;
    font-family: "Syncopate", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 7.5dvw;
    text-align: left;
    padding-block: 15px;
}

a {
  color: inherit;
  text-decoration: inherit;
}

hr.dashed {
  border-top: 3px dashed #bbb;
  margin-right: 20px;
}
</style>
