// 수입, 지출 내역
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]);
  const BASEURITransactions = '/api/transactions';

  // 거래 내역 조회
  const fetchTransactions = async ({
    userId,
    startDate,
    endDate,
    categoryId,
    isStatic,
  }) => {
    try {
      // userId 및 기간 조회(json-server 기준: date_gte(크거나 같음), date_lte(작거나 같음))
      let url = `${BASEURITransactions}?userId=${userId}&date_gte=${startDate}&date_lte=${endDate}`;

      // 카테고리별 조회
      if (categoryId && categoryId !== 0) {
        url += `&categoryId=${categoryId}`;
      }

      // 고정 지출별 조회
      if (isStatic !== undefined && isStatic !== null) {
        url += `&static=${isStatic}`;
      }

      const response = await axios.get(url);
      transactions.value = response.data;
    } catch (error) {
      console.error('거래 내역 로딩 실패:', error);
    }
  };

  // 거래 내역 추가
  const addTransaction = async (newTransaction) => {
    try {
      const response = await axios.post(BASEURITransactions, newTransaction);
      transactions.value.push(response.data);
    } catch (error) {
      console.error('저장 실패:', error);
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
