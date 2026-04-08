import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useCategoryStore = defineStore('categoryStore', () => {
  const BASEURI = '/api/category';

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
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${BASEURI}/${id}`);
      state.categories = state.categories.filter((c) => c.id !== id);
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  return { state, iconList, fetchCategories, addCategory, deleteCategory };
});
