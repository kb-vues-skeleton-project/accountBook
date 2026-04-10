import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/pages/HomePage/Home.vue';
import Join from '@/pages/HomePage/Join.vue';
import LogIn from '@/pages/HomePage/LogIn.vue';
import Summary from '@/pages/SummaryPage/Summary.vue';
import DailyDetail from '@/pages/SummaryPage/DailyDetail.vue';
import Trade from '@/pages/TradeListPage/Trade.vue';
import Report from '@/pages/ReportPage/Report.vue';
import CategoryAdd from '@/pages/CategoryAddPage/CategoryAdd.vue';
import TransactionAdd from '@/pages/TransactionAddPage/TransactionAdd.vue';
import TransactionEdit from '@/pages/TransactionEditPage/TransactionEdit.vue';
import NotFound from '@/pages/NotFoundPage/NotFound.vue';
import GoalEdit from '@/pages/SummaryPage/GoalEdit.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: LogIn,
    },
    {
      path: '/join',
      name: 'join',
      component: Join,
    },
    {
      path: '/summary',
      name: 'summary',
      component: Summary,
      children: [
        // goal을 위로 올려야 정상 작동?? goal은 문자열, :date는 변수이므로?
        {
          path: 'goal',
          name: 'summary/goal',
          component: GoalEdit,
        },
        {
          path: ':date',
          name: 'summary/date',
          component: DailyDetail,
        },
      ],
    },
    {
      path: '/trade',
      name: 'trade',
      component: Trade,
    },
    {
      path: '/report',
      name: 'report',
      component: Report,
    },
    {
      path: '/category',
      name: 'category',
      component: CategoryAdd,
    },
    {
      path: '/transactionAdd',
      name: 'transactionAdd',
      component: TransactionAdd,
    },
    {
      path: '/transactionEdit',
      name: 'transactionEdit',
      component: TransactionEdit,
    },
    { path: '/:paths(.*)*', name: 'NotFound', component: NotFound },
  ],
});

export default router;
