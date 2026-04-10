<template>
  <div class="toss-wrap">
    <h2 class="toss-title">거래 내역 수정</h2>

    <div v-if="transactionStore.singleTransaction">
      <!-- 수입 / 지출 탭 -->
      <div class="type-tab mb-4">
        <button
          type="button"
          class="tab-btn"
          :class="{
            'tab-income': transactionStore.singleTransaction.type === 'income',
            'tab-inactive':
              transactionStore.singleTransaction.type !== 'income',
          }"
          @click="transactionStore.singleTransaction.type = 'income'"
        >
          수입
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{
            'tab-expenditure':
              transactionStore.singleTransaction.type === 'expenditure',
            'tab-inactive':
              transactionStore.singleTransaction.type !== 'expenditure',
          }"
          @click="transactionStore.singleTransaction.type = 'expenditure'"
        >
          지출
        </button>
      </div>

      <!-- 현재 선택 (기능 유지) -->
      <p class="d-none">
        현재 선택:
        {{
          transactionStore.singleTransaction.type === 'income' ? '수입' : '지출'
        }}
      </p>

      <!-- 금액 -->
      <div id="balance-container" class="toss-field mb-3">
        <label class="toss-label">금액</label>
        <div class="input-group toss-input-group">
          <input
            type="number"
            class="form-control toss-input"
            v-model.number="transactionStore.singleTransaction.balance"
            placeholder="0"
            min="0"
          />
          <span class="input-group-text toss-unit">원</span>
        </div>
      </div>

      <!-- 결제수단 -->
      <div id="method-container" class="toss-field mb-3">
        <label class="toss-label">결제수단</label>
        <select
          class="form-select toss-select"
          v-model="transactionStore.singleTransaction.method"
        >
          <option value="0" disabled>-- 결제수단 선택 --</option>
          <option value="신용">신용카드</option>
          <option value="체크">체크카드</option>
          <option value="현금">현금</option>
        </select>
      </div>

      <!-- 거래명 -->
      <div id="name-container" class="toss-field mb-3">
        <label class="toss-label">거래명</label>
        <input
          type="text"
          class="form-control toss-input"
          v-model="transactionStore.singleTransaction.name"
          placeholder="예: 점심 식사, 월급"
        />
      </div>

      <!-- 카테고리 -->
      <div id="cId-container" class="toss-field mb-3">
        <label class="toss-label">카테고리</label>
        <select
          class="form-select toss-select"
          v-model="transactionStore.singleTransaction.cId"
        >
          <option value="0" disabled>-- 카테고리 선택 --</option>
          <option
            v-for="cat in filteredCategoryList"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
        <div id="action-container">
          <button type="button" class="toss-add-btn" @click="AddCategory">
            + 추가
          </button>
        </div>
      </div>

      <!-- 고정지출 (지출일 때만) -->
      <div
        v-if="transactionStore.singleTransaction.type === 'expenditure'"
        id="static-container"
        class="toss-check-field mb-3"
      >
        <label class="toss-check-label">
          <input
            type="checkbox"
            class="toss-checkbox"
            v-model="transactionStore.singleTransaction.static"
          />
          <span>고정지출</span>
        </label>
      </div>

      <!-- 날짜 -->
      <div class="toss-field mb-3">
        <label class="toss-label">날짜</label>
        <input
          type="date"
          class="form-control toss-input"
          v-model="transactionStore.singleTransaction.date"
        />
      </div>

      <!-- 메모 -->
      <div id="memo-container" class="toss-field mb-5">
        <label class="toss-label">메모</label>
        <input
          type="text"
          class="form-control toss-input"
          v-model="transactionStore.singleTransaction.memo"
          placeholder="메모는 선택사항입니다"
        />
      </div>

      <!-- 수정 버튼 -->
      <div class="submit-container">
        <button
          type="button"
          class="btn-save toss-save-btn"
          :class="
            transactionStore.singleTransaction.type === 'income'
              ? 'save-income'
              : 'save-expenditure'
          "
          @click="handleUpdate"
        >
          수정하기
        </button>
      </div>
      <div class="submit-container">
        <button
          type="button"
          class="btn-save toss-save-btn"
          @click="handleDelete"
        >
          삭제하기
        </button>
      </div>
    </div>

    <div v-else class="toss-loading">
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
    console.log(transactionStore.singleTransaction.type);
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

const handleDelete = async () => {
  const id = route.query.id;
  if (!confirm('정말로 이 내역을 삭제하시겠습니까?')) return;
  try {
    await transactionStore.deleteTransaction(id);
    alert('삭제가 완료되었습니다!');
    router.back();
  } catch (error) {
    console.error(error);
    alert('삭제 중 오류가 발생했습니다.');
  }
};

const AddCategory = () => {
  router.push('/category');
};
</script>

<style scoped>
/* 전체 래퍼 */
.toss-wrap {
  max-width: 480px;
  margin: 0 auto;
  padding: 28px 20px 40px;
  background-color: #f9f9f9;
  min-height: 100vh;
  font-family:
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
}

/* 페이지 타이틀 */
.toss-title {
  font-size: 20px;
  font-weight: 700;
  color: #191919;
  margin-bottom: 24px;
}

/* 수입/지출 탭 */
.type-tab {
  display: flex;
  background-color: #efefef;
  border-radius: 14px;
  padding: 4px;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  border: none;
  border-radius: 11px;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.tab-income {
  background-color: #ffffff;
  color: #1fc7a2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-expenditure {
  background-color: #ffffff;
  color: #f04452;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.tab-inactive {
  background-color: transparent;
  color: #b0b0b0;
  box-shadow: none;
}

/* 필드 공통 */
.toss-field {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.toss-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #888888;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

/* 입력 */
.toss-input {
  border: none !important;
  border-radius: 0 !important;
  padding: 0 !important;
  font-size: 17px;
  font-weight: 600;
  color: #191919;
  background: transparent !important;
  box-shadow: none !important;
  outline: none;
}

.toss-input::placeholder {
  color: #cccccc;
  font-weight: 400;
}

.toss-input-group {
  border: none;
  background: transparent;
}

.toss-unit {
  border: none !important;
  background: transparent !important;
  font-size: 17px;
  font-weight: 600;
  color: #191919;
  padding: 0 !important;
  padding-left: 4px !important;
}

/* 셀렉트 */
.toss-select {
  border: none !important;
  padding: 0 !important;
  font-size: 16px;
  font-weight: 600;
  color: #191919;
  background-color: transparent !important;
  box-shadow: none !important;
  cursor: pointer;
}

.toss-select:focus {
  outline: none;
  box-shadow: none !important;
}

/* 카테고리 추가 버튼 */
.toss-add-btn {
  height: 100%;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background-color: #f2f2f2;
  color: #555555;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.15s;
}

.toss-add-btn:hover {
  background-color: #e6e6e6;
}

/* 고정지출 체크박스 */
.toss-check-field {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 18px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.toss-check-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  color: #191919;
  margin: 0;
}

.toss-checkbox {
  width: 20px;
  height: 20px;
  accent-color: #f04452;
  cursor: pointer;
  border-radius: 6px;
  flex-shrink: 0;
}

/* 하단 버튼 컨테이너 (한 줄 배치) */
.submit-container {
  display: inline-block;
  width: 48%;
}

.submit-container:first-of-type {
  margin-right: 4%;
}

.toss-save-btn {
  width: 100%;
  padding: 17px;
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  transition:
    background-color 0.2s,
    opacity 0.15s,
    transform 0.1s;
}

/* 수입 수정 호버 */
.save-income {
  background-color: #1fc7a2;
}
.save-income:hover {
  background-color: #19a98a;
}

/* 지출 수정 호버 */
.save-expenditure {
  background-color: #f04452;
}
.save-expenditure:hover {
  background-color: #d63b48;
}

/* 삭제 버튼 색상 및 호버 */
.submit-container:last-of-type .toss-save-btn {
  background-color: #b0b0b0;
}
.submit-container:last-of-type .toss-save-btn:hover {
  background-color: #8e8e8e;
}

.toss-save-btn:active {
  opacity: 0.85;
  transform: scale(0.98);
}

/* 로딩 */
.toss-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #aaaaaa;
  font-size: 15px;
}
</style>
