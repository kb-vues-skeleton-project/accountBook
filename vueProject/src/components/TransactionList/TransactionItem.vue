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
      <div class="memo">{{ transaction.memo || '메모가없습니다' }}</div>
    </div>

    <div class="balance-area">
      <span>
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
    (c) => Number(c.id) === Number(props.transaction.categoryId),
  );
  return matchedCategory ? matchedCategory.image : 'etc.png';
});

const categoryName = computed(() => {
  const foundCategory = categoryStore.state.categories.find(
    (c) => Number(c.id) === Number(props.transaction.categoryId),
  );
  return foundCategory ? foundCategory.name : '미지정';
});
</script>

<style scoped></style>
