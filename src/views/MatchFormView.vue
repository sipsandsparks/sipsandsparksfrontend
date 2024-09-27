<script setup lang="ts">
import MatchPage from '@/components/MatchPage.vue';
import MobileBottomInfo from '@/components/MobileBottomInfo.vue';
import { defineProps } from 'vue';

defineProps({
  isDesktop: Boolean,
})
</script>

<template>
  <div :class="!isDesktop ? 'container' : ''">
      <MatchPage :class="!isDesktop ? 'content' : ''" />
      <MobileBottomInfo v-if="!isDesktop" class="bottom" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@300..900&family=Syncopate:wght@400;700&display=swap');

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensure the container fills the viewport height */
}

.content {
  flex: 1; /* Expand to fill remaining vertical space */
  /* Additional styling for your main content */
}

.bottom {
  /* Sticky to the bottom of the viewport */
  margin-top: auto; /* Pushes the footer to the bottom */
  /* Additional styling for your bottom panel */
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30vh;
}

.comingSoon {
  font-family: "Darker Grotesque", sans-serif;
    font-optical-sizing: auto;
    font-weight: 650;
    font-style: normal;
    font-size: 2.5rem;
    color: black;
}
</style>