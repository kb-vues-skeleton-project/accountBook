<template>
  <div class="transaction-list-container">
    <header class="page-header">
      <h2 class="page-title">거래내역</h2>

      <div class="month-controller">
        <button class="nav-btn" @click="changeMonth(-1)">
          <i class="bi bi-chevron-left">&lt;</i>
        </button>
        <p class="current-month">
          {{ currentYM.split('-')[0] }}년 {{ currentYM.split('-')[1] }}월
        </p>
        <button class="nav-btn" @click="changeMonth(1)">
          <i class="bi bi-chevron-right">&gt;</i>
        </button>
      </div>
    </header>
    <!--- 카테고리 선택자 -->
    <CategorySelect @filter="handleFilter" />
    <div
      v-if="Object.keys(groupedTransactions).length === 0"
      class="empty-state"
    >
      <p>{{ currentYM.split('-')[1] }}월 거래 내역이 없습니다.</p>
    </div>
    <div
      v-for="(items, date) in groupedTransactions"
      :key="date"
      class="date-group"
    >
      <div class="date-header">
        <span class="date-text">{{ formatDate(date) }}</span>
      </div>

      <div class="transaction-items">
        <div v-for="item in items" :key="item.id" class="item-wrapper">
          <TransactionItem :transaction="item" />
        </div>
      </div>
    </div>

    <AddButton />
  </div>
</template>

<script setup>
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { ref, computed, onMounted, watch } from 'vue';
import AddButton from '@/components/Summary/AddButton.vue';
import CategorySelect from '@/components/TransactionList/CategorySelect.vue';
import TransactionItem from '@/components/TransactionList/TransactionItem.vue';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const uId = JSON.parse(localStorage.getItem('currentUser'));
const filterState = ref({ type: null, cIds: [] });

// 선택된 날짜
const d = new Date();
const currentYM = ref(
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
);

// 필터 적용 핸들러
const handleFilter = (payload) => {
  filterState.value = payload; // { type: 'income', cIds: [1, 2] }
  loadData();
};

// 데이터 호출
const loadData = async () => {
  const [year, month] = currentYM.value.split('-');
  const lastDay = new Date(year, month, 0).getDate();

  await transactionStore.fetchTransactions({
    uId,
    startDate: `${currentYM.value}-01`,
    endDate: `${currentYM.value}-${lastDay}`,
    cId: filterState.value.cIds, // 다중 ID 배열 전달
    type: filterState.value.type, // 타입(수입/지출) 전달
  });
};
onMounted(async () => {
  await categoryStore.fetchCategories();
  await loadData();
});

// 월 변경 함수
const changeMonth = (delta) => {
  const [year, month] = currentYM.value.split('-').map(Number);
  const newDate = new Date(year, month - 1 + delta, 1);

  const newYear = newDate.getFullYear();
  const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');

  currentYM.value = `${newYear}-${newMonth}`;
};

// currentYM이 변하면 데이터를 자동으로 다시 불러옴
watch(currentYM, () => {
  loadData();
});

// 그룹화 + 내림차순 정렬 (기존 로직 유지)
const groupedTransactions = computed(() => {
  const groups = {};

  transactionStore.transactions.forEach((item) => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  });

  return groups;
});

const formatDate = (dateStr) => {
  const d = new Date(dateStr.replace(/-/g, '/'));
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dateStr.split('-')[1]}월 ${dateStr.split('-')[2]}일 ${week[d.getDay()]}요일`;
};
</script>

<style scoped>
.month-controller {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-btn {
  background: white;
  border: 1px solid #dee2e6;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #4e5968;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.nav-btn:hover {
  background-color: #f8f9fa;
  border-color: #1a5c9c;
  color: #1a5c9c;
}

.current-month {
  font-size: 24px;
  color: #1a5c9c;
  font-weight: 800;
  margin: 0;
  min-width: 150px;
  text-align: center;
}
/* 컨테이너: 좌우 꽉 채우기 */
.transaction-list-container {
  width: 100%;
  min-height: calc(100vh - 70px);
  background-color: #f8f9fa;
  padding: 40px 60px 120px; /* 좌우 여백을 넓게 주어 시원하게 */
  box-sizing: border-box;
  font-family: 'Pretendard', sans-serif;
}

/* 페이지 헤더: 화면 양 끝으로 배치 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 2px solid #191f28;
  padding-bottom: 15px;
  margin-bottom: 40px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  color: #191f28;
  margin: 0;
}

.current-month {
  font-size: 20px;
  color: #1a5c9c; /* 테마 컬러 */
  font-weight: 700;
  margin: 0;
}

/* 날짜 그룹: 섹션별 구분 */
.date-group {
  margin-bottom: 50px;
}

.date-header {
  padding: 15px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #dee2e6;
}

.date-text {
  font-size: 18px;
  font-weight: 700;
  color: #4e5968;
}

/* 거래 아이템 리스트: 가로로 길게 */
.transaction-items {
  display: flex;
  flex-direction: column;
  gap: 15px; /* 카드 사이 간격 */
}

/* 개별 아이템 래퍼: 가로 100% 활용 */
.item-wrapper {
  width: 100%; /* 화면 꽉 채우기 */
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.item-wrapper:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  background-color: #fcfdfe;
}

/* 빈 상태 */
.empty-state {
  text-align: center;
  padding: 150px 0;
  font-size: 20px;
  color: #adb5bd;
}

/* 반응형 (화면이 작아질 때 여백 조정) */
@media (max-width: 1024px) {
  .transaction-list-container {
    padding: 30px 30px 100px;
  }
}

@media (max-width: 768px) {
  .transaction-list-container {
    padding: 20px 16px 80px;
  }
  .page-title {
    font-size: 24px;
  }
}
</style>
