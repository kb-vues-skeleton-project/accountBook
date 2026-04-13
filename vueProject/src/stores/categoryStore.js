import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useCategoryStore = defineStore('categoryStore', () => {
  const BASEURI = '/api/categories';

  const state = reactive({
    categories: [],
  });

  const iconList = reactive([
    'etc.png',
    'food.png',
    'shopping.png',
    'hospital.png',
    'leisure.png',
    'transport.png',
    'beauty.png',
    'telecom.png',
    'sub.png',
    'salary.png',
    'allowance.png',
    'finance.png',
    'education.png',
    'gift.png',
    'pet.png',
    'home.png',
    'save.png',
    'utility.png',
  ]);

  // 카테고리 조회
  const fetchCategories = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.categories = response.data;
    } catch (error) {
      console.error('로드 실패:', error);
    }
  };

  // 카테고리 추가
  const addCategory = async (newCategory) => {
    try {
      if (state.categories.length >= 20) {
        return false;
      } // 20개 이상이면 등록 못하게
      //가장 큰 ID 값을 찾아 숫자형 ID 생성 (+1)
      const maxId =
        state.categories.length > 0
          ? Math.max(...state.categories.map((c) => Number(c.id)))
          : 0;

      const payload = {
        ...newCategory,
        id: maxId + 1, // 새 ID를 숫자로 부여
      };

      const response = await axios.post(BASEURI, payload);
      state.categories.push(response.data);

      return true;
    } catch (error) {
      console.error('추가 실패:', error);
      return null;
    }
  };

  // 카테고리 삭제
  // categoryStore.js
  const deleteCategory = async (id) => {
    try {
      // 1. 서버에 먼저 삭제 요청 (성공 시 200 OK)
      const response = await axios.delete(`${BASEURI}/${id}`);

      // 2. 서버 삭제가 성공했을 때만 로컬 state 업데이트
      if (response.status === 200) {
        state.categories = state.categories.filter(
          (c) => Number(c.id) !== Number(id),
        );
        console.log('삭제 성공 및 상태 업데이트 완료');
      }
    } catch (error) {
      console.error('삭제 실패:', error);
      // 실패 시 다시 데이터를 불러와서 싱크 맞추기
      fetchCategories();
    }
  };

  return { state, iconList, fetchCategories, addCategory, deleteCategory };
});
