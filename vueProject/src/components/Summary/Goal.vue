<template>
  <div class="goal-container" v-if="currentGoal">
    <div class="header-stats">
      <div class="stat-item">
        <span class="label">{{ displayMonth }} 지출 목표</span>
        <span class="value">{{ currentGoal.balance.toLocaleString() }}원</span>
      </div>
      <div class="stat-item">
        <span class="label">현재 사용 완료</span>
        <span class="value spend"
          >-{{ goalStore.currentExpenditure.toLocaleString() }}원</span
        >
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
        <span
          >남은 금액:
          <strong>{{ remainingBudget.toLocaleString() }}원</strong></span
        >
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

// 과소비 (서버에서 이미 해당 월 데이터만 가져왔으므로 startsWith 없이 selfCheck만 확인)
const overSpendAmount = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.selfCheck === 3)
    .reduce((acc, cur) => acc + cur.balance, 0);
});
</script>

<style scoped>
/* 기존 Summary.vue에 있던 .goal-container, .header-stats 등 관련 스타일 이동 */
.header-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.stat-item {
  text-align: center;
}
.value {
  font-weight: bold;
  font-size: 1.2rem;
}
.spend {
  color: #ff4d4f;
}
.progress-bar-container {
  height: 12px;
  background: #eee;
  border-radius: 6px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #03c75a;
  transition: width 0.3s;
}
</style>
