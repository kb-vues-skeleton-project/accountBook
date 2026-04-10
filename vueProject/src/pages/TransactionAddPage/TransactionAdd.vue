<template>
  <div class="toss-wrap">
    <!-- 수입 / 지출 탭 -->
    <div class="type-tab mb-4">
      <button
        type="button"
        class="tab-btn"
        :class="{
          'tab-income': type === 'income',
          'tab-inactive': type !== 'income',
        }"
        @click="type = 'income'"
      >
        수입
      </button>
      <button
        type="button"
        class="tab-btn"
        :class="{
          'tab-expenditure': type === 'expenditure',
          'tab-inactive': type !== 'expenditure',
        }"
        @click="type = 'expenditure'"
      >
        지출
      </button>
    </div>

    <!-- 현재 선택 (기능 유지) -->
    <p class="d-none">현재 선택: {{ type === 'income' ? '수입' : '지출' }}</p>

    <!-- 금액 -->
    <div id="balance-container" class="toss-field mb-3">
      <label class="toss-label">금액</label>
      <div class="input-group toss-input-group">
        <input
          type="number"
          class="form-control toss-input"
          v-model.number="balance"
          placeholder="0"
          min="0"
        />
        <span class="input-group-text toss-unit">원</span>
      </div>
    </div>

    <!-- 결제수단 -->
    <div id="method-container" class="toss-field mb-3">
      <label class="toss-label">결제수단</label>
      <select class="form-select toss-select" v-model="method">
        <option value="0" disabled>-- 결제수단 선택 --</option>
        <option value="신용">신용</option>
        <option value="체크">체크</option>
        <option value="현금">현금</option>
      </select>
    </div>

    <!-- 거래명 -->
    <div id="name-container" class="toss-field mb-3">
      <label class="toss-label">거래명</label>
      <input
        type="text"
        class="form-control toss-input"
        v-model="name"
        placeholder="예: 점심 식사, 월급"
      />
    </div>

    <!-- 카테고리 + 추가 버튼 -->
    <div id="cId-container" class="toss-field mb-3">
      <label class="toss-label">카테고리</label>
      <div class="d-flex gap-2">
        <select class="form-select toss-select" v-model="cId">
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
    </div>

    <!-- 고정지출 (지출일 때만) -->
    <div
      v-if="type === 'expenditure'"
      id="static-container"
      class="toss-check-field mb-3"
    >
      <label class="toss-check-label">
        <input type="checkbox" class="toss-checkbox" v-model="isStatic" />
        <span>고정지출</span>
      </label>
    </div>

    <!-- 날짜 -->
    <div class="toss-field mb-3">
      <label class="toss-label">날짜</label>
      <input type="date" class="form-control toss-input" v-model="date" />
    </div>

    <!-- 자가점검 라디오 -->
    <div class="toss-field mb-3">
      <label class="toss-label">자가점검</label>
      <div class="self-check-group">
        <label
          v-for="opt in selfCheckOptions"
          :key="opt.value"
          :for="'check-' + opt.value"
          class="self-check-card"
          :class="{ 'is-selected': selfCheck === opt.value }"
        >
          <input
            type="radio"
            :id="'check-' + opt.value"
            name="selfCheck"
            :value="opt.value"
            v-model="selfCheck"
            class="self-check-radio"
          />
          <img :src="opt.img" :alt="opt.label" class="self-check-img" />
          <span class="self-check-label-text">{{ opt.label }}</span>
        </label>
      </div>
    </div>

    <!-- 메모 -->
    <div id="memo-container" class="toss-field mb-3">
      <label class="toss-label">메모</label>
      <input
        type="text"
        class="form-control toss-input"
        v-model="memo"
        placeholder="메모는 선택사항입니다"
      />
    </div>

    <!-- 저장 버튼 -->
    <div class="submit-container">
      <button
        type="button"
        class="toss-save-btn"
        :class="type === 'income' ? 'save-income' : 'save-expenditure'"
        @click="saveTransaction"
      >
        저장하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/categoryStore';
import { useDateStore } from '@/stores/dateStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';

const router = useRouter();
const transactionStore = useTransactionStore();
const categoryStore = useCategoryStore();
const dateStore = useDateStore();
const selfCheckOptions = [
  { value: 1, img: '/images/selfcheck/good.png', label: '현명한소비' },
  { value: 2, img: '/images/selfcheck/normal.png', label: '합리적소비' },
  { value: 3, img: '/images/selfcheck/bad.png', label: '반성하자' },
];

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

const type = ref('expenditure');
const balance = ref(0);
const name = ref('');
const cId = ref(1);
const date = ref(dateStore.selectedDate);
const memo = ref('');
const method = ref('');
const isStatic = ref(false);
const selfCheck = ref(1);

const saveTransaction = async () => {
  if (balance.value <= 0) {
    alert('금액을 입력해주세요.');
    return;
  }
  if (!name.value.trim()) {
    alert('거래명을 입력해주세요.');
    return;
  }
  if (!cId.value) {
    alert('카테고리를 선택해주세요.');
    return;
  }
  if (!selfCheck.value) {
    alert('자가점검을 선택해주세요.');
    return;
  }

  const newTransaction = {
    uId: JSON.parse(localStorage.getItem('currentUser')),
    balance: balance.value,
    type: type.value,
    date: date.value,
    name: name.value,
    method: method.value,
    static: isStatic.value,
    cId: Number(cId.value),
    memo: memo.value,
    selfCheck: Number(selfCheck.value),
  };

  try {
    await transactionStore.addTransaction(newTransaction);

    alert('성공적으로 저장되었습니다!');
    router.push('/summary');
  } catch (error) {
    alert('저장 실패! 다시 시도해주세요.');
  }
};

// 페이지를 떠날 때 실행되는 훅
onBeforeRouteLeave((to, from, next) => {
  // 목적지(to)가 카테고리 추가 페이지('/category')가 아니라면 데이터 초기화
  if (to.path !== '/category') {
    resetFields();
  }
  next();
});

// 초기화 함수
const resetFields = () => {
  type.value = 'expenditure';
  balance.value = 0;
  name.value = '';
  cId.value = 1;
  memo.value = '';
  method.value = '';
  isStatic.value = false;
  date.value = dateStore.selectedDate;
  selfCheck.value = 1;
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
  padding: 0 16px;
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

/* 저장 버튼 */
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
    opacity 0.15s,
    transform 0.1s;
}

.toss-save-btn:active {
  opacity: 0.85;
  transform: scale(0.99);
}

.save-income {
  background-color: #1fc7a2;
}

.save-expenditure {
  background-color: #f04452;
}

.self-check-group {
  display: flex;
  gap: 10px;
}

.self-check-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 0;
  border-radius: 12px;
  border: 2px solid #efefef;
  background-color: #f9f9f9;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}

.self-check-card.is-selected {
  border-color: #f04452;
  background-color: #fff5f6;
}

.self-check-radio {
  display: none;
}

.self-check-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.self-check-label-text {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.self-check-card.is-selected .self-check-label-text {
  color: #f04452;
}
</style>
