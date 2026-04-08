<template>
  <div class="calendar-section">
    <VDatePicker
      v-model="selectedDate"
      expanded
      borderless
      @dayclick="onDayClick"
    >
      <template #day-content="{ day }">
        <div class="day-cell" @click.stop="onDayClick(day)">
          <span class="day-label">{{ day.day }}</span>

          <div class="day-info" v-if="getDaySummary(day.id)">
            <p v-if="getDaySummary(day.id).income > 0" class="income-text">
              +{{ getDaySummary(day.id).income.toLocaleString() }}
            </p>
            <p v-if="getDaySummary(day.id).spend > 0" class="spend-text">
              -{{ getDaySummary(day.id).spend.toLocaleString() }}
            </p>
          </div>
        </div>
      </template>
    </VDatePicker>

    <DailyDetail
      v-if="isModalOpen"
      :date="clickedDate"
      :transactions="dailyDetails"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import DailyDetail from '@/pages/SummaryPage/DailyDetail.vue';

const transactionStore = useTransactionStore();
const selectedDate = ref(new Date());
const isModalOpen = ref(false);
const clickedDate = ref('');
const dailyDetails = ref([]);

const getDaySummary = (dateString) => {
  const dayTransactions = transactionStore.transactions.filter(
    (t) => t.date === dateString,
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
  // 2. 이벤트가 들어오는지 콘솔로 먼저 확인
  console.log('날짜 클릭됨!', day.id);

  clickedDate.value = day.id;
  dailyDetails.value = transactionStore.transactions.filter(
    (t) => t.date === day.id,
  );

  // 데이터 유무 관계 없이 모달창 띄우기
  isModalOpen.value = true;
};
</script>

<style scoped>
.day-cell {
  min-height: 80px; /* 높이를 충분히 확보 */
  padding: 4px;
  border-top: 1px solid #f8f8f8;
  cursor: pointer; /* 다시 손가락 모양 나오게 설정 */
  display: flex;
  flex-direction: column;
  z-index: 10; /* 클릭 우선순위 확보 */
}

/* 3. pointer-events 관련 코드는 싹 지워주세요! */

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
