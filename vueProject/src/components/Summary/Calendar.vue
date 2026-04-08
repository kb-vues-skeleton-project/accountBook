<template>
  <div class="calendar-section">
    <VDatePicker
      v-model="selectedDate"
      expanded
      borderless
      @dayclick="onDayClick"
    >
      <template #day-content="{ day }">
        <div class="day-cell">
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

    <div v-if="isModalOpen" class="modal-overlay" @click="isModalOpen = false">
      <div class="modal-content" @click.stop>
        <h4>{{ clickedDate }} 내역</h4>
        <div v-for="item in dailyDetails" :key="item.id" class="detail-item">
          {{ item.name }}: {{ item.balance.toLocaleString() }}원
        </div>
        <button @click="isModalOpen = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';

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
  clickedDate.value = day.id;
  dailyDetails.value = transactionStore.transactions.filter(
    (t) => t.date === day.id,
  );
  if (dailyDetails.value.length > 0) isModalOpen.value = true;
};
</script>

<style scoped>
.day-cell {
  min-height: 60px;
  padding: 2px;
  border-top: 1px solid #f8f8f8;
}
.income-text {
  color: #03c75a;
  font-size: 10px;
  margin: 0;
}
.spend-text {
  color: #ff4d4f;
  font-size: 10px;
  margin: 0;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 80%;
  max-width: 400px;
}
</style>
