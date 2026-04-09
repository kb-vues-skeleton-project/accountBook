<template>
  <div
    class="filter-container"
    style="border: 1px solid #ccc; padding: 15px; border-radius: 10px"
  >
    <div
      class="type-selector"
      style="margin-bottom: 15px; display: flex; gap: 10px"
    >
      <button type="button" id="filter-income">수입</button>
      <button type="button" id="filter-expenditure">지출</button>
      <button type="button" id="filter-all">전체보기</button>
    </div>

    <hr />

    <div class="category-list" style="margin-top: 15px">
      <p style="font-size: 14px; font-weight: bold">카테고리 상세 선택</p>

      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <label
          style="
            border: 1px solid #ddd;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
          "
        >
          <input type="checkbox" name="cate" value="food" /> 식비
        </label>
        <label
          style="
            border: 1px solid #ddd;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
          "
        >
          <input type="checkbox" name="cate" value="transport" /> 교통
        </label>
        <label
          style="
            border: 1px solid #ddd;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
          "
        >
          <input type="checkbox" name="cate" value="shopping" /> 쇼핑
        </label>

        <label
          style="
            border: 1px solid #ddd;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
          "
        >
          <input type="checkbox" name="cate" value="salary" /> 월급
        </label>
        <label
          style="
            border: 1px solid #ddd;
            padding: 5px 10px;
            border-radius: 15px;
            cursor: pointer;
          "
        >
          <input type="checkbox" name="cate" value="bonus" /> 보너스
        </label>
      </div>
    </div>

    <div style="margin-top: 20px; text-align: right">
      <button
        type="button"
        id="btn-apply-filter"
        style="background-color: #333; color: white; padding: 5px 15px"
      >
        필터 적용
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style scoped></style>
