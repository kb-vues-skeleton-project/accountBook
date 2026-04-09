<template>
  <div class="doughnut-wrapper">
    <apexchart
      class="doughnut-chart"
      type="donut"
      :options="options"
      :series="series"
      :height="'100%'"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  labels: {
    type: Array,
    required: true,
  },
  series: {
    type: Array,
    required: true,
  },
});

// 옵션 설정
const options = computed(() => ({
  chart: {
    type: 'donut',
  },
  labels: props.labels,
  legend: {
    position: 'bottom',
  },
  dataLabels: {
    enabled: true,
  },
  tooltip: {
    y: {
      formatter: (val) => `${val.toLocaleString()}원`,
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        legend: {
          show: false,
        },
      },
    },
  ],
}));
</script>

<style scoped>
.doughnut-wrapper {
  width: 100%;
  height: 30rem;
  background-color: var(--color-white);
  border-radius: 2rem;
  box-shadow: var(--boxshadow-light);
  padding: 0.5rem;
}

.doughnut-chart {
  width: 100%;
  height: 100%;
}
</style>
