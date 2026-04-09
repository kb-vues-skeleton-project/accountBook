<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <div class="logo-circle">🔑</div>
        <h2>로그인</h2>
        <p>계정 정보를 입력하여 서비스를 이용하세요.</p>
      </div>

      <div class="form-wrapper">
        <div class="input-group">
          <label>아이디</label>
          <input
            v-model="userInfo.userId"
            type="text"
            placeholder="ID를 입력하세요"
            @keyup.enter="loginHandler"
          />
        </div>

        <div class="input-group">
          <label>비밀번호</label>
          <input
            v-model="userInfo.password"
            type="password"
            placeholder="Password를 입력하세요"
            @keyup.enter="loginHandler"
          />
        </div>

        <p v-if="fail" class="error-msg">
          아이디나 비밀번호가 일치하지 않습니다.
        </p>

        <button class="btn-login" @click="loginHandler">로그인</button>
      </div>

      <div class="footer-links">
        <span>계정이 없으신가요?</span>
        <button @click="router.push({ name: 'join' })">회원가입</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  padding: 50px 30px;
  border-radius: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.login-header {
  margin-bottom: 35px;
}

.logo-circle {
  font-size: 40px;
  width: 70px;
  height: 70px;
  background-color: #f0f7ff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 15px;
}

.login-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #888;
}

.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.input-group label {
  font-size: 13px;
  font-weight: 700;
  color: #555;
  padding-left: 4px;
}

input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 15px;
  border: 1px solid #eee;
  background-color: #fafafa;
  font-size: 15px;
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #007bff;
  background-color: #ffffff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.1);
}

.error-msg {
  color: #ff4d4f;
  font-size: 13px;
  margin: 0;
  font-weight: 500;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #0056b3;
}

.footer-links {
  margin-top: 25px;
  font-size: 14px;
  color: #999;
}

.footer-links button {
  background: none;
  border: none;
  color: #007bff;
  font-weight: 700;
  cursor: pointer;
  margin-left: 8px;
  text-decoration: underline;
}
</style>

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
