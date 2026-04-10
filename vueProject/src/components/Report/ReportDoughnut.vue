<template>
  <div style="max-width: 600px">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
// import { data } from 'v-calendar/dist/types/tests/unit/util/dayData.js';
import { Doughnut } from 'vue-chartjs';
// 이것도 Store에서 불러와야 함

// Chart.js에 필요한 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const chartData = {
  labels: ['내부1', '내부2', '외부1', '외부2', '외부3'],

  //
  datasets: [
    {
      // 내부 도넛
      data: [40, 50],
      backgroundColor: ['#b91d47', '#00aba9'],
    },
    {
      // 외부 도넛
      data: [70, 30, 40],
      backgroundColor: ['#b91d47', '#00aba9', '#DD1B16'],
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: true },
    title: {
      display: true,
      text: '카테고리별 지출',
      font: { size: 16 },
    },
  },
};
</script>
