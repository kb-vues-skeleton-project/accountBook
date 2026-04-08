<template>
  <div>
    <button type="button" @click="type = 'income'">수입</button>
    <button type="button" @click="type = 'expenditure'">지출</button>
    <p>현재 선택: {{ type === 'income' ? '수입' : '지출' }}</p>
  </div>

  <div id="amount-container">
    <label>금액</label>
    <input type="number" v-model.number="amount" placeholder="0" min="0" />
    <span>원</span>
  </div>

  <div id="description-container">
    <label>거래명</label>
    <input
      type="text"
      v-model="description"
      placeholder="예: 점심 식사, 월급"
    />
  </div>

  <div id="category-container">
    <label>카테고리</label>
    <!-- 상단 수입 지출 선택에 따라 카테고리도 다르게 나오도록 해야할거같음 -->
    <select v-model="category">
      <option value="">-- 카테고리 --</option>
      <option value="food">식비</option>
      <option value="transport">교통</option>
      <option value="culture">문화생활</option>
      <option value="salary">월급 (수입)</option>
      <option value="etc">미분류</option>
    </select>
  </div>

  <div id="action-container">
    <button type="button" @click="AddCategory">추가</button>
  </div>

  <div>
    <label>날짜</label>
    <input type="date" v-model="date" />
  </div>

  <div id="memo-container">
    <label for="memo">메모</label>
    <input type="text" v-model="memo" placeholder="메모는 선택사항입니다" />
  </div>

  <div class="submit-container">
    <button type="button" class="btn-save" @click="saveTransaction">
      저장하기
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const AddCategory = () => {
  router.push('/category');
};

const type = ref('expenditure');
const amount = ref(0);
const description = ref('');
const category = ref('');
const date = ref(new Date().toISOString().substr(0, 10));
const memo = ref('');

const saveTransaction = () => {
  if (amount.value <= 0) {
    alert('금액을 입력해주세요.');
    return;
  }
  if (!description.value.trim()) {
    alert('거래명을 입력해주세요.');
    return;
  }
  if (!category.value) {
    alert('카테고리를 선택해주세요.');
    return;
  }

  const newTransaction = {
    type: type.value,
    amount: amount.value,
    description: description.value,
    category: category.value,
    date: date.value,
    memo: memo.value,
    createdAt: new Date().getTime(),
  };
  console.log('서버로 보낼 데이터:', newTransaction);
  alert('저장되었습니다!');
  router.push('/summary');
};
</script>

<style scoped></style>
