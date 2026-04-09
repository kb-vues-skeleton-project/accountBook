<template>
  <div>
    <h2>거래내역</h2>
  </div>
  <div>
    <CategorySelect />
  </div>
  <div v-for="item in transactionStore.transactions" :key="item.id">
    <TransactionItem :transaction="item" />
    <br />
  </div>
</template>

<script setup>
import CategorySelect from '@/components/TransactionList/CategorySelect.vue';
import TransactionItem from '@/components/TransactionList/TransactionItem.vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { onMounted } from 'vue';

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

onMounted(async () => {
  await categoryStore.fetchCategories();
  await transactionStore.fetchTransactions();
});
</script>

<style scoped></style>
