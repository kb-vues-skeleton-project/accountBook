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

const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
});

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
</script>

<style scoped>
.item-card {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

/* 왼쪽: 아이콘 영역 */
.category-icon-area {
  flex-shrink: 0;
  margin-right: 15px;
}

.circle-placeholder {
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.circle-placeholder img {
  width: 60%;
  height: 60%;
  object-fit: contain;
}

/* 중간: 텍스트 영역 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.category-name {
  font-size: 13px;
  color: #888;
}

.memo {
  font-size: 12px;
  color: #bbb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

/* 오른쪽: 금액 영역 */
.balance-area {
  flex-shrink: 0;
  text-align: right;
}

.amount {
  font-size: 18px;
  font-weight: 700;
}

.income {
  color: #007bff;
}
.expense {
  color: #ff4d4f;
}
</style>
