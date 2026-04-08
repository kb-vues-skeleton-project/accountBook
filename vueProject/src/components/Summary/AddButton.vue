<template>
  <div class="fab-container">
    <router-link :to="{ name: 'transactionAdd' }" class="fab-button">
      +
    </router-link>
  </div>
</template>

<script setup></script>

<style scoped>
.fab-container {
  /* 화면 오른쪽 아래에 고정 */
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
}

.fab-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background-color: greenyellow;
  border-radius: 50%;

  /* 텍스트 스타일 */
  color: #333;
  font-size: 32px;
  text-decoration: none;
  font-weight: bold;
}
</style>
