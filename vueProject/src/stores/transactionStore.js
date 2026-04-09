// 수입, 지출 내역
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]); // 달력 전체용
  const dailyTransactions = ref([]); // 모달용 (하루치) 분리
  const singleTransaction = ref({});
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

  // 개별 id 조회
  const idFetch = async (id) => {
    try {
      const url = `${BASEURITransactions}/${id}`;
      const response = await axios.get(url);
      singleTransaction.value = response.data;
    } catch (err) {
      console.log(err);
    }
  };

  // 거래 내역 수정
  const updateTransaction = async (id, transaction) => {
    try {
      const response = await axios.put(
        `${BASEURITransactions}/${id}`,
        transaction,
      );
      const index = transactions.value.findIndex((t) => t.id === id);
      transactions.value[index] = response.data;
    } catch (err) {
      console.log(err);
    }
  };

  // 개별 날짜 전용 조회 (dailyDetail용)
  const fetchDailyTransactions = async ({ userId, date }) => {
    try {
      const url = `${BASEURITransactions}?userId=${userId}&date=${date}`;
      const response = await axios.get(url);
      dailyTransactions.value = response.data;
    } catch (error) {
      console.error('일일 상세 내역 로딩 실패:', error);
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
    dailyTransactions,
    singleTransaction,
    totalAprilExpenditure,
    totalAprilIncome,
    fetchTransactions,
    idFetch,
    fetchDailyTransactions,
    addTransaction,
    updateTransaction,
  };
});
