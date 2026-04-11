<template>
  <div class="summary-page">
    <div
      @click="
        router.push({ name: 'summary/goal', query: { yearMonth: currMonth } })
      "
    >
      <Goal :yearMonth="currMonth" />
    </div>

    <Calendar @view-change="handleViewChange" />

    <AddButton :yearMonth="currMonth" />

    <RouterView />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useGoalStore } from '@/stores/goalStore';

import Goal from '@/components/Summary/Goal.vue';
import Calendar from '@/components/Summary/Calendar.vue';
import AddButton from '@/components/Summary/AddButton.vue';

const transactionStore = useTransactionStore();
const goalStore = useGoalStore();
const uId = JSON.parse(localStorage.getItem('currentUser'));

const now = new Date();
const currMonth = ref(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
);

// 달력 범위가 변경될 때 서버에서 데이터 fetch
// Summary.vue
const handleViewChange = async ({ startDate, endDate }) => {
  currMonth.value = startDate.substring(0, 7); // "2026-04"

  await Promise.all([
    transactionStore.fetchTransactions({ uId, startDate, endDate }),
    // ❌ currMonth.value.substring(2) -> "26-04" 가 되어버림 (절대 금지)
    // ✅ currMonth.value 그대로 전달 -> "2026-04"
    goalStore.fetchGoalByMonth(uId, currMonth.value),
  ]);
};
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
