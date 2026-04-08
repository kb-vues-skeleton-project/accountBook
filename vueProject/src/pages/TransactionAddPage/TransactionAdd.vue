<template>
  <div>
    <button type="button" id="btn-income">수입</button>
    <button type="button" id="btn-expenditure">지출</button>
  </div>

  <div id="amount-container">
    <label>금액</label>
    <input type="number" id="balance" name="balance" placeholder="0" min="0" />
    <span>원</span>
  </div>

  <div id="description-container">
    <label>거래명</label>
    <input
      type="text"
      id="description"
      name="description"
      placeholder="예: 점심 식사, 월급"
    />
  </div>

  <div id="category-container">
    <label>카테고리</label>
    <!-- 상단 수입 지출 선택에 따라 카테고리도 다르게 나오도록 해야할거같음 -->
    <select id="category" name="category">
      <option value="">-- 카테고리 --</option>
      <option value="food">식비</option>
      <option value="transport">교통</option>
      <option value="culture">문화생활</option>
      <option value="salary">월급 (수입)</option>
      <option value="etc">미분류</option>
    </select>
  </div>

  <div id="action-container">
    <button type="button" id="btn-add">추가</button>
  </div>

  <div>
    <label>날짜</label>
    <input type="date" id="transaction-date" />
  </div>

  <div id="memo-container">
    <label for="memo">메모</label>
    <input
      type="text"
      id="memo"
      name="memo"
      placeholder="메모는 선택사항입니다"
    />
  </div>
</template>

<script setup></script>

<style scoped></style>
