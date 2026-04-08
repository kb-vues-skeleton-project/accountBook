<template>
  <div class="category-manage">
    <div class="add-card">
      <div class="input-group">
        <input v-model="newCat.name" placeholder="카테고리명" />
        <select v-model="newCat.type">
          <option value="expenditure">지출</option>
          <option value="income">수입</option>
        </select>
        <button class="save-btn" @click="handleSave">등록</button>

        <button @click="router.back">취소</button>
      </div>

      <div class="icon-selector">
        <p>아이콘 선택</p>
        <div class="icon-grid">
          <div
            v-for="img in iconList"
            :key="img"
            class="icon-item"
            :class="{ selected: newCat.image === img }"
            @click="newCat.image = img"
          >
            <img :src="`/images/category/${img}`" alt="icon" />
          </div>
        </div>
      </div>
    </div>

    <hr />

    <div class="category-grid">
      <div
        v-for="cat in categoryStore.state.categories"
        :key="cat.id"
        class="cat-card"
      >
        <div class="cat-img-wrapper">
          <img :src="`/images/category/${cat.image}`" :alt="cat.name" />
        </div>
        <div class="cat-info">
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-type" :class="cat.type">{{
            cat.type === 'income' ? '수입' : '지출'
          }}</span>
        </div>
        <button class="del-btn" @click="deleteCat(cat.id)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const categoryStore = useCategoryStore();
const iconList = categoryStore.iconList;

const newCat = reactive({
  name: '',
  type: 'expenditure',
  image: 'etc.png',
}); // 기본값

onMounted(() => {
  categoryStore.fetchCategories();
}); // 카테고리 목록 불러오기

// 카테고리 추가
const handleSave = () => {
  if (!newCat.name) return alert('이름을 입력해주세요!');
  categoryStore.addCategory({ ...newCat });
  newCat.name = '';
  newCat.image = 'etc.png';
};

// 카테고리 삭제
const deleteCat = (id) => {
  categoryStore.deleteCategory(id);
};
</script>

<style scoped>
.add-card {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 20px;
}
.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
.input-group input,
.input-group select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ddd;
}
.save-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0 15px;
  border-radius: 5px;
  cursor: pointer;
}

.icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}
.icon-item {
  width: 45px;
  height: 45px;
  padding: 5px;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.2s;
}
.icon-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.icon-item.selected {
  border-color: #4caf50;
  background: #e8f5e9;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
}
.cat-card {
  position: relative;
  background: white;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.cat-img-wrapper {
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
  background: #f0f0f0;
  border-radius: 50%;
  padding: 10px;
}
.cat-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cat-name {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
.cat-type {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
}
.cat-type.expenditure {
  background: #ffebee;
  color: #ef5350;
}
.cat-type.income {
  background: #e8f5e9;
  color: #4caf50;
}
.del-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 18px;
}
.del-btn:hover {
  color: #ff5252;
}
</style>
