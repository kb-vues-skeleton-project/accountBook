<template>
  <div class="item-card">
    <div class="category-icon-area">
      <div class="circle-placeholder">
        <img
          v-if="categoryIcon"
          :src="`/images/category/${categoryIcon}`"
          :alt="categoryName"
        />
      </div>
    </div>

    <div class="content-area">
      <div class="name">{{ transaction.name }}</div>
      <div class="category-name">{{ categoryName }}</div>
      <div class="memo">{{ transaction.memo || '메모가 없습니다' }}</div>
    </div>

    <div class="balance-area">
      <button class="edit-icon-btn" @click.stop="goToEdit">
        <i class="bi bi-pencil-fill">✏️</i>
      </button>
      <span
        :class="[
          'amount',
          transaction.type === 'income' ? 'income' : 'expense',
        ]"
      >
        {{ transaction.type === 'income' ? '+' : '-' }}
        {{ Number(transaction.balance).toLocaleString() }}원
      </span>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useRouter } from 'vue-router';

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const categoryStore = useCategoryStore();

const categoryIcon = computed(() => {
  if (categoryStore.state.categories.length === 0) return null;

  const matchedCategory = categoryStore.state.categories.find(
    (c) => Number(c.id) === Number(props.transaction.cId),
  );
  return matchedCategory ? matchedCategory.image : 'etc.png';
});

const categoryName = computed(() => {
  const foundCategory = categoryStore.state.categories.find(
    (c) => Number(c.id) === Number(props.transaction.cId),
  );
  return foundCategory ? foundCategory.name : '미지정';
});
const goToEdit = () => {
  router.push({
    path: '/transactionEdit',
    query: { id: props.transaction.id }, // id 전달
  });
};
</script>

<
<style scoped>
.item-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  /* 데스크톱에서 보기 편하도록 패딩과 높이 상향 */
  padding: 20px 28px;
  border-radius: 18px;
  /* 테마 컬러를 활용한 아주 은은한 그림자 */
  box-shadow: 0 4px 12px rgba(26, 92, 156, 0.06);
  border: 1px solid #f1f3f5;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
}

.item-card:hover {
  border-color: #1a5c9c;
  background-color: #f9fbff;
}

/* 아이콘 영역 */
.category-icon-area {
  flex-shrink: 0;
  margin-right: 20px;
}

.circle-placeholder {
  width: 56px;
  height: 56px;
  background-color: #f0f4f8; /* 테마 컬러 톤의 연한 배경 */
  border-radius: 16px; /* 완전 원형보다 트렌디한 스쿼클 형태 */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.circle-placeholder img {
  width: 65%;
  height: 65%;
  object-fit: contain;
}

/* 텍스트 영역 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name {
  font-size: 18px; /* 폰트 크기 키움 */
  font-weight: 700;
  color: #191f28;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #8b95a1;
}

.memo {
  font-size: 13px;
  color: #adb5bd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* 금액 및 편집 영역 */
.balance-area {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

/* 편집 아이콘 */
.edit-icon-btn {
  background: none;
  border: none;
  color: #adb5bd;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
  transition: color 0.2s;
}

.edit-icon-btn:hover {
  color: #1a5c9c; /* 테마 컬러로 피드백 */
}

.amount {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

/* 수입/지출 컬러 명확화 */
.income {
  color: #1a5c9c; /* 수입을 메인 테마 컬러로 강조 */
}

.expense {
  color: #f04452; /* 지출은 명확한 레드 톤 */
}

/* 반응형 */
@media (max-width: 768px) {
  .memo {
    max-width: 150px;
  }
  .item-card {
    padding: 16px 20px;
  }
  .name {
    font-size: 16px;
  }
  .amount {
    font-size: 18px;
  }
}
</style>
