<template>
  <header v-if="isLogIn" class="header-bar">
    <div class="header-content">
      <div class="logo">
        <RouterLink :to="{ name: 'summary' }">티끌 가계부</RouterLink>
      </div>

      <nav class="nav-links">
        <RouterLink :to="{ name: 'summary' }">월별 통계</RouterLink>
        <RouterLink :to="{ name: 'trade' }">거래 내역</RouterLink>
        <RouterLink :to="{ name: 'report' }">소비 리포트</RouterLink>
      </nav>
      <button @click="logOut">로그아웃</button>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const isLogIn = computed(() => !!userStore.state.currentUser);

const logOut = () => {
  localStorage.removeItem('currentUser');
  userStore.state.currentUser = null;
  router.push('/');
};
</script>

<style scoped>
.header-bar {
  width: 100%;
  border-bottom: 1px solid #ccc;
  padding: 10px 20px;
  background-color: #fff;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo a {
  font-weight: bold;
  font-size: 1.2rem;
  text-decoration: none;
  color: #333;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #666;
}

.nav-links a:hover {
  color: #000;
  font-weight: bold;
}

.user-name {
  margin-left: 10px;
  color: #333;
  font-size: 0.9rem;
}
</style>
