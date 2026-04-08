import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const BASEURI = '/api/users';

  const state = reactive({
    users: [], // 전체 유저 리스트
    currentUser: null, // 로그인한 유저 정보 저장용
  });

  // 1. 전체 유저 조회 (중복 확인 및 검증용)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.users = response.data; // 전체 유저 리스트
    } catch (error) {
      console.error('유저 정보를 불러오는 데 실패했습니다.', error);
    }
  };

  // 2. ID 중복 확인
  const isIdDuplicate = (userId) => {
    return state.users.some((user) => user.userId === userId);
  };

  // 3. 회원가입 (POST)
  const signUp = async (newUser, successCallback) => {
    try {
      const response = await axios.post(BASEURI, newUser);
      if (response.status === 201) {
        state.users.push(response.data);
        if (successCallback) successCallback();
        console.log(response.data);
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
    }
  };

  return {
    state,
    fetchUsers,
    isIdDuplicate,
    signUp,
  };
});
