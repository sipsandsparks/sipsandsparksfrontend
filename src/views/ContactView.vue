<script setup lang="ts">
import ContactPage from '@/components/ContactPage.vue';
import MobileContactPage from '@/components/MobileContactPage.vue';
import MobileBottomInfo from '@/components/MobileBottomInfo.vue';
    
defineProps({
  isDesktop: Boolean,
});
</script>

<template>
    <ContactPage v-if="isDesktop" />
    <div class="container" v-else>
        <MobileContactPage class="content" />
        <MobileBottomInfo class="bottom" />
    </div>
</template>

<style scoped>
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
</style>