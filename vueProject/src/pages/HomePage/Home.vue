<template>
  <div class="welcome-container">
    <div class="bg-decoration top-circle"></div>
    <div class="bg-decoration bottom-circle"></div>

    <div class="welcome-card">
      <div class="character-area">
        <img
          src="/images/character.png"
          alt="티끌 가계부 캐릭터"
          class="character-img"
        />
      </div>

      <div class="text-area">
        <h1 class="logo-text">티끌 모아 태산!</h1>
        <h2 class="main-title">
          당신의 <span class="highlight">절약 파트너</span>
        </h2>
        <p class="sub-text">사회초년생을 위한 스마트한 가계부 서비스</p>
      </div>

      <div class="button-group">
        <button class="btn btn-login" @click="router.push({ name: 'login' })">
          로그인
        </button>
        <button class="btn btn-join" @click="router.push({ name: 'join' })">
          회원가입
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
/* 메인 컨테이너 */
.welcome-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
  overflow: hidden; /* 배경 장식이 삐져나가지 않게 */
}

/* 배경 꾸미기 요소  */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px); /* 부드럽게 퍼지는 효과 */
  z-index: 0;
  opacity: 0.3;
}

.top-circle {
  width: 300px;
  height: 300px;
  background-color: #1a5c9c;
  top: -100px;
  right: -50px;
}

.bottom-circle {
  width: 400px;
  height: 400px;
  background-color: #1a5c9c;
  bottom: -150px;
  left: -100px;
}

.welcome-card {
  position: relative;
  z-index: 1; /* 배경보다 앞에 배치 */
  width: 100%;
  max-width: 450px;
  padding: 0 24px;
  text-align: center;
}

/* 캐릭터 영역 */
.character-area {
  margin-bottom: 20px;
}

.character-img {
  width: 240px;
  height: auto;
  animation: float 3.5s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* 텍스트 영역 */
.text-area {
  margin-bottom: 50px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #1a5c9c; /* 테마 컬러 적용 */
  margin-bottom: 8px;
}

.main-title {
  font-size: 28px;
  font-weight: 800;
  color: #191919;
  margin-bottom: 12px;
  letter-spacing: -0.8px;
}

.highlight {
  color: #1a5c9c; /* 강조 텍스트 */
}

.sub-text {
  font-size: 15px;
  color: #6b7684;
  font-weight: 500;
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  flex-direction: column;
  flex-direction: row;
  gap: 12px;
}

.btn {
  flex: 1;
  padding: 18px 0;
  border-radius: 18px;
  font-size: 17px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* 로그인 버튼 ) */
.btn-login {
  background-color: #1a5c9c;
  color: #ffffff;
}

.btn-login:hover {
  background-color: #14497a; /* 살짝 어두운 톤으로 호버 */
}

/* 회원가입 버튼 */
.btn-join {
  background-color: #f2f4f6;
  color: #4e5968;
}

.btn-join:hover {
  background-color: #e5e8eb;
}

.btn:active {
  transform: scale(0.97);
}

/* 모바일 대응 */
@media (max-width: 360px) {
  .main-title {
    font-size: 22px;
  }
  .character-img {
    width: 190px;
  }
}
</style>
