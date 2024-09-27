<script setup lang="ts">
import MobileNavigator from '@/components/MobileNavigator.vue';
import { defineProps } from 'vue';

defineProps({
  isDesktop: Boolean,
})
</script>

<template>
    <MobileNavigator v-if="!isDesktop" />
</template>