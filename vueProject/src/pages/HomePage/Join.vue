<template>
  <div class="signup-page">
    <div class="signup-card">
      <h2 class="form-title">회원가입</h2>

      <div class="form-body">
        <div class="input-row id-row">
          <label class="input-label">아이디</label>
          <div class="id-input-wrapper">
            <input
              type="text"
              v-model="userData.uId"
              @keyup.enter="checkId"
              class="input-field"
              placeholder="ID 입력"
            />
            <button @click="checkId" class="btn-sub">중복 확인</button>
          </div>
        </div>

        <div class="input-row">
          <label class="input-label">비밀번호</label>
          <input
            type="password"
            v-model="userData.password"
            class="input-field"
            placeholder="Password"
          />
        </div>

        <div class="input-row">
          <label class="input-label">비밀번호 확인</label>
          <input
            type="password"
            v-model="passwordConfirm"
            class="input-field"
            placeholder="Password Confirm"
          />
          <div
            v-if="passwordConfirm && userData.password !== passwordConfirm"
            class="error-msg"
          >
            비밀번호가 일치하지 않습니다.
          </div>
        </div>

        <div class="input-row">
          <label class="input-label">이름</label>
          <input
            type="text"
            v-model="userData.name"
            class="input-field"
            placeholder="Name"
          />
        </div>

        <div class="input-row">
          <label class="input-label">전화번호</label>
          <input
            type="text"
            v-model="userData.phoneNum"
            class="input-field"
            placeholder="Phone Number"
          />
        </div>

        <div class="input-row birth-row">
          <label class="input-label">생년월일</label>
          <div class="birth-select-group">
            <select v-model="birth.year" class="select-field">
              <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
            </select>
            <select v-model="birth.month" class="select-field">
              <option
                v-for="m in 12"
                :key="m"
                :value="String(m).padStart(2, '0')"
              >
                {{ m }}월
              </option>
            </select>
            <select v-model="birth.day" class="select-field">
              <option
                v-for="d in daysInMonth"
                :key="d"
                :value="String(d).padStart(2, '0')"
              >
                {{ d }}일
              </option>
            </select>
          </div>
        </div>

        <button :disabled="!isFormValid" @click="handleSignUp" class="btn-main">
          회원가입
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useDateStore } from '@/stores/dateStore';
import { useRouter } from 'vue-router';

const router = useRouter(); // 경로 이동용
const userStore = useUserStore(); // 사용자 정보 관리
const dateStore = useDateStore(); // 날짜 형식 관리

const passwordConfirm = ref(''); // 비번 확인
const isIdChecked = ref(false); // 중복확인

const userData = reactive({
  id: userStore.state.length,
  uId: '',
  password: '',
  name: '',
  phoneNum: '',
  birthday: '',
});

const birth = reactive({
  year: '2000',
  month: '01',
  day: '01',
});

// 여기부터
const daysInMonth = computed(() => {
  const lastDay = new Date(
    Number(birth.year),
    Number(birth.month),
    0,
  ).getDate();
  return lastDay;
});

watch(
  () => birth.month,
  () => {
    if (Number(birth.day) > daysInMonth.value) {
      birth.day = String(daysInMonth.value).padStart(2, '0');
    }
  },
);
// 여기까지 날짜 지정용 (AI 사용)

const years = Array.from({ length: 200 }, (_, i) => String(1900 + i));

// 중복확인
const checkId = async () => {
  // 비동기 처리를 위해 async 추가
  await userStore.fetchUsers(); //서버에서 최신 유저 리스트를 가져올 때까지 기다림
  console.log(userStore.state.users);

  if (userStore.isIdDuplicate(userData.uId)) {
    alert('중복된 아이디입니다.');
    isIdChecked.value = false;
  } else {
    alert('사용 가능한 아이디입니다.');
    isIdChecked.value = true;
  }
};

// 제출 가능 여부
const isFormValid = computed(() => {
  return (
    isIdChecked.value &&
    userData.password === passwordConfirm.value &&
    userData.name.trim() !== ''
  );
});

// 회원가입 제출
const handleSignUp = () => {
  const year = birth.year.slice(-2);
  const newDate = `${year}-${birth.month}-${birth.day}`;

  // 생일 값 수정
  userData.birthday = newDate;
  dateStore.setDate(newDate);

  userStore.signUp({ ...userData }, () => {
    alert('회원가입이 완료되었습니다!');
    router.push({ name: 'home' });
  });
};
</script>

<style scoped>
/* 전체 페이지 배경 및 중앙 정렬 */
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
  padding: 20px;
  font-family:
    'Pretendard',
    -apple-system,
    sans-serif;
}

/* 회원가입 카드 박스 */
.signup-card {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* 제목 스타일 */
.form-title {
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

/* 폼 본문 내부 간격 */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 각 입력 항목 줄(Wrapper) */
.input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 라벨 스타일 */
.input-label {
  font-size: 14px;
  font-weight: 700;
  color: #555;
  margin-left: 4px;
}

/* 입력창 및 셀렉트 박스 공통 디자인 */
.input-field,
.select-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 15px;
  background-color: #fafafa;
  transition: all 0.2s;
}

.input-field:focus,
.select-field:focus {
  outline: none;
  border-color: #007bff;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

/* 아이디 입력창과 중복 확인 버튼 배치 */
.id-input-wrapper {
  display: flex;
  gap: 10px;
}

.id-input-wrapper .input-field {
  flex: 1;
}

/* 중복 확인 버튼 */
.btn-sub {
  padding: 0 15px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.btn-sub:hover {
  opacity: 0.9;
}

/* 생년월일 셀렉트 그룹 가로 배치 */
.birth-select-group {
  display: flex;
  gap: 8px;
}

.birth-select-group .select-field {
  flex: 1;
}

/* 비밀번호 일치하지 않습니다 메시지 */
.error-msg {
  color: #ff4d4f;
  font-size: 12px;
  font-weight: 500;
  margin-top: -6px;
  padding-left: 4px;
}

/* 하단 회원가입 버튼 */
.btn-main {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 15px;
  font-size: 17px;
  font-weight: 800;
  color: white;
  background-color: #007bff;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.2s;
}

.btn-main:disabled {
  background-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
}

.btn-main:not([disabled]):hover {
  background-color: #0056b3;
}
</style>
