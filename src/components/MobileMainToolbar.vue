<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  isDirectoryOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleDirectory'): void;
}>();

const isActive = ref(false);

const toggleDirectory = () => {
  isActive.value = !isActive.value;
  emit('toggleDirectory');
};

watch(
  () => props.isDirectoryOpen,
  (val) => {
    if (!val && isActive.value) {
      isActive.value = false;
    }
  }
)
</script>

<template>
    <nav class="toolbar">
        <a>
            <div class="burger menu-btn" :class="{ active: isActive }" @click="toggleDirectory">
                <span></span>
            </div>
        </a>
        <router-link to="/" class="toolbar-item middle">Sips and Sparks</router-link>
    </nav>
</template>
  
<style scoped>
  @import '../assets/fonts/Mourgen/stylesheet.css';
  
  .toolbar {
    display: flex;
    position: fixed; /* Needed for absolute positioning */
    justify-content: space-between;
    align-items: center;
    height: 80px; /* Adjust height as needed */
    z-index: 1000;
    top: 0;
    left: 0;
    right: 0;
    background-color: white;
  }
  
  .toolbar-item {
    font-family: 'MOURGEN';
    font-weight: bolder;
    font-style: normal;
    font-size: 2.25rem;
    text-align: center;
    text-decoration: none;
    color: #070707;
    min-width: 0;
    display: flex; /* Enable flexbox layout for each item */
    align-items: center; /* Vertically center the content of each item */
  }

  .middle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .burger {
    margin-left: 20px;
    margin-top: 25px;
  }


  @media screen and (max-width: 767px) {
    .toolbar-item {
      font-size: 1.35rem;
    }

    .burger {
      width: 30px;
    }
  }

  .menu-btn {
  height: 32px;
  width: 40px;
  cursor: pointer;
  position: relative;
}

.menu-btn span,
.menu-btn span::before,
.menu-btn span::after {
  background: black;
  content: '';
  position: absolute;
  width: 40px;
  height: 6px;
  transition: .5s ease-in-out;
}

.menu-btn span::before {
  margin-top: -12px;
}

.menu-btn span::after {
  margin-top: 12px;
}

.menu-btn.active span {
  background: transparent; /* Change to transparent */
}

.menu-btn.active span::before {
  margin-top: 0;
  transform: rotate(45deg);
}

.menu-btn.active span::after {
  margin-top: 0;
  transform: rotate(-45deg);
}


</style>
