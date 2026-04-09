// 수입, 지출 내역
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const BASEURITransactions = '/api/transactions';

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(BASEURITransactions);
      transactions.value = response.data;
    } catch (error) {
      console.error('거래 내역 로딩 실패:', error);
    }
  };

  const addTransaction = async (newTransaction) => {
    try {
      const response = await axios.post(BASEURITransactions, newTransaction);
      transactions.value.push(response.data);
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  const updateTransaction = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${BASEURITransactions}/${id}`,
        updatedData,
      );
      const index = state.transactions.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.transactions[index] = response.data;
      }
      return true;
    } catch (error) {
      console.error('수정 실패 :', error);
      return false;
    }
  };

  //..
  // [Summary용 가공 데이터] 4월 총 지출 합계
  const totalAprilExpenditure = computed(() => {
    return transactions.value
      .filter((t) => t.date.startsWith('2026-04') && t.type === 'expenditure')
      .reduce((acc, cur) => acc + cur.balance, 0);
  });

  // [Summary용 가공 데이터] 4월 총 수입 합계
  const totalAprilIncome = computed(() => {
    return transactions.value
      .filter((t) => t.date.startsWith('2026-04') && t.type === 'income')
      .reduce((acc, cur) => acc + cur.balance, 0);
  });

  return {
    transactions,
    totalAprilExpenditure,
    totalAprilIncome,
    fetchTransactions,
    addTransaction,
  };
});
