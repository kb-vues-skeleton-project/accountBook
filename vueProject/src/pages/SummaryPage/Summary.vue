<template>
  <div
    class="summary-container"
    v-if="
      goalStore.currentMonthGoal && transactionStore.transactions.length > 0
    "
  >
    <div class="header-stats">
      <div class="stat-item">
        <span class="label">4월 지출 목표</span>
        <span class="value">
          {{ goalStore.goalBalance.toLocaleString() }}원
        </span>
      </div>
      <div class="stat-item">
        <span class="label">현재 사용 완료</span>
        <span class="value spend">
          {{ (goalStore.currentMonthGoal.amount || 0).toLocaleString() }}원
        </span>
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
          <strong>{{ goalStore.remainingBudget.toLocaleString() }}원</strong>
        </span>
      </div>
    </div>

    <p class="alert-text">
      이번 달 사용한
      {{ transactionStore.totalAprilExpenditure.toLocaleString() }}원 중,
      과소비한 금액은 {{ overSpendAmount.toLocaleString() }}원({{
        overSpendRate
      }}%)에 해당해요.
    </p>
  </div>

  <div v-else style="padding: 50px; text-align: center; color: #888">
    데이터를 불러오는 중입니다... (데이터가 없다면 db.json의 userId와 date를
    확인해주세요)
  </div>

  <!-- 캘린더 영역 -->
  <div class="calendar-container">
    <VDatePicker
      v-model="selectedDate"
      expanded
      borderless
      @dayclick="onDayClick"
    >
      <template #day-content="{ day, attributes }">
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
        <h3>{{ clickedDate }} 상세 내역</h3>
        <ul>
          <li v-for="item in dailyDetails" :key="item.id">
            {{ item.name }}: {{ item.type === 'income' ? '+' : '-'
            }}{{ item.balance.toLocaleString() }}원
          </li>
        </ul>
        <button @click="isModalOpen = false">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useGoalStore } from '@/stores/goalStore';

const transactionStore = useTransactionStore();
const goalStore = useGoalStore();

const isModalOpen = ref(false);
const clickedDate = ref('');
const dailyDetails = ref([]);

onMounted(async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    goalStore.fetchGoals(),
  ]);
});

// 과소비 계산 (Summary 컴포넌트 전용 로직이라 여기에 두는 것이 좋습니다)
const overSpendAmount = computed(() => {
  return transactionStore.transactions
    .filter((t) => t.date.startsWith('2026-04') && t.selfCheck === 3)
    .reduce((acc, cur) => acc + cur.balance, 0);
});

const overSpendRate = computed(() => {
  if (transactionStore.totalAprilExpenditure === 0) return 0;
  return (
    (overSpendAmount.value / transactionStore.totalAprilExpenditure) *
    100
  ).toFixed(0);
});

const getDaySummary = (dateString) => {
  // dateString 형식: "2026-04-08"
  const dayTransactions = transactionStore.transactions.filter(
    (t) => t.date === dateString,
  );

  if (dayTransactions.length === 0) return null;

  const income = dayTransactions
    .filter((t) => t.type === 'income')
    .reduce((acc, cur) => acc + cur.balance, 0);
  const spend = dayTransactions
    .filter((t) => t.type === 'expenditure')
    .reduce((acc, cur) => acc + cur.balance, 0);

  return { income, spend };
};

// 날짜 클릭 이벤트
const onDayClick = (day) => {
  clickedDate.value = day.id; // 클릭한 날짜 저장
  dailyDetails.value = transactionStore.transactions.filter(
    (t) => t.date === day.id,
  );

  if (dailyDetails.value.length > 0) {
    isModalOpen.value = true;
  }
};
</script>

<style scoped>
/* 상단바: 네이버 감성의 깔끔한 스타일 */
.summary-container {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
}
.header-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}
.stat-item {
  text-align: center;
}
.label {
  display: block;
  font-size: 13px;
  color: #888;
  margin-bottom: 5px;
}
.value {
  font-size: 18px;
  font-weight: bold;
}
.spend {
  color: #ff4d4f;
}
.income {
  color: #03c75a;
}

.progress-bar-container {
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}
.progress-fill {
  height: 100%;
  background: #03c75a; /* 목표 안쪽일 땐 초록 */
  transition: width 0.3s ease;
}
.alert-text {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

/* 2. 달력 칸 스타일 */
.day-cell {
  height: 80px;
  padding: 4px;
  border-top: 1px solid #f0f0f0;
}
.income-text {
  color: #03c75a;
  font-size: 11px;
  margin: 0;
}
.spend-text {
  color: #ff4d4f;
  font-size: 11px;
  margin: 0;
}
/* 모달 스타일은 가이드에 따라 자유롭게 구성하세요! */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
</style>
