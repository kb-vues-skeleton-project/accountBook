<template>
  <div>
    <Header />
    <RouterView v-slot="{ Component }">
      <keep-alive :exclude="['Join', 'Login']">
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </RouterView>
  </div>
</template>

<script setup>
import Header from './components/Common/Header.vue';
</script>

<style scoped></style>
