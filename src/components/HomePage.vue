<script setup lang="ts">
import AboutBoxes from '@/components/AboutBoxes.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const scrollToAbout = () => {
  const aboutElement = document.querySelector('#about');
  if (aboutElement instanceof HTMLElement) {
    window.scrollTo({
      top: aboutElement.offsetTop,
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
</script>

<template>
    <div>
        <div class="flex">
            <div class="box image-box">
                <img src="../assets/home-logo.png" />
            </div>
            <div class="box text-box">
                <div class="overlay"></div>
                <div class="flexColumn">
                    <h1>THE OLD FASHIONED WAY</h1>
                    <p>We're dedicated to fostering genuine connections, promoting 
                        local love stories, and building a community where everyone 
                        feels welcome.
                    </p>
                </div>
            </div>
        </div>
        <div class="flex">
            <div class="box gallery-image no-border">
                <img src="../assets/dating1.jpg" />
            </div>
            <div class="box gallery-image no-border">
                <img src="../assets/dating2.jpg" />
            </div>
            <div class="box gallery-image">
                <img src="../assets/dating3.jpg" />
            </div>
        </div>
        <div id="about">
            <AboutBoxes />
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
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(136,136,136);
  border-bottom-width: 2px;
  position: relative;
}

.flexColumn {
    display: flex;
    flex-direction: column;
    margin-left: 10%;
    margin-right: 10%;
}

.text-box {
  background-image: url('../assets/cover-image.jpg');
  background-size: cover;
  background-position: center;
  filter: grayscale(0%);
}

.no-border {
 border: none;   
}

.image-box img {
  max-width: 100%;
  max-height: 100%;
}

.gallery-image img {
    height: 100%;
    max-width: 100%;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
}

h1, p {
    text-align: center;
    color: black;
    z-index: 1;
    line-height: 1.4;
}

h1 {
    font-family: "Syncopate", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 2rem;
}

p {
    font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 1.75rem;
}
</style>