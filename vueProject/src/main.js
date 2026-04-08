// import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

// 캘린더라이브러리 로드 + 스타일 로드
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});

app.mount('#app');
