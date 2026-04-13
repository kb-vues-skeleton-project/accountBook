import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDateStore = defineStore('date', () => {
  // 오늘 날짜를 'YY-MM-DD' 형식으로 만드는 함수
  const getToday = () => {
    const now = new Date();
    const yy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  };

  // 초기값을 오늘 날짜로 설정
  const selectedDate = ref(getToday());

  const yearMonth = computed(() => selectedDate.value.substring(0, 7));

  // 날짜 변경
  const setDate = (newDate) => {
    selectedDate.value = newDate;
  };

  return { selectedDate, yearMonth, setDate };
});
