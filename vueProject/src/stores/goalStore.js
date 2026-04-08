import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useTransactionStore } from './transactionStore'; // 지출 합계를 가져오기 위해 연결

export const useGoalStore = defineStore('goal', () => {
  // 1. State: DB에서 가져온 목표 리스트
  const goals = ref([]);
  const transactionStore = useTransactionStore();
  const BASEURIGoal = '/api/goal';

  // 2. Actions: 서버에서 목표 데이터 가져오기
  const fetchGoals = async () => {
    try {
      const response = await axios.get(BASEURIGoal);
      goals.value = response.data;
    } catch (error) {
      console.error('목표 데이터를 불러오는 데 실패했습니다:', error);
    }
  };

  // 3. Getters (Computed): 가공된 데이터들

  // [현재 달(4월) 목표 객체 찾기]
  const currentMonthGoal = computed(() => {
    // db.json의 date 형식 "26-04"와 일치하는 데이터 탐색
    return (
      goals.value.find((g) => g.date === '26-04') || { balance: 0, amount: 0 }
    );
  });

  // [지출 목표 금액] (예: 800,000원)
  const goalBalance = computed(() => currentMonthGoal.value.balance);

  // [현재 달성률 계산] (지출 합계 / 목표 금액 * 100)
  const achievementRate = computed(() => {
    if (goalBalance.value === 0) return 0;
    // transactionStore에 만들어둔 4월 총지출 합계를 가져와서 계산
    const rate =
      (transactionStore.totalAprilExpenditure / goalBalance.value) * 100;
    return Math.min(Math.round(rate), 100); // 100%를 넘지 않게 처리
  });

  // [남은 사용 가능 금액]
  const remainingBudget = computed(() => {
    const remaining =
      goalBalance.value - transactionStore.totalAprilExpenditure;
    return remaining > 0 ? remaining : 0;
  });

  return {
    goals,
    fetchGoals,
    currentMonthGoal,
    goalBalance,
    achievementRate,
    remainingBudget,
  };
});
