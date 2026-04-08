<template>
  <h3>로그인</h3>
  <input v-model="userInfo.userId" placeholder="ID" />
  <input v-model="userInfo.password" type="password" placeholder="Password" />
  <div v-if="fail" style="color: red">
    아이디나 비밀번호가 일치하지 않습니다.
  </div>
  <button @click="loginHandler">LogIN</button>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const fail = ref(false); // 로그인 실패
const userInfo = reactive({
  userId: '',
  password: '',
});

onMounted(() => {
  userStore.fetchUsers();
});

const loginHandler = () => {
  const result = userStore.login(userInfo.userId, userInfo.password);
  if (result.success) {
    router.push({ name: 'summary' });
  } else {
    fail.value = true;
  }
};
</script>
