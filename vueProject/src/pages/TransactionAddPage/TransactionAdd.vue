<template>
  <div>
    <button type="button" @click="type = 'income'">수입</button>
    <button type="button" @click="type = 'expenditure'">지출</button>
    <p>현재 선택: {{ type === 'income' ? '수입' : '지출' }}</p>
  </div>

  <div id="balance-container">
    <label>금액</label>
    <input type="number" v-model.number="balance" placeholder="0" min="0" />
    <span>원</span>
  </div>

  <div id="method-container">
    <label>결제수단</label>
    <select v-model="method">
      <option value="0" disabled>-- 결제수단 선택 --</option>
      <option value="1">신용</option>
      <option value="2">체크</option>
      <option value="3">현금</option>
    </select>
  </div>

  <div id="name-container">
    <label>거래명</label>
    <input type="text" v-model="name" placeholder="예: 점심 식사, 월급" />
  </div>

  <div id="categoryId-container">
    <label>카테고리</label>
    <select v-model="categoryId">
      <option value="0" disabled>-- 카테고리 선택 --</option>
      <option v-for="cat in filteredCategoryList" :key="cat.id" :value="cat.id">
        {{ cat.name }}
      </option>
    </select>
  </div>

  <div id="action-container">
    <button type="button" @click="AddCategory">추가</button>
  </div>

  <div v-if="type === 'expenditure'" id="static-container">
    <label>
      <input type="checkbox" v-model="isStatic" />
      고정지출
    </label>
  </div>

  <div>
    <label>날짜</label>
    <input type="date" v-model="date" />
  </div>

  <div id="memo-container">
    <label
      >메모
      <input type="text" v-model="memo" placeholder="메모는 선택사항입니다" />
    </label>
  </div>

  <div class="submit-container">
    <button type="button" class="btn-save" @click="saveTransaction">
      저장하기
    </button>
  </div>

  <div class="close-container">
    <button type="button" class="btn-close" @click="CloseTransaction"></button>
  </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/categoryStore';
import { useDateStore } from '@/stores/dateStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const dateStore = useDateStore();

// 페이지 로드 시 카테고리 가져오기
onMounted(() => {
  categoryStore.fetchCategories();
});

const filteredCategoryList = computed(() => {
  return categoryStore.state.categories.filter(
    (cat) => cat.type === type.value || cat.type === 'default',
  );
});
////////////////////

const AddCategory = () => {
  router.push('/category');
};

const CloseTransaction = () => {
  router.push('/summary');
};

const type = ref('expenditure');
const balance = ref(0);
const name = ref('');
const categoryId = ref(1);
const date = ref(dateStore.selectedDate);
const memo = ref('');
const method = ref(1);
const isStatic = ref(false);

const saveTransaction = async () => {
  if (balance.value <= 0) {
    alert('금액을 입력해주세요.');
    return;
  }
  if (!name.value.trim()) {
    alert('거래명을 입력해주세요.');
    return;
  }
  if (!categoryId.value) {
    alert('카테고리를 선택해주세요.');
    return;
  }

  const newTransaction = {
    userId: JSON.parse(localStorage.getItem('currentUser')),
    balance: balance.value,
    type: type.value,
    date: date.value,
    name: name.value,
    method: Number(method.value),
    static: isStatic.value,
    categoryId: Number(categoryId.value),
    memo: memo.value,
  };

  try {
    await transactionStore.addTransaction(newTransaction);

    alert('성공적으로 저장되었습니다!');
    router.push('/summary');
  } catch (error) {
    alert('저장 실패! 다시 시도해주세요.');
  }
};
</script>

<style scoped></style>
