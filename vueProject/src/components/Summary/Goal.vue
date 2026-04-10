<template>
  <div class="goal-container" v-if="currentGoal">
    <div class="header-stats">
      <div class="stat-item clickable" @click="goToGoalEdit">
        <span class="label">{{ displayMonth }} 지출 목표</span>
        <span class="value">
          {{ currentGoal?.balance?.toLocaleString() || 0 }}원
        </span>
      </div>

      <div class="stat-item">
        <span class="label">사용 현황</span>
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
        <span>
          남은 금액:
          <strong>{{ remainingBudget.toLocaleString() }}원</strong>
        </span>
      </div>
    </div>

    <div class="alert-section" v-if="transactionStore.transactions.length > 0">
      <p class="alert-text">
        이번 달 과소비 금액은
        <strong>{{ overSpendAmount.toLocaleString() }}원</strong>이에요. 💸
      </p>
    </div>
  </div>
  <div v-else class="no-goal">설정된 목표가 없습니다.</div>
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

// 과소비 내역
const overSpendAmount = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.selfCheck === 3)
    .reduce((acc, cur) => acc + cur.balance, 0);
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
  font-size: 0.9rem;
  color: #888;
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
  color: #03c75a; /* 초록색 */
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
  background: #03c75a;
  transition: width 0.3s;
}

.progress-info {
  text-align: right;
  font-size: 0.85rem;
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
</style>
