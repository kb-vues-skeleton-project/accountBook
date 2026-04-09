<template>
<<<<<<< HEAD
  <div></div>
=======
  <button @click="router.push({ name: 'join' })">회원가입</button>
  <button @click="router.push({ name: 'login' })">로그인</button>
>>>>>>> develop
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped></style>
