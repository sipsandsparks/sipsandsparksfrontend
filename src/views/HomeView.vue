<script setup lang="ts">
import HomePage from '@/components/HomePage.vue';
import MobileHomePage from '@/components/MobileHomePage.vue';
import { defineProps } from 'vue';

defineProps({
  isDesktop: Boolean,
});
</script>

<template>
    <HomePage v-if="isDesktop" />
    <MobileHomePage v-else />
</template>