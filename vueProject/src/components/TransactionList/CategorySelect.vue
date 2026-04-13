<template>
  <div class="filter-container">
    <div class="type-selector">
      <button
        v-for="t in [
          { lab: '전체', val: 'all' },
          { lab: '수입', val: 'income' },
          { lab: '지출', val: 'expenditure' },
        ]"
        :key="t.val"
        :class="['filter-btn', { active: selectedType === t.val }]"
        @click="selectType(t.val)"
      >
        {{ t.lab }}
      </button>
    </div>

    <hr class="divider" />

    <div class="category-list">
      <p class="section-title">카테고리 상세 선택</p>
      <div class="category-grid">
        <label
          v-for="cat in filteredCategories"
          :key="cat.id"
          :class="[
            'category-chip',
            { checked: selectedCategoryIds.includes(Number(cat.id)) },
          ]"
        >
          <input
            type="checkbox"
            :value="Number(cat.id)"
            v-model="selectedCategoryIds"
            hidden
          />
          {{ cat.name }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';

const emit = defineEmits(['filter']);
const categoryStore = useCategoryStore();

const selectedType = ref('all');
const selectedCategoryIds = ref([]);

const filteredCategories = computed(() => {
  if (selectedType.value === 'all') return categoryStore.state.categories;
  return categoryStore.state.categories.filter((c) => {
    return c.type === selectedType.value || c.type === 'default';
  });
});

const selectType = (type) => {
  selectedType.value = type;
  selectedCategoryIds.value = []; // 타입 변경 시 체크박스 초기화
  emitFilter();
};

watch(
  selectedCategoryIds,
  () => {
    emitFilter();
  },
  { deep: true },
);

const emitFilter = () => {
  emit('filter', {
    // all이면 null을 보내서 전체 조회하게 함
    type: selectedType.value === 'all' ? null : selectedType.value,
    cIds: selectedCategoryIds.value.map((id) => String(id)),
  });
};
</script>

<style scoped>
.filter-container {
  background: white;
  padding: 25px;
  border-radius: 20px;
  border: 1px solid #f1f3f5;
  margin-bottom: 30px;
}
.type-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filter-btn {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #eee;
  background: white;
  cursor: pointer;
  font-weight: 600;
}
.filter-btn.active {
  background: #1a5c9c;
  color: white;
  border-color: #1a5c9c;
}
.divider {
  border: 0;
  border-top: 1px solid #eee;
  margin-bottom: 20px;
}
.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.category-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
}
.category-chip.checked {
  background: #eef4f9;
  color: #1a5c9c;
  border-color: #1a5c9c;
  font-weight: 700;
}
</style>
