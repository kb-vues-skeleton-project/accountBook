import axios from 'axios';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const BASEURI = '/api/users';

  const state = reactive({
    users: [], // 전체 유저 리스트
    currentUser: null, // 로그인한 유저 정보 저장용
  });

  // 1. 전체 유저 리스트 조회 (중복 확인 및 검증용)
  const fetchUsers = async () => {
    try {
      const response = await axios.get(BASEURI);
      state.users = response.data; // 기존 transactions.value 오타 수정
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
      if (isIdDuplicate(newUser.userId)) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }

      const response = await axios.post(BASEURI, newUser);
      if (response.status === 201) {
        state.users.push(response.data);
        if (successCallback) successCallback();
      }
    } catch (err) {
      console.error('회원가입 오류:', err);
    }
  };

  // 4. 로그인 (ID/PW 확인)
  const login = (userId, password) => {
    const foundUser = state.users.find(
      (u) => u.userId === userId && u.password === password,
    );

    if (foundUser) {
      state.currentUser = foundUser;
      return { success: true, user: foundUser };
    } else {
      return {
        success: false,
        message: '아이디 또는 비밀번호가 일치하지 않습니다.',
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
