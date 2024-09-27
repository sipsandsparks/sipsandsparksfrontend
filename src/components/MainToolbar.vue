<script setup lang="ts">

</script>

<template>
    <nav class="toolbar">
        <router-link to="/" class="toolbar-item logo">
            <img src="../assets/full-logo.png" alt="Sips and Sparks Logo" class="toolbar-image">
        </router-link>
        <router-link to="/" class="toolbar-item no-right-border">Home</router-link>
        <router-link to="/about" class="toolbar-item no-right-border no-left-border">About</router-link>
        <!-- <router-link to="/tickets" class="toolbar-item no-right-border no-left-border">Tickets</router-link> -->
        <router-link to="/match" class="toolbar-item no-left-border">Match Form</router-link>
        <router-link to="/contact" class="toolbar-item">Contact</router-link>
        <!-- <router-link to="/" class="toolbar-item">
            <img src="../assets/burger.svg" alt="Expand Icon" class="toolbar-image burger">
        </router-link> -->
    </nav>
</template>
  
<style scoped>
  @import '../assets/fonts/Mourgen/stylesheet.css';
  
  .toolbar {
    display: flex;
  }
  
  .toolbar-item {
    font-family: 'MOURGEN';
    font-weight:bolder;
    font-style: normal;
    font-size: 1.25rem;
    word-wrap: break-word;
    flex: 4;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #333;
    border: 1px solid rgb(136,136,136);
    border-bottom-width: 2px;
    height: 100px;
    min-width: 0;
  }
  
  .toolbar-item.no-right-border {
    border-right: none;
  }
  
  .toolbar-item.no-left-border {
    border-left: none;
  }
  
  .toolbar-item.logo {
    flex: 5;
    pointer-events: none;
  }
  
  .toolbar-image {
    max-width: 100%;
    max-height: 100%;
  }
  
  .toolbar-image.burger {
    height: 50%;
  }
  
  .toolbar-item:hover {
    background-color: #f0f0f0; /* Optional: Add hover effect */
  }
  
  @media screen and (max-width: 768px) {
    .toolbar-item {
      height: 100px; /* Adjust height for mobile devices */
      font-size: 0.5rem;
    }
  
    .toolbar-image.burger {
      height: 25%;
    }
  
    .toolbar-image {
      max-width: 95%;
    }
  }
</style>
  