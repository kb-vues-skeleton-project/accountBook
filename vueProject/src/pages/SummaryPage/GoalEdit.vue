<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useGoalStore } from '@/stores/goalStore'; // 만든 스토어 가져오기

const router = useRouter();
const goalStore = useGoalStore();

// 사용자가 입력할 값을 담는 변수
const editBalance = ref(0);

// 신규 목표 설정일때
const isNewGoal = computed(() => !goalStore.currentMonthGoal);

onMounted(() => {
  // 스토어에 이미 목표 데이터가 있다면 입력창에 초기값으로 세팅
  if (goalStore.currentMonthGoal) {
    editBalance.value = goalStore.currentMonthGoal.balance;
  }
});

// 금액 조절 함수
const adjustBalance = (amount) => {
  editBalance.value = Math.max(0, editBalance.value + amount);
};

const handleSave = async () => {
  let result;

  try {
    if (isNewGoal.value) {
      // 1. 신규 목표 등록
      const uId = 'user1'; // 고정값 대신 실제 유저 ID 연동 권장
      const yearMonth = '2026-04'; // 고정값 대신 props.yearMonth 사용 권장

      result = await goalStore.createGoal(uId, yearMonth, editBalance.value);

      // 등록 실패 시, 이미 데이터가 존재할 가능성을 고려하여 업데이트 시도
      if (result && !result.success) {
        const goalId = goalStore.currentMonthGoal?.id;
        if (goalId) {
          result = await goalStore.updateGoal(goalId, editBalance.value);
        }
      }
    } else {
      // 2. 기존 목표 수정
      const goalId = goalStore.currentMonthGoal?.id;
      if (goalId) {
        result = await goalStore.updateGoal(goalId, editBalance.value);
      }
    }

    // 최종 결과 처리
    if (result?.success) {
      router.push({ name: 'summary' });
    } else {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    }
  } catch (error) {
    console.error('Goal 처리 중 예외 발생:', error);
    alert('시스템 에러가 발생했습니다.');
  }
};
</script>

<template>
  <div class="modal-overlay" @click.self="router.push({ name: 'summary' })">
    <div class="modal-card">
      <h3 style="color: #1a5c9c">
        {{ isNewGoal ? '✨ 신규 지출 목표 설정' : '🎯 지출 목표 수정' }}
      </h3>

      <div class="current-info">
        <p v-if="!isNewGoal">
          현재 목표:
          <strong>{{ goalStore.goalBalance.toLocaleString() }}원</strong>
        </p>
        <p v-else>이번 달 첫 목표를 설정해보세요!</p>
      </div>

      <input type="number" v-model="editBalance" step="100000" />

      <div class="quick-btns">
        <div class="btn-row">
          <button @click="adjustBalance(100000)">🔺10만</button>
          <button @click="adjustBalance(50000)">🔺5만</button>
          <button @click="adjustBalance(10000)">🔺1만</button>
        </div>
        <div class="btn-row">
          <button @click="adjustBalance(-100000)">🔻10만</button>
          <button @click="adjustBalance(-50000)">🔻5만</button>
          <button @click="adjustBalance(-10000)">🔻1만</button>
        </div>
      </div>

      <div class="btns">
        <button @click="handleSave" class="save-btn">저장</button>
        <button @click="router.push({ name: 'summary' })" class="cancel-btn">
          취소
        </button>
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
  text-align: center;
  font-weight: bold;
  color: #1a5c9c;
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
  background-color: #1a5c9c; /* 요청하신 색상 */
  color: white; /* 글자 흰색 */
  padding: 12px 24px;
  border: none;
  border-radius: 12px; /* 동그랗게 굴린 네모 */
  font-weight: 700;
  cursor: pointer;
  flex-grow: 1;
  transition: opacity 0.2s;
}

.save-btn:hover {
  opacity: 0.9;
}

/* 취소 버튼 스타일 */
.cancel-btn {
  background-color: #eee;
  color: #333;
  padding: 12px 24px;
  border: none;
  border-radius: 12px; /* 동일하게 굴린 네모 */
  font-weight: 600;
  cursor: pointer;
}

.quick-btns {
  margin: 15px 0 25px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-row {
  display: flex;
  gap: 5px;
  justify-content: center;
}

.btn-row button {
  padding: 8px 12px;
  font-size: 0.85rem;
  background-color: #f0f4f8;
  color: #1a5c9c;
  border: 1px solid #d1d9e0;
  border-radius: 8px;
  flex: 1;
}

.btn-row button:hover {
  background-color: #e2e8f0;
}
</style>
