<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <div class="image-placeholder">
        <div class="temp-icon">💰</div>
      </div>

      <div class="text-area">
        <h1 class="logo-text">거지 가계부</h1>
        <p class="sub-text">거지들은 관리를 잘 해야 해요</p>
      </div>

      <div class="button-group">
        <button class="btn btn-join" @click="router.push({ name: 'join' })">
          회원가입
        </button>
        <button class="btn btn-login" @click="router.push({ name: 'login' })">
          로그인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
}

.welcome-card {
  width: 90%;
  max-width: 500px;
  padding: 50px 20px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.temp-icon {
  font-size: 80px;
}

.text-area {
  margin-bottom: 40px;
}

.logo-text {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 10px;
}

.sub-text {
  color: #888;
}

/* 버튼 왼쪽/오른쪽 나란히 배치 */
.button-group {
  display: flex;
  gap: 15px; /* 버튼 사이 간격 */
}

.btn {
  flex: 1; /* 왼쪽, 오른쪽 똑같이 크게 차지 */
  padding: 20px 0;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-login {
  background-color: #007bff;
  color: white;
}

.btn-join {
  background-color: #333; /* 회원가입도 강조되게 어두운 색상 */
  color: white;
}

.btn:active {
  transform: scale(0.95);
}

.btn:hover {
  opacity: 0.9;
}
</style>
