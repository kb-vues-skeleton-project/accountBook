<template>
  <div class="goal-container">
    <div class="header-stats">
      <div
        class="stat-item clickable"
        @click="goToGoalEdit"
        :class="{ 'no-goal-bg': !currentGoal }"
      >
        <template v-if="currentGoal">
          <span class="label">{{ displayMonth }} 지출 목표🎯</span>
          <span class="value"
            >{{ currentGoal.balance.toLocaleString() }}원</span
          >
        </template>
        <template v-else>
          <span class="label">{{ displayMonth }} 지출 목표🎯</span>
          <span class="value small-text">새로운 목표를 설정해주세요!</span>
        </template>
      </div>

      <div class="stat-item">
        <span class="label">현황 요약💸</span>
        <div class="status-detail">
          <span class="income">수입 {{ totalIncome.toLocaleString() }}원</span>
          <span class="divider">/</span>
          <span class="spend"
            >지출 {{ goalStore.currentExpenditure.toLocaleString() }}원</span
          >
        </div>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-bar-container">
        <div
          class="progress-fill"
          :style="{ width: achievementRate + '%' }"
        ></div>
      </div>
      <div class="progress-info">
        <span class="current-expense">
          현재 지출:
          <strong>{{ goalStore.currentExpenditure.toLocaleString() }}원</strong>
        </span>
        <span>
          사용 가능 금액:
          <strong>{{ remainingBudget.toLocaleString() }}원</strong>
        </span>
      </div>
    </div>

    <div class="alert-section" v-if="transactionStore.transactions.length > 0">
      <p class="alert-text">
        이번 달 과소비 금액은
        <strong>{{ overSpendAmount.toLocaleString() }}원</strong>이에요.💸 (전체
        소비의 <strong>{{ overSpendRate }}%</strong>)
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGoalStore } from '@/stores/goalStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  yearMonth: String,
});

const goalStore = useGoalStore();
const transactionStore = useTransactionStore();

const currentGoal = computed(() => goalStore.currentMonthGoal);

const displayMonth = computed(() => {
  if (!props.yearMonth) return '';
  return props.yearMonth.split('-')[1] + '월';
});

// 클릭 시 GoalEdit 모달 경로로 이동시키는 함수
const goToGoalEdit = () => {
  router.push({ name: 'summary/goal' });
};

// 🍎 수입 합계 계산 (Store의 전체 내역에서 직접 필터링)
const totalIncome = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, cur) => acc + cur.balance, 0);
});

// 달성률 계산
const achievementRate = computed(() => {
  if (!currentGoal.value || currentGoal.value.balance === 0) return 0;
  const rate = (goalStore.currentExpenditure / currentGoal.value.balance) * 100;
  return Math.min(Math.round(rate), 100);
});

// 남은 예산
const remainingBudget = computed(() => {
  if (!currentGoal.value) return 0;
  const rem = currentGoal.value.balance - goalStore.currentExpenditure;
  return rem > 0 ? rem : 0;
});

// 과소비 금액 합산
const overSpendAmount = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.selfCheck === 3)
    .reduce((acc, cur) => acc + cur.balance, 0);
});
// 과소비 비율(과소비/총소비)
const overSpendRate = computed(() => {
  const total = goalStore.currentExpenditure;
  const over = overSpendAmount.value;
  if (total === 0) return 0; // 지출이 없으면 0%

  // 소수점 첫째 자리까지 반올림하여 계산
  const rate = (over / total) * 100;
  return rate.toFixed(1);
});
</script>

<style scoped>
.goal-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
}

/* 상단 2단 구조 */
.header-stats {
  display: flex;
  justify-content: space-between; /* 좌우 끝으로 배치 */
  align-items: flex-start;
  margin-bottom: 25px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 레이블(제목) 스타일 */
.label {
  font-size: 1.1rem;
  color: #fff;
}

/* 큰 숫자 스타일 */
.value {
  font-weight: bold;
  font-size: 1.3rem;
  color: #333;
}

/* 수입/지출 현황 스타일 */
.status-detail {
  font-size: 1.1rem;
  font-weight: 600;
}

.income {
  color: #1a5c9c;
}

.spend {
  color: #ff4d4f; /* 빨간색 */
}

.divider {
  margin: 0 8px;
  color: #ccc;
}

/* 게이지 바 */
.progress-bar-container {
  height: 10px;
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #ff4d4f;
  transition: width 0.3s;
}

.progress-info {
  text-align: right;
  font-size: 1.1rem;
  color: #666;
}

.alert-section {
  margin-top: 20px;
  padding: 12px;
  background-color: #fdf2f2;
  border-radius: 8px;
  text-align: center;
}

.alert-text {
  margin: 0;
  font-size: 0.9rem;
}

/* goal 영역에 마우스를 올렸을 때 손가락 모양으로 바뀌게 설정 */
.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
}

/* 마우스를 올렸을 때 살짝 티가 나게 배경색을 바꾸면 더 친절한 UI가 됩니다 */
.clickable:hover {
  background-color: #f0f7ff;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

/* Goal.vue 스타일 부분 */
/* 1. 공통 스타일 (배경색 관련 코드 제거) */
.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px; /* 기본 패딩만 유지 */
  /* 🍎 남색 테두리 추가 */
  border: 3px solid #1a5c9c; /* 중간 굵기 남색 테두리 */
  border-radius: 12px; /* 동그랗게 굴린 네모 */

  padding: 23px 25px; /* 안쪽 여백 (왼쪽 목표 박스와 높이감을 맞춤) */
  display: flex; /* 수입/지출을 가로로 정렬 */
  align-items: center;
  background-color: #fff; /* 배경은 깔끔하게 흰색 */
}

/* 2. 지출 목표 박스 (남색 배경 + 흰색 글자 적용) */
.stat-item.clickable {
  background-color: #1a5c9c;
  color: white;
  padding: 20px 30px; /* 목표 박스만 여유 있게 */
  text-align: center;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 0; /* 불필요한 마진 제거 */
}

.stat-item.clickable:hover {
  background-color: #144a7d; /* 호버 시 색상 변화 */
}

/* 3. 남색 배경 안의 글자색 강제 지정 */
.stat-item.clickable .label {
  color: white; /* 약간 투명한 흰색으로 고급스럽게 */
}

.stat-item.clickable .value {
  color: white; /* 금액은 선명한 흰색 */
}

/* 4. 사용 현황(오른쪽) 글자색 원래대로 (배경이 흰색이니까) */
.stat-item:not(.clickable) .label {
  color: #373737;
}

.stat-item:not(.clickable) .value {
  color: #333;
}

.no-goal {
  background-color: #1a5c9c; /* 동일한 배경색 */
  color: white; /* 글자 흰색 */
  padding: 30px; /* 영역을 충분히 확보 */
  text-align: center;
  border-radius: 15px; /* 동그랗게 굴린 네모 */
  font-weight: 600;
  cursor: pointer; /* 목표가 없어도 눌러서 추가할 수 있게 함 */
  margin: 10px 0;
}

.no-goal:hover {
  background-color: #144a7d; /* 호버 시 약간 더 진하게 */
}

.current-expense {
  float: left;
}
</style>
