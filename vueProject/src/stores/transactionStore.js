// 수입, 지출 내역
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([]); // 달력 전체용
  const dailyTransactions = ref([]); // 모달용 (하루치) 분리
  const singleTransaction = ref({});
  const BASEURITransactions = '/api/transactions';

  const fetchTransactions = async ({ uId, startDate, endDate, cId, type }) => {
    try {
      const params = new URLSearchParams({
        uId: uId,
        date_gte: startDate,
        date_lte: endDate,
        _sort: 'date', // 날짜별 정렬
        _order: 'desc', // 내림차순
      });

      // 타입 필터 (income / expenditure)
      if (type) {
        params.append('type', type);
      }

      let url = `${BASEURITransactions}?${params.toString()}`;

      // 카테고리 다중 필터 (cId=1&cId=2...)
      if (cId && Array.isArray(cId) && cId.length > 0) {
        const categoryQuery = cId.map((id) => `&cId=${id}`).join('');
        url += categoryQuery;
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
  // 거래 내역 삭제
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${BASEURITransactions}/${id}`);
      transactions.value = transactions.value.filter(
        (t) => String(t.id) !== String(id),
      );
      singleTransaction.value = null;
    } catch (err) {
      console.log(err);
    }
  };

  // 개별 날짜 전용 조회 (dailyDetail용)
  const fetchDailyTransactions = async ({ uId, date }) => {
    try {
      const url = `${BASEURITransactions}?uId=${uId}&date=${date}`;
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

  return {
    transactions,
    dailyTransactions,
    singleTransaction,
    fetchTransactions,
    idFetch,
    fetchDailyTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
});
