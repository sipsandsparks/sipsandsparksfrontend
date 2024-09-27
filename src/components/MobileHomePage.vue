<script setup lang="ts">
import MobileAboutBoxes from '@/components/MobileAboutBoxes.vue';
import MobileBottomInfo from '@/components/MobileBottomInfo.vue';
import { onMounted } from 'vue';

import { useRouter } from 'vue-router';

const router = useRouter();

const scrollToAbout = () => {
  const aboutElement = document.querySelector('#about');
  if (aboutElement instanceof HTMLElement) {
    window.scrollTo({
      top: aboutElement.offsetTop - 60,
      behavior: 'smooth',
    });
  }
};

// Scroll to #about when route changes to "/about"
router.afterEach((to, from) => {
  if (to.path === '/about') {
    scrollToAbout();
  }
});


onMounted(() => {
  if (router.currentRoute.value.name === 'about') {
    scrollToAbout();
  }
});
</script>

<template>
    <div class="container">
        <div class="cover flexEnd">
            <div class="overlay"></div>
            <h2 class="marginBottom marginLeft">DATING THE OLD FASHIONED WAY</h2>
        </div>
        <div id="about">
            <MobileAboutBoxes />
        </div>
        <div>
            <MobileBottomInfo />
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&family=Syncopate:wght@400;700&display=swap');
@import '../assets/fonts/Mourgen/stylesheet.css';

.container {
  display: flex;
  flex-direction: column;
}

.cover {
    background-image: url('../assets/cover-image.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 1000px;
    width: 100%;
}

.marginLeft {
    margin-left: 20px;
}

.marginBottom {
    margin-bottom: 30px;
}

.flex {
    display: flex;
}

.flexEnd {
    display: flex;
    align-items: flex-end;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.4);
  z-index: 0;
}

h2, h1 {
    font-family: "Syncopate", sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 6dvw;
    text-overflow: wrap;
    color: black;
    z-index: 10;
}

h1 {
    font-size: 7.5dvw;
}

@media screen and (max-width: 767px) {
    .cover {
        background-size: cover;
        height: 700px;
    }
  }
</style>