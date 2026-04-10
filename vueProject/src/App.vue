<template>
  <div>
    <Header />
    <RouterView v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </RouterView>
  </div>
</template>

<script setup>
import Header from './components/Common/Header.vue';
</script>

<style scoped></style>
