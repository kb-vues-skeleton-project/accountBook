<template>
  <div class="summary-page">
    <Goal />

    <Calendar />

    <div class="alert-section" v-if="transactionStore.transactions.length > 0">
      <p class="alert-text">
        이번 달 과소비 금액은
        <strong>{{ overSpendAmount.toLocaleString() }}원</strong>이에요. 💸
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useGoalStore } from '@/stores/goalStore';

// 분리한 컴포넌트 임포트
import Goal from '@/components/Summary/Goal.vue';
import Calendar from '@/components/Summary/Calendar.vue';

const transactionStore = useTransactionStore();
const goalStore = useGoalStore();

onMounted(async () => {
  // 부모가 데이터를 한 번만 불러오면 자식들은 자동으로 갱신됨
  await Promise.all([
    transactionStore.fetchTransactions(),
    goalStore.fetchGoals(),
  ]);
});

const overSpendAmount = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.date.startsWith('2026-04') && t.selfCheck === 3)
    .reduce((acc, cur) => acc + cur.balance, 0);
});
</script>

<style scoped>
.summary-page {
  padding: 16px;
  background-color: #fff;
  min-height: 100vh;
}
.alert-section {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}
</style>
