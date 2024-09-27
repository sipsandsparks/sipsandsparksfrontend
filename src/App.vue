<script setup lang="ts">
import MainToolbar from '@/components/MainToolbar.vue';
import BottomInfo from '@/components/BottomInfo.vue';
import { computed, ref } from 'vue';
import MobileMainToolbar from './components/MobileMainToolbar.vue';
import MobileNavigator from './components/MobileNavigator.vue';

const windowWidth = ref(window.innerWidth);

window.addEventListener('resize', () => {
  windowWidth.value = window.innerWidth;
});

const isDesktop = computed(() => {
  return windowWidth.value >= 1200;
});

const isDirectoryOpen = ref(false);

const setDirectoryOpenStatus = () => {
  isDirectoryOpen.value = !isDirectoryOpen.value;
  if (isDirectoryOpen.value === false) {
    document.body.style.overflow = '';
  }
};
</script>

<template>
  <div id="container">
    <MainToolbar v-if="isDesktop" id="header" />
    <MobileMainToolbar v-else id="header" :is-directory-open="isDirectoryOpen" @toggleDirectory="setDirectoryOpenStatus" />
    <div id="content">
      <router-view :isDesktop="isDesktop" />
    </div>
    <MobileNavigator v-if="isDirectoryOpen" @toggleDirectory="setDirectoryOpenStatus" />
    <BottomInfo v-if="isDesktop" id="footer" />
  </div>
</template>


<style>
body {
  background-color: rgb(250, 250, 250);
  margin: 0;
}

#container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#content {
  flex: 1 0 auto; /* Grow to fill remaining space */
}

#footer {
  flex-shrink: 0;
}

.fixed {
  position: fixed;
  z-index: 1000;
}
</style>