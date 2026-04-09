<template>
  <h2>잘못된 경로입니다.</h2>
  <RouterLink v-if="isLogIn" :to="{ name: 'summary' }"
    >가계부 보러가기</RouterLink
  >
  <RouterLink v-else :to="{ name: 'home' }">메인 화면으로 이동</RouterLink>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const isLogIn = computed(() => !!userStore.state.currentUser);
</script>

<style scoped></style>
