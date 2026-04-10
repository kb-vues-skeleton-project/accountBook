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
              + {{ getDaySummary(day).income.toLocaleString() }}
            </p>
            <p v-if="getDaySummary(day).spend > 0" class="spend-text">
              - {{ getDaySummary(day).spend.toLocaleString() }}
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
/* 1. 전체 캘린더 구역 테두리 */
.calendar-section {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

/* 2. 각 날짜 칸의 구분선 (가로/세로 얇은 회색선) */
:deep(.vc-day) {
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  min-height: 90px; /* 칸 높이 확보 */
}

/* 3. 오늘 날짜 칸 강조 (남색 테두리 & 텍스트) */
:deep(.vc-day.is-today) {
  /* 기존 파란색 점이나 배경 제거 */
  background-color: transparent !important;
  /* 중간 굵기 남색 테두리 */
  outline: 2px solid #001f3f !important;
  outline-offset: -2px;
  z-index: 10;
}

/* 4. 오늘 날짜 숫자 굵게 & 남색 */
:deep(.vc-day.is-today .day-label) {
  color: #001f3f !important;
  font-weight: 800 !important;
}

/* 5. 개별 날짜 칸 내부 레이아웃 */
.day-cell {
  width: 100%;
  height: 100%;
  padding: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: background 0.2s;
}

.day-cell:hover {
  background-color: #f9f9f9;
}

.day-info {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 내부 텍스트들을 세로 가운데 정렬 */
  flex-grow: 1; /* 날짜 숫자 아래 공간을 이 영역이 다 차지하도록 함 */
}

.day-label {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

/* 6. 수입/지출 텍스트 스타일 */
.income-text {
  color: #03c75a;
  font-size: 17px;
  margin: 0;
  text-align: center;
  font-weight: 600;
}

.spend-text {
  color: #ff4d4f;
  font-size: 17px;
  margin: 0;
  text-align: center;
  font-weight: 600;
}

/* 7. 마지막 열 구분선 제거 (선택사항) */
:deep(.vc-day.weekday-7) {
  border-right: none;
}

/* vcalendar 기본 설정인 파란색 큰 점ㅡㅡ정말 별로 */
/* 오늘 날짜의 배경색과 테두리 등 기본 장식 싹 다 제거 */
:deep(.vc-day.is-today .vc-day-content) {
  background: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: inherit !important; /* 글자색을 파란색에서 다시 검정색으로 */
}

/* 가상 요소로 만들어진 '그 파란 점' 강제로 숨기기 */
:deep(.vc-day.is-today .vc-day-content::before),
:deep(.vc-day.is-today .vc-day-content::after) {
  display: none !important;
  content: none !important;
}

/* 만약 점이 .vc-highlight라는 클래스로 잡혀있을 경우 */
:deep(.vc-highlight),
:deep(.vc-highlight-content) {
  display: none !important;
}
/* 1. 오늘 날짜의 배경색과 테두리 등 기본 장식 싹 다 제거 */
:deep(.vc-day.is-today .vc-day-content) {
  background: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: inherit !important; /* 글자색을 파란색에서 다시 검정색으로 */
}

/* 2. 가상 요소로 만들어진 '그 파란 점' 강제로 숨기기 */
:deep(.vc-day.is-today .vc-day-content::before),
:deep(.vc-day.is-today .vc-day-content::after) {
  display: none !important;
  content: none !important;
}

/* 3. 만약 점이 .vc-highlight라는 클래스로 잡혀있을 경우 */
:deep(.vc-highlight),
:deep(.vc-highlight-content) {
  display: none !important;
}

/* 4. (복습) 우리가 원하는 남색 테두리만 남기기 */
:deep(.vc-day.is-today) {
  outline: 2px solid #001f3f !important;
  outline-offset: -2px;
  z-index: 10;
}
</style>
