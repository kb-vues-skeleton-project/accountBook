<template>
  <div class="calendar-section">
    <VDatePicker
      v-model="selectedDate"
      expanded
      borderless
      @dayclick="onDayClick"
      @update:pages="onPageChange"
    >
      <template #day-content="{ day }">
        <div class="day-cell" @click.stop="onDayClick(day)">
          <span class="day-label">{{ day.day }}</span>

          <div class="day-info" v-if="getDaySummary(day)">
            <p v-if="getDaySummary(day).income > 0" class="income-text">
              +{{ getDaySummary(day).income.toLocaleString() }}
            </p>
            <p v-if="getDaySummary(day).spend > 0" class="spend-text">
              -{{ getDaySummary(day).spend.toLocaleString() }}
            </p>
          </div>
        </div>
      </template>
    </VDatePicker>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';

const emit = defineEmits(['view-change']);
const router = useRouter();
const transactionStore = useTransactionStore();

const selectedDate = ref(new Date());

const onPageChange = (pages) => {
  if (!pages || pages.length === 0) return;
  const page = pages[0];
  const year = page.year;
  const month = String(page.month).padStart(2, '0');

  const startDate = `${year}-${month}-01`;
  const lastDay = new Date(year, page.month, 0).getDate();
  const endDate = `${year}-${month}-${lastDay}`;

  emit('view-change', { startDate, endDate });
};

const getDaySummary = (day) => {
  if (!day || !day.id) return null;

  // timezone="UTC" 설정 시, day.id는 정확히 "2026-04-08" 문자열로 넘어옵니다.
  // 이 문자열과 JSON의 "date": "2026-04-08"을 직접 비교합니다.
  const dayTransactions = transactionStore.transactions.filter(
    (t) => t.date === day.id,
  );

  if (dayTransactions.length === 0) return null;

  return {
    income: dayTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, cur) => acc + cur.balance, 0),
    spend: dayTransactions
      .filter((t) => t.type === 'expenditure')
      .reduce((acc, cur) => acc + cur.balance, 0),
  };
};

const onDayClick = (day) => {
  if (!day || !day.id) return;
  // 클릭 시에도 day.id 문자열을 그대로 사용합니다.
  router.push({ name: 'summary/date', params: { date: day.id } });
};
</script>

<style scoped>
.day-cell {
  min-height: 80px;
  padding: 4px;
  border-top: 1px solid #f8f8f8;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}
.income-text {
  color: #03c75a;
  font-size: 10px;
  margin: 0;
  text-align: right;
}
.spend-text {
  color: #ff4d4f;
  font-size: 10px;
  margin: 0;
  text-align: right;
}
</style>
