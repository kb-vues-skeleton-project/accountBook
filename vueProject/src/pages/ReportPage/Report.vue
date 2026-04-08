<template>
  <div></div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter';
import { DoughnutChart } from 'vue-chart-3';
import { Chart, registerables } from 'chart.js';

//chart.js 필요한 모듈만 등록함
Chart.register(ArcElement, Tooltip, Legend, DatasetController);

const doubleDoughnut = {
  //1. 데이터 정의(안쪽 원, 바깥쪽 원)
};

const options = {};

const store = useCounterStore();
</script>

<style scoped></style>
