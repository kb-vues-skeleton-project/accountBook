<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ formattedDate }}</h3>
        <button class="close-btn" @click="closeModal">×</button>
      </div>

      <div class="modal-body">
        <div class="section" v-if="incomeItems.length > 0">
          <h4 class="income-title">수입</h4>
          <ul>
            <li v-for="item in incomeItems" :key="item.id" class="detail-item">
              <span class="name">{{ item.name }}</span>
              <span class="amount income"
                >+{{ item.balance.toLocaleString() }}원</span
              >
              <button class="edit-btn" @click="editModal">✏️</button>
            </li>
          </ul>
        </div>

        <div class="section" v-if="expenseItems.length > 0">
          <h4 class="expense-title">지출</h4>
          <ul>
            <li v-for="item in expenseItems" :key="item.id" class="detail-item">
              <span class="name">{{ item.name }}</span>
              <span class="amount expense"
                >-{{ item.balance.toLocaleString() }}원</span
              >
              <button class="edit-btn" @click="editModal">✏️</button>
            </li>
          </ul>
        </div>

        <div
          v-if="incomeItems.length === 0 && expenseItems.length === 0"
          class="no-data"
        >
          해당 날짜의 내역이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();

const dateParam = computed(() => route.params.date);

const closeModal = () => {
  router.push('/summary');
};

const editModal = () => {
  router.push('/transactionEdit');
};

onMounted(async () => {
  const userId = JSON.parse(localStorage.getItem('currentUser'));
  await transactionStore.fetchDailyTransactions({
    userId: userId,
    date: dateParam.value,
  });
});

// 수입/지출 분류
const incomeItems = computed(() =>
  transactionStore.dailyTransactions.filter((t) => t.type === 'income'),
);
const expenseItems = computed(() =>
  transactionStore.dailyTransactions.filter((t) => t.type === 'expenditure'),
);

// 날짜 포맷팅
const formattedDate = computed(() => {
  if (!dateParam.value) return '';
  const dateObj = new Date(dateParam.value);
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dateParam.value.replace(/-/g, '.')} (${week[dateObj.getDay()]})`;
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(128, 128, 128, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  width: 60%; /* 화면의 60% 비중 */
  max-height: 70vh;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.section {
  margin-bottom: 25px;
}
.income-title {
  color: #03c75a;
  border-left: 4px solid #03c75a;
  padding-left: 8px;
  margin-bottom: 10px;
}
.expense-title {
  color: #ff4d4f;
  border-left: 4px solid #ff4d4f;
  padding-left: 8px;
  margin-bottom: 10px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f9f9f9;
}

.name {
  flex: 1;
  font-size: 16px;
}
.amount {
  font-weight: bold;
  margin-right: 15px;
}
.amount.income {
  color: #03c75a;
}
.amount.expense {
  color: #ff4d4f;
}

.edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #999;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px 0;
}
</style>
