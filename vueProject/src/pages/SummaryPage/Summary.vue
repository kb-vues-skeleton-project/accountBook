<template>
  <div class="summary-page">
    <div
      @click="
        router.push({
          name: 'summary/goal',
          query: { yearMonth: currMonth },
        })
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
import { ref, onActivated } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useGoalStore } from '@/stores/goalStore';
import { useRoute, useRouter } from 'vue-router';

import Goal from '@/components/Summary/Goal.vue';
import Calendar from '@/components/Summary/Calendar.vue';
import AddButton from '@/components/Summary/AddButton.vue';

const transactionStore = useTransactionStore();
const goalStore = useGoalStore();
const route = useRoute();
const router = useRouter();

const uId = JSON.parse(localStorage.getItem('currentUser'));

const now = new Date();
const currMonth = ref(
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
);

// 1. 공통 fetch 함수
const loadSummaryData = async (startDate, endDate, month) => {
  // 중복되는 fetch 로직을 여기에 한 번만 작성
  await Promise.all([
    transactionStore.fetchTransactions({ uId, startDate, endDate }),
    goalStore.fetchGoalByMonth(uId, month),
  ]);
};

// 2. 달력이 범위를 알려줄 때 (달력 넘길 때)
const handleViewChange = async ({ startDate, endDate }) => {
  currMonth.value = startDate.substring(0, 7);
  await loadSummaryData(startDate, endDate, currMonth.value);
};

// 3. 페이지가 다시 켜질 때 (모달에 갔다가 컴백할 때)
onActivated(async () => {
  if (route.name !== 'summary') return;

  // 현재 currMonth 기준으로 범위 계산만 하고 loadSummaryData 호출
  const [year, month] = currMonth.value.split('-');
  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(Number(year), Number(month), 0).getDate();
  const endDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

  await loadSummaryData(startDate, endDate, currMonth.value);
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
