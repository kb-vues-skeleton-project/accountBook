<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useGoalStore } from '@/stores/goalStore';

const router = useRouter();
const route = useRoute();
const goalStore = useGoalStore();

const editBalance = ref(0);

/**
 * 1. 저장할 대상 날짜 결정
 * 쿼리 파라미터(?yearMonth=2026-02)가 있으면 그 값을 쓰고,
 * 없으면 시스템의 오늘 날짜를 기본값으로 사용
 */
const targetYearMonth = computed(() => {
  return (
    route.query.yearMonth ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  );
});

const isNewGoal = computed(() => !goalStore.currentMonthGoal);

onMounted(async () => {
  const uId = JSON.parse(localStorage.getItem('currentUser'));

  // ***모달이 열리자마자 "지금 목표로 하는 달"의 데이터를 서버에서 다시 가져옵니다.
  // 이렇게 해야 2월 모달이면 스토어의 currentMonthGoal도 2월 데이터(혹은 null)로 바뀝니다.
  if (targetYearMonth.value) {
    await goalStore.fetchGoalByMonth(uId, targetYearMonth.value);
  }

  // 데이터 동기화가 끝난 후, 입력창에 값 세팅
  if (goalStore.currentMonthGoal) {
    // 2월 데이터가 있으면 그 금액을 보여줌
    editBalance.value = goalStore.currentMonthGoal.balance;
  } else {
    // 2월 데이터가 없으면(null) 신규 등록 모드가 됨 (editBalance는 0)
    editBalance.value = 0;
  }
});

const adjustBalance = (amount) => {
  editBalance.value = Math.max(0, editBalance.value + amount);
};

const handleSave = async () => {
  let result;
  const uId = JSON.parse(localStorage.getItem('currentUser'));

  try {
    if (isNewGoal.value) {
      // ✅ 신규 등록 시 targetYearMonth.value (예: '2026-02')를 전달
      result = await goalStore.createGoal(
        uId,
        targetYearMonth.value,
        editBalance.value,
      );

      // 이미 데이터가 존재하여 등록 실패 시 업데이트로 전환
      if (result && !result.success) {
        const goalId = goalStore.currentMonthGoal?.id;
        if (goalId) {
          result = await goalStore.updateGoal(goalId, editBalance.value);
        }
      }
    } else {
      // ✅ 기존 목표 수정
      const goalId = goalStore.currentMonthGoal?.id;
      if (goalId) {
        result = await goalStore.updateGoal(goalId, editBalance.value);
      }
    }

    if (result?.success) {
      router.push({ name: 'summary' });
    } else {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    }
  } catch (error) {
    console.error('Goal 저장 에러:', error);
    alert('시스템 오류가 발생했습니다.');
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
  background-color: #1a5c9c;
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
