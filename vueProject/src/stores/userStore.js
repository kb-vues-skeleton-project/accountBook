import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const BASEURI = '/api/users';

  const state = reactive({
    users: [], // 전체 유저 리스트
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    // 현재 유저 정보 (없거나 로그인 후 가져오기)
  });

  // 전체 유저 조회 (중복 확인 및 검증용)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.users = response.data; // 전체 유저 리스트
    } catch (error) {
      console.error('유저 정보를 불러오는 데 실패했습니다.', error);
    }
  };

  // ID 중복 확인
  const isIdDuplicate = (uId) => {
    return state.users.some(
      (user) => String(user.uId).trim() === String(uId).trim(),
    );
  };

  // 회원가입
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

  // 로그인 (ID/PW 확인)
  const login = (uId, password) => {
    const foundUser = state.users.find(
      (u) => u.uId === uId && u.password === password,
    );

    if (foundUser) {
      // 로그인 한 유저 정보 저장
      state.currentUser = foundUser;
      localStorage.setItem('currentUser', JSON.stringify(foundUser.uId));
      return { success: true };
    } else {
      return {
        success: false,
      };
    }
  };

  return {
    state,
    fetchUsers,
    isIdDuplicate,
    signUp,
    login,
  };
});
