import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useTransactionStore } from './transactionStore'; // 지출 합계를 가져오기 위해 연결

export const useGoalStore = defineStore('goal', () => {
  const currentMonthGoal = ref(null);
  const transactionStore = useTransactionStore();
  const BASEURIGoal = '/api/goal';

  // Action: 특정 유저의 특정 달 목표 딱 하나만 가져오기
  const fetchGoalByMonth = async (userId, yearMonth) => {
    try {
      const response = await axios.get(
        `${BASEURIGoal}?userId=${userId}&date=${yearMonth}`,
      );

      // 결과가 배열로 오므로 첫 번째 요소를 저장
      currentMonthGoal.value =
        response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('목표 조회 실패:', error);
      currentMonthGoal.value = null;
    }
  };

  // Getters

  // [지출 목표 금액]
  const goalBalance = computed(() => {
    return currentMonthGoal.value ? currentMonthGoal.value.balance : 0;
  });

  // [실시간 지출 합계]
  // transactionStore.transactions는 부모가 이미 해당 월만 필터링해서 가져온 상태임
  const currentExpenditure = computed(() => {
    return transactionStore.transactions
      .filter((t) => t.type === 'expenditure')
      .reduce((acc, cur) => acc + cur.balance, 0);
  });

  // [현재 달성률 계산]
  const achievementRate = computed(() => {
    const goal = goalBalance.value;
    if (goal === 0) return 0;

    const rate = (currentExpenditure.value / goal) * 100;
    return Math.min(Math.round(rate), 100);
  });

  // [남은 사용 가능 금액]
  const remainingBudget = computed(() => {
    const remaining = goalBalance.value - currentExpenditure.value;
    return remaining > 0 ? remaining : 0;
  });

  const updateGoal = async (id, newBalance) => {
    try {
      // 1. 서버(DB) 데이터 업데이트 (PATCH: balance만 쏙 수정)
      const response = await axios.patch(`${BASEURIGoal}/${id}`, {
        balance: newBalance,
      });

      // 2. 현재 스토어에 저장된 값도 즉시 업데이트
      // (Summary 화면의 숫자가 새로고침 없이 바로 바뀜)
      if (currentMonthGoal.value) {
        currentMonthGoal.value.balance = response.data.balance;
      }
      return { success: true };
    } catch (error) {
      console.error('목표 수정 실패:', error);
      return { success: false };
    }
  };

  return {
    currentMonthGoal,
    fetchGoalByMonth,
    goalBalance,
    currentExpenditure,
    achievementRate,
    remainingBudget,
    updateGoal,
  };
});
