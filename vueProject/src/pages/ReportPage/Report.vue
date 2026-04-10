<template>
  <div class="report-page">
    <!-- 상단 요약 -->
    <div class="summary-bar">
      <div class="summary-item">
        <span class="summary-label">총지출</span>
        <span class="summary-value total"
          >{{ formatMoney(sumExpenditure) }}원</span
        >
      </div>
      <div class="summary-item">
        <span class="summary-label">고정지출</span>
        <span class="summary-value fixed"
          >{{ formatMoney(sumFixedExpenditure) }}원</span
        >
      </div>
      <div class="summary-item">
        <span class="summary-label">변동지출</span>
        <span class="summary-value variable"
          >{{ formatMoney(sumChangeExpenditure) }}원</span
        >
      </div>
    </div>

    <h3 class="section-title">카테고리별 지출</h3>

    <div class="report-content">
      <!-- 왼쪽: 이중 도넛 차트 -->
      <div class="chart-area">
        <div class="chart-wrapper">
          <Doughnut :data="doughnutData" :options="doughnutOptions" />
        </div>
        <div class="chart-legend">
          <span class="legend-item">
            <span class="legend-dot fixed-dot"></span> 안쪽: 고정지출
          </span>
          <span class="legend-item">
            <span class="legend-dot variable-dot"></span> 바깥쪽: 변동지출
          </span>
        </div>
      </div>

      <!-- 오른쪽: 카테고리별 리스트 -->
      <div class="category-area">
        <ul class="category-list">
          <li
            v-for="item in mergedCategories"
            :key="item.categoryId"
            class="category-item"
          >
            <!-- 퍼센트 원 -->
            <div
              class="percentage-circle"
              :style="{ backgroundColor: item.color }"
            >
              <span class="percentage-text">{{ item.percentage }}%</span>
            </div>

            <!-- 카테고리 이름 -->
            <div class="cat-info">
              <span class="cat-name">{{ item.name }}</span>
            </div>

            <!-- 고정/변동 금액 -->
            <div class="cat-amounts">
              <div class="amount-row">
                <span class="amount-label fixed-label">고정</span>
                <span class="amount-value"
                  >{{ formatMoney(item.fixedSum) }}원</span
                >
              </div>
              <div class="amount-row">
                <span class="amount-label variable-label">변동</span>
                <span class="amount-value"
                  >{{ formatMoney(item.variableSum) }}원</span
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Doughnut } from 'vue-chartjs';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

const colorPalette = [
  '#6C5CE7',
  '#A855F7',
  '#F67280',
  '#F8B500',
  '#FF9F40',
  '#36A2EB',
  '#4BC0C0',
  '#9966FF',
  '#7BC8A4',
  '#C06C84',
  '#355C7D',
  '#43DDE6',
  '#E8505B',
  '#14A76C',
  '#FF6384',
  '#FFCE56',
  '#3FC1C9',
  '#364F6B',
  '#F9D56E',
  '#FC5185',
];

onMounted(async () => {
  await categoryStore.fetchCategories();
  await transactionStore.fetchTransactions({
    userId: 1,
    startDate: '2026-04-01',
    endDate: '2026-04-30',
  });
});

const sumExpenditure = computed(() => transactionStore.totalAprilExpenditure);
const sumFixedExpenditure = computed(
  () => transactionStore.totalAprilFixedExpenditure,
);
const sumChangeExpenditure = computed(
  () => transactionStore.totalAprilChangeExpenditure,
);

// 카테고리별 고정/변동 합계를 하나의 리스트로 병합
const mergedCategories = computed(() => {
  const categories = categoryStore.state.categories;
  const txns = transactionStore.transactions;
  const total = sumExpenditure.value || 1;

  const expenditureTxns = txns.filter(
    (t) => t.date.startsWith('2026-04') && t.type === 'expenditure',
  );

  const map = {};
  expenditureTxns.forEach((t) => {
    if (!map[t.categoryId]) {
      map[t.categoryId] = { fixedSum: 0, variableSum: 0 };
    }
    // store 기존 로직: static === false → 고정, static === true → 변동
    if (t.static === false) {
      map[t.categoryId].fixedSum += t.balance;
    } else {
      map[t.categoryId].variableSum += t.balance;
    }
  });

  return Object.entries(map)
    .map(([catId, sums]) => {
      const cat = categories.find((c) => String(c.id) === String(catId));
      const colorIndex = cat ? categories.indexOf(cat) : 0;
      const totalSum = sums.fixedSum + sums.variableSum;
      return {
        categoryId: catId,
        name: cat ? cat.name : `카테고리 ${catId}`,
        color:
          colorPalette[colorIndex >= 0 ? colorIndex % colorPalette.length : 0],
        fixedSum: sums.fixedSum,
        variableSum: sums.variableSum,
        totalSum,
        percentage: ((totalSum / total) * 100).toFixed(0),
      };
    })
    .sort((a, b) => b.totalSum - a.totalSum);
});

// 이중 도넛 차트
const doughnutData = computed(() => {
  const items = mergedCategories.value;
  return {
    labels: items.map((c) => c.name),
    datasets: [
      {
        label: '고정지출',
        data: items.map((c) => c.fixedSum),
        backgroundColor: items.map((c) => c.color),
        borderWidth: 2,
        borderColor: '#fff',
      },
      {
        label: '변동지출',
        data: items.map((c) => c.variableSum),
        backgroundColor: items.map((c) => c.color + 'AA'),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };
});

const doughnutOptions = {
  responsive: true,
  cutout: '40%',
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: '고정 vs 변동 지출',
      font: { size: 16, weight: 'bold' },
      padding: { bottom: 16 },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const datasetLabel = ctx.dataset.label || '';
          const value = ctx.raw || 0;
          return `${datasetLabel} - ${ctx.label}: ${value.toLocaleString()}원`;
        },
      },
    },
  },
};

const formatMoney = (val) => (val || 0).toLocaleString();
</script>

<style scoped></style>
