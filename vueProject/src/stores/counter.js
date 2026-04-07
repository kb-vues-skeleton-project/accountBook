import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  const BASEURI = '/api';
  const state = reactivetive({ transactions: [] });
  const category = reactive({ category: [] });

  // 주석 달고 함수 기능 설명 써놓고 만들어주세요
  // test용, 함수 생성 이후 변경
  const userId = 'admin';
  const startDate = '26-04-01';
  const endDate = '26-04-30';

  return { userId, startDate, endDate, state, category };
});
