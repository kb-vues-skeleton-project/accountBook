<template>
  <div class="edit-container">
    <h2>거래 내역 수정</h2>

    <div v-if="transactionStore.singleTransaction">
      <div>
        <button
          type="button"
          @click="transactionStore.singleTransaction.type = 'income'"
        >
          수입
        </button>
        <button
          type="button"
          @click="transactionStore.singleTransaction.type = 'expenditure'"
        >
          지출
        </button>
        <p>
          현재 선택:
          {{
            transactionStore.singleTransaction.type === 'income'
              ? '수입'
              : '지출'
          }}
        </p>
      </div>

      <div id="balance-container">
        <label>금액</label>
        <input
          type="number"
          v-model.number="transactionStore.singleTransaction.balance"
          placeholder="0"
          min="0"
        />
        <span>원</span>
      </div>

      <div id="method-container">
        <label>결제수단</label>
        <select v-model="transactionStore.singleTransaction.method">
          <option value="0" disabled>-- 결제수단 선택 --</option>
          <option value="신용">신용</option>
          <option value="체크">체크</option>
          <option value="현금">현금</option>
        </select>
      </div>

      <div id="name-container">
        <label>거래명</label>
        <input
          type="text"
          v-model="transactionStore.singleTransaction.name"
          placeholder="예: 점심 식사, 월급"
        />
      </div>

      <div id="categoryId-container">
        <label>카테고리</label>
        <select v-model="transactionStore.singleTransaction.categoryId">
          <option value="0" disabled>-- 카테고리 선택 --</option>
          <option
            v-for="cat in filteredCategoryList"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <div
        v-if="transactionStore.singleTransaction.type === 'expenditure'"
        id="static-container"
      >
        <label>
          <input
            type="checkbox"
            v-model="transactionStore.singleTransaction.static"
          />
          고정지출
        </label>
      </div>

      <div>
        <label>날짜</label>
        <input type="date" v-model="transactionStore.singleTransaction.date" />
      </div>

      <div id="memo-container">
        <label
          >메모
          <input
            type="text"
            v-model="transactionStore.singleTransaction.memo"
            placeholder="메모는 선택사항입니다"
          />
        </label>
      </div>

      <div class="submit-container">
        <button type="button" class="btn-save" @click="handleUpdate">
          수정하기
        </button>
      </div>
    </div>

    <div v-else>
      <p>데이터를 불러오는 중입니다...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';

const route = useRoute();
const router = useRouter();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();

onMounted(async () => {
  const id = route.query.id;
  categoryStore.fetchCategories();
  if (id) {
    await transactionStore.idFetch(id);
  }
});

// 카테고리 필터링
const filteredCategoryList = computed(() => {
  if (!transactionStore.singleTransaction) return [];
  const currentType = transactionStore.singleTransaction.type;
  return categoryStore.state.categories.filter(
    (cat) => cat.type === currentType || cat.type === 'default',
  );
});

const handleUpdate = async () => {
  const id = route.query.id;

  if (!transactionStore.singleTransaction.name) {
    alert('거래명을 입력해주세요.');
    return;
  }
  if (transactionStore.singleTransaction.balance <= 0) {
    alert('금액을 확인해주세요.');
    return;
  }

  try {
    await transactionStore.updateTransaction(
      id,
      transactionStore.singleTransaction,
    );

    alert('수정이 완료되었습니다!');
    router.back();
  } catch (error) {
    console.error(error);
    alert('수정 중 오류가 발생했습니다.');
  }
};
</script>
