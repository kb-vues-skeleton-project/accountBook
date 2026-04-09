<template>
  <div>
    <h2>거래내역</h2>
    <CategorySelect />
  </div>

  <div
    v-for="(items, date) in groupedTransactions"
    :key="date"
    class="date-group"
  >
    <div class="date-header">{{ formatDate(date) }}</div>

    <div v-for="item in items" :key="item.id">
      <TransactionItem :transaction="item" />
    </div>
  </div>
  <AddButton />
</template>

<script setup>
import CategorySelect from '@/components/TransactionList/CategorySelect.vue';
import TransactionItem from '@/components/TransactionList/TransactionItem.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { computed, onMounted } from 'vue';
import AddButton from '@/components/Summary/AddButton.vue';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const userId = JSON.parse(localStorage.getItem('currentUser'));

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
    userId,
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

<style scoped></style>
