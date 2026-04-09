<template>
  <div class="goal-container" v-if="goalStore.currentMonthGoal">
    <div class="header-stats">
      <div class="stat-item">
        <span class="label">4월 지출 목표</span>
        <span class="value"
          >{{ goalStore.goalBalance.toLocaleString() }}원</span
        >
      </div>
      <div class="stat-item">
        <span class="label">현재 사용 완료</span>
        <span class="value spend"
          >-{{
            (goalStore.currentMonthGoal.amount || 0).toLocaleString()
          }}원</span
        >
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-bar-container">
        <div
          class="progress-fill"
          :style="{ width: goalStore.achievementRate + '%' }"
        ></div>
      </div>
      <div class="progress-info">
        <span
          >남은 사용 가능 금액:
          <strong
            >{{ goalStore.remainingBudget.toLocaleString() }}원</strong
          ></span
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
</template>

<script setup>
import { computed } from 'vue';
import { useGoalStore } from '@/stores/goalStore';
import { useTransactionStore } from '@/stores/transactionStore';

const goalStore = useGoalStore();
const transactionStore = useTransactionStore();

const overSpendAmount = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.date.startsWith('2026-04') && t.selfCheck === 3)
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
