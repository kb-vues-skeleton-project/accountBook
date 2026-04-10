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
            v-model="userInfo.uId"
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

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

const fail = ref(false); // 로그인 실패
const userInfo = reactive({
  uId: '',
  password: '',
});

onMounted(() => {
  userStore.fetchUsers();
});

const loginHandler = () => {
  const result = userStore.login(userInfo.uId, userInfo.password);
  if (result.success) {
    router.push({ name: 'summary' });
  } else {
    fail.value = true;
  }
};
</script>

<style scoped>
/* 전체 컨테이너 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa; /* 전체 배경 일관성 */
  font-family:
    'Pretendard',
    -apple-system,
    sans-serif;
}

/* 로그인 카드 */
.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  padding: 50px 35px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  text-align: center;
}

/* 헤더 영역 */
.login-header {
  margin-bottom: 40px;
}

.logo-circle {
  width: 72px;
  height: 72px;
  background-color: #f0f4f8; /* 테마 컬러의 아주 연한 버전 */
  border-radius: 22px; /* 살짝 각진 둥근 형태 */
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
}

.icon {
  font-size: 32px;
}

.login-header h2 {
  font-size: 26px;
  font-weight: 800;
  color: #191f28;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.login-header p {
  font-size: 15px;
  color: #4e5968;
  line-height: 1.5;
}

/* 폼 영역 */
.form-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.input-group label {
  font-size: 14px;
  font-weight: 700;
  color: #4e5968;
  padding-left: 2px;
}

input {
  width: 100%;
  padding: 15px 18px;
  border-radius: 14px;
  border: 1.5px solid #e5e8eb;
  background-color: #ffffff;
  font-size: 16px;
  color: #333d4b;
  transition: all 0.2s ease;
}

input::placeholder {
  color: #adb5bd;
}

input:focus {
  outline: none;
  border-color: #1a5c9c; /* 테마 컬러 포커스 */
  box-shadow: 0 0 0 4px rgba(26, 92, 156, 0.1);
}

/* 에러 메시지 */
.error-msg {
  color: #f04452;
  font-size: 14px;
  margin: 0;
  font-weight: 500;
  text-align: left;
  padding-left: 2px;
}

/* 로그인 버튼 */
.btn-login {
  width: 100%;
  padding: 18px;
  background-color: #1a5c9c; /* 테마 컬러 적용 */
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-login:hover {
  background-color: #14497a;
  transform: translateY(-1px);
}

.btn-login:active {
  transform: scale(0.98);
}

/* 하단 링크 */
.footer-links {
  margin-top: 30px;
  font-size: 15px;
  color: #8b95a1;
}

.footer-links button {
  background: none;
  border: none;
  color: #1a5c9c; /* 테마 컬러 */
  font-weight: 700;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  transition: color 0.2s;
}

.footer-links button:hover {
  color: #14497a;
  text-decoration: underline;
}

/* 에러 메시지 페이드 효과 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 반응형 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    box-shadow: none;
  }
  .login-container {
    background-color: #ffffff;
  }
}
</style>
