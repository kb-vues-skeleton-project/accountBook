<template>
  <div class="summary-page">
    <Goal :yearMonth="currMonth" />
    <Calendar @view-change="handleViewChange" /> <AddButton />
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
const handleViewChange = async ({ startDate, endDate }) => {
  currMonth.value = startDate.substring(0, 7);

  await Promise.all([
    transactionStore.fetchTransactions({
      uId: uId,
      startDate,
      endDate,
    }),
    goalStore.fetchGoalByMonth(uId, currMonth.value.substring(2)),
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
