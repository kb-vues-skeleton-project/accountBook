<template>
  <div class="category-container">
    <ul class="category-list">
      <!-- %(퍼센이트) 작성 -->
      <li v-for="item in categoryDate" :key="item.id" class="category-item">
        <div class="percentage-circle" :style="{ backgroundColor: item.color }">
          <span class="percentage-text">{{ item.percentage }}%</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
//여기서는 percentage를 구하기 위함 부름, 그래서 합계만 따로 불러오면 됨
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';

const transactionStore = useTransactionStore(); // 합계를 불러오기 위함
const categoryStore = useCategoryStore(); //카테고리 조회에서 불러오기 위함

// 초기 데이터 로딩(컴포넌트 마운트 시)
(onMounted) => {
  categoryStore.fetchCategories();
};
// 2. 전체 지출 합계
const totalExpenditure = computed(() => transactionStore.totalAprilExpenditure);

//카테고리별 % 계산 로직
const categoryListWithPercentage = computed(() => {
  const categories = categories.state.categories; //categoryStroe 에서 받아온 데이터
  const transacions = transactionStore.totalAprilChangeExpenditure;
  const total = totalExpenditure.value;

  if (total === 0) {
    return categories.map((cat) => ({
      ...cat,
      percentage: 0,
      categorySum: 0,
    }));
  }
  //카테고리별 데이터 구별하는 거
  return categories.map((cat) => {
    const categorySum = transacions
      .filter((t) => t.categoryId === cat.id && t.type === 'expenditure')
      .reduce((acc, cur) => acc + cur.balance, 0);

    //퍼센티지 계산
    const percentage = ((categorySum / total) * 100).toFixed(1);

    return {
      ...cat,
      categorySum,
      percentage: Number(percentage), //숫자로 변환해버려
    };
  });
});
</script>

<style scoped>
/* 퍼센트 원 */
.percentage-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;

  .percentage-text {
    color: #fff;
    font-size: 0.85rem;
    font-weight: bold;
  }
}
</style>
