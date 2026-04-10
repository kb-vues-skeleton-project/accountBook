<template>
  <div class="transaction-list-container">
    <header class="page-header">
      <h2 class="page-title">거래내역</h2>
      <p class="current-month">
        {{ currentYM.split('-')[0] }}년 {{ currentYM.split('-')[1] }}월
      </p>
    </header>

    <div
      v-if="Object.keys(groupedTransactions).length === 0"
      class="empty-state"
    >
      <p>이번 달 거래 내역이 없습니다.</p>
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
// import CategorySelect from '@/components/TransactionList/CategorySelect.vue';
import TransactionItem from '@/components/TransactionList/TransactionItem.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { computed, onMounted } from 'vue';
import AddButton from '@/components/Summary/AddButton.vue';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const uId = JSON.parse(localStorage.getItem('currentUser'));

// 날짜 포맷팅
const getYearMonth = () => {
  const d = new Date();
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${yy}-${mm}`;
};

const currentYM = getYearMonth();
const startDate = `${currentYM}-01`;
const endDate = `${currentYM}-31`; // 실제론 월말 날짜 계산이 필요하지만 일단 유지)

onMounted(async () => {
  await categoryStore.fetchCategories();

  await transactionStore.fetchTransactions({
    uId,
    startDate,
    endDate,
  });
});

//  그룹화 + 내림차순 정렬
const groupedTransactions = computed(() => {
  // 내림차순 정렬
  const sorted = [...transactionStore.transactions].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  const groups = {};
  sorted.forEach((item) => {
    if (!groups[item.date]) {
      groups[item.date] = [];
    }
    groups[item.date].push(item);
  });

  return groups;
});

// 날짜 포맷팅용 함수
const formatDate = (dateStr) => {
  const d = new Date(dateStr.replace(/-/g, '/'));
  const week = ['일', '월', '화', '수', '목', '금', '토'];
  return `${dateStr.split('-')[1]}월 ${dateStr.split('-')[2]}일 ${week[d.getDay()]}요일`;
};
</script>

<style scoped>
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
