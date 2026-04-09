<template>
  <div class="summary-page">
    <Goal />
    <Calendar @view-change="handleViewChange" /> <AddButton />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useGoalStore } from '@/stores/goalStore';

import Goal from '@/components/Summary/Goal.vue';
import Calendar from '@/components/Summary/Calendar.vue';
import AddButton from '@/components/Summary/AddButton.vue';

const transactionStore = useTransactionStore();
const goalStore = useGoalStore();
const userId = JSON.parse(localStorage.getItem('currentUser'));

// 달력 범위가 변경될 때 서버에서 데이터 fetch
const handleViewChange = async ({ startDate, endDate }) => {
  await transactionStore.fetchTransactions({
    userId: userId,
    startDate,
    endDate,
  });
};

// 초기 거래내역 호출
onMounted(async () => {
  await goalStore.fetchGoals();
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
