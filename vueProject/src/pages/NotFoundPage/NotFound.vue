<template>
  <div class="error-page">
    <div class="error-card">
      <div class="error-icon">
        <span class="emoji">🚧</span>
      </div>

      <h2 class="error-title">잘못된 경로입니다.</h2>
      <p class="error-desc">
        요청하신 페이지를 찾을 수 없거나<br />
        접근 권한이 없습니다.
      </p>

      <div class="button-group">
        <RouterLink
          v-if="isLoggedIn"
          :to="{ name: 'summary' }"
          class="btn-main"
        >
          가계부 보러가기
        </RouterLink>

        <RouterLink v-else :to="{ name: 'home' }" class="btn-main">
          메인 화면으로 이동
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// localStorage에서 currentUser를 가져와 로그인 상태 확인
const isLoggedIn = computed(() => {
  const user = localStorage.getItem('currentUser');
  try {
    // 값이 존재하고 JSON 파싱이 성공하면 true 반환
    return user ? !!JSON.parse(user) : false;
  } catch (e) {
    // 파싱 에러 발생 시(데이터 오염 등) 로그아웃 상태로 간주
    return false;
  }
});
</script>

<style scoped>
/* CSS는 이전과 동일하게 유지하시면 됩니다 */
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.error-card {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
  padding: 50px 30px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.error-icon {
  margin-bottom: 24px;
}

.emoji {
  font-size: 64px;
}

.error-title {
  font-size: 24px;
  font-weight: 800;
  color: #191f28;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.error-desc {
  font-size: 16px;
  color: #6b7684;
  line-height: 1.5;
  margin-bottom: 40px;
}

.btn-main {
  display: block;
  width: 100%;
  padding: 18px 0;
  border-radius: 18px;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  background-color: #1a5c9c;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-main:hover {
  background-color: #14497a;
  transform: translateY(-2px);
}

.btn-main:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .error-card {
    padding: 40px 20px;
    box-shadow: none;
    background: transparent;
  }

  .error-title {
    font-size: 22px;
  }
}
</style>
