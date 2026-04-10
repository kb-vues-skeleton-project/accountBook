<template>
  <div class="d-flex justify-content-end gap-5 mb-4 small">
    <!-- 총지출 -->
    <div class="fw=bold mb-1">총지출</div>
    <div>
      <span class="fw-bold mb -1">{{ sumExpenditure }}원</span>
    </div>
    <!-- 고정지출 -->
    <div class="fw=bold mb-1">고정지출</div>
    <div>
      <span class="fw-bold mb -1">{{ sumFixedExpenditure }}원</span>
    </div>
    <!-- 고정지출 건수와 금액적어주면 됨 -->

    <!--변동지출  -->
    <div class="fw=bold mb-1">변동지출</div>
    <div>
      <span class="fw-bold mb -1">{{ sumChangeExpenditure }}원</span>
    </div>
  </div>
  <!--카테고리별 지출 제목 -->
  <div class="fw-bold mb-1">카테고리별 지출</div>

  <!-- 도넛 차트 + 카테고리별 리스트 -->
</template>

<script setup>
//categoryStore을 불러와야 돼
import { useTransactionStore } from '@/stores/transactionStore';
import { computed, ref, onMounted } from 'vue';
import CategoryList from '@/components/Report/CategoryList.vue';
import ReportDoughnut from '@/components/Report/ReportDoughnut.vue';

//pinia 스토어 함수 실행
const transactionStore = useTransactionStore();

const sumExpenditure = computed(() => transactionStore.totalAprilExpenditure);
//총 지출의 합계를 불러온거

// const sumIncome = computed(() => transactionStore.totalAprilIncome);
//총 수입의 합계를 불러온거

const sumFixedExpenditure = computed(
  () => transactionStore.totalAprilFixedExpenditure,
);
//고정 지출의 합계

console.log('합계 : ', sumFixedExpenditure);

const sumChangeExpenditure = computed(
  () => transactionStore.totalAprilChangeExpenditure,
);
//변동 지출의 합계
</script>

<style lang="scss" scoped></style>

//data들의 id를 숫자로 받아서 이름과 합을 받아서 표시!?
