<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGoalStore } from '@/stores/goalStore'; // 만든 스토어 가져오기

const router = useRouter();
const goalStore = useGoalStore();

// 사용자가 입력할 값을 담는 변수
const editBalance = ref(0);

onMounted(() => {
  // 스토어에 이미 목표 데이터가 있다면 입력창에 초기값으로 세팅
  if (goalStore.currentMonthGoal) {
    editBalance.value = goalStore.currentMonthGoal.balance;
  }
});

const handleSave = async () => {
  const goalId = goalStore.currentMonthGoal?.id;
  if (!goalId) return;

  const result = await goalStore.updateGoal(goalId, editBalance.value);
  if (result.success) {
    alert('목표가 수정되었습니다! 🎯');
    router.push({ name: 'summary' }); // 닫고 부모로 돌아가기
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <h3>목표 금액 수정</h3>
      <p>현재 목표: {{ goalStore.goalBalance.toLocaleString() }}원</p>

      <input type="number" v-model="editBalance" />

      <div class="btns">
        <button @click="handleSave">저장</button>
        <button @click="router.push({ name: 'summary' })">취소</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* 1. 뒷배경: 연한 회색으로 변경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* rgba(0,0,0,0.1) -> 연한 회색 반투명 */
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* 달력보다 무조건 위 */
}

/* 2. 모달 창: 가운데 60% 차지 */
.modal-card {
  background-color: white;
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.08); /* 부드러운 그림자 */

  /* 🍎 핵심: 너비 60% 설정 */
  width: 60%;
  min-width: 320px; /* 너무 작아지는 것 방지 */
  max-width: 600px; /* 너무 커지는 것 방지 */

  text-align: center;
}

h3 {
  margin-top: 0;
  font-weight: 800;
}
hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
}

.current-info {
  font-size: 1.1rem;
  margin-bottom: 25px;
}
.current-info span {
  color: #888;
  margin-right: 10px;
}

.input-group {
  text-align: left;
  margin-bottom: 30px;
}
.input-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: #fafafa;
}

.btns {
  display: flex;
  gap: 15px;
  justify-content: center;
}

button {
  padding: 15px 30px;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
}

.save-btn {
  background-color: #007bff;
  color: white;
  flex-grow: 1; /* 저장 버튼을 더 크게 */
}

.cancel-btn {
  background-color: #eee;
  color: #333;
}
</style>
