<template>
  <div>
    <div>
      아이디
      <input type="text" v-model="userData.userId" @keyup.enter="checkId" />
      <button @click="checkId">중복 확인</button>
    </div>
    <div>비밀번호 <input type="password" v-model="userData.password" /></div>
    <div>비밀번호 확인 <input type="password" v-model="passwordConfirm" /></div>

    <div
      v-if="passwordConfirm && userData.password !== passwordConfirm"
      style="color: red; font-size: 12px"
    >
      비밀번호가 일치하지 않습니다.
    </div>

    <div>이름 <input type="text" v-model="userData.name" /></div>
    <div>전화번호 <input type="text" v-model="userData.phoneNum" /></div>

    <div>
      생년월일
      <select v-model="birth.year">
        <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
      </select>
      <select v-model="birth.month">
        <option v-for="m in 12" :key="m" :value="String(m).padStart(2, '0')">
          {{ m }}월
        </option>
      </select>
      <select v-model="birth.day">
        <option
          v-for="d in daysInMonth"
          :key="d"
          :value="String(d).padStart(2, '0')"
        >
          {{ d }}일
        </option>
      </select>
    </div>

    <button :disabled="!isFormValid" @click="handleSignUp">회원가입</button>
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
  userId: '',
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
const checkId = () => {
  userStore.fetchUsers();
  if (userStore.isIdDuplicate(userData.userId)) {
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
