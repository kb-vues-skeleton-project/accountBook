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
  background-color: #f8f9fa; /* 배경색 통일 */
  padding: 20px;
  font-family:
    'Pretendard',
    -apple-system,
    sans-serif;
}

/* 회원가입 카드 박스 */
.signup-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  padding: 40px 30px;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
}

/* 제목 스타일 */
.form-title {
  font-size: 26px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 35px;
  color: #191f28;
  letter-spacing: -0.5px;
}

/* 폼 본문 내부 간격 */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 22px;
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
  color: #4e5968;
  margin-left: 2px;
}

/* 입력창 및 셀렉트 박스 공통 디자인 */
.input-field,
.select-field {
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid #e5e8eb;
  border-radius: 14px;
  font-size: 15px;
  color: #333d4b;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.input-field::placeholder {
  color: #adb5bd;
}

.input-field:focus,
.select-field:focus {
  outline: none;
  border-color: #1a5c9c; /* 테마 컬러 적용 */
  box-shadow: 0 0 0 4px rgba(26, 92, 156, 0.1);
}

/* 아이디 입력창과 중복 확인 버튼 배치 */
.id-input-wrapper {
  display: flex;
  gap: 8px;
}

.id-input-wrapper .input-field {
  flex: 1;
}

/* 중복 확인 버튼 */
.btn-sub {
  padding: 0 18px;
  background-color: #f2f4f6;
  color: #4e5968;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-sub:hover {
  background-color: #e5e8eb;
}

/* 생년월일 셀렉트 그룹 가로 배치 */
.birth-select-group {
  display: flex;
  gap: 8px;
}

.birth-select-group .select-field {
  flex: 1;
  /* 브라우저 기본 화살표 스타일 제거 (선택사항) */
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b95a1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

/* 비밀번호 일치하지 않습니다 메시지 */
.error-msg {
  color: #f04452;
  font-size: 13px;
  font-weight: 500;
  margin-top: 2px;
  padding-left: 2px;
}

/* 하단 회원가입 버튼 */
.btn-main {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 18px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  background-color: #1a5c9c; /* 테마 컬러 적용 */
  cursor: pointer;
  margin-top: 15px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-main:disabled {
  background-color: #e5e8eb;
  color: #adb5bd;
  cursor: not-allowed;
}

.btn-main:not([disabled]):hover {
  background-color: #14497a;
  transform: translateY(-1px);
}

.btn-main:active {
  transform: scale(0.98);
}

/* 반응형 모바일 설정 */
@media (max-width: 480px) {
  .signup-card {
    padding: 30px 20px;
    border-radius: 0;
    box-shadow: none;
    max-width: 100%;
  }

  .signup-page {
    background-color: #ffffff;
    padding: 0;
  }

  .form-title {
    font-size: 22px;
    margin-bottom: 25px;
  }
}
</style>
