import Vue from 'vue'
import Router from 'vue-router'
import store from '../../store'
Vue.use(Router)
const routerMap = [
	{
		path: '*',
		redirect: '/welcome'
	},
	{
		path: '/',
		redirect: '/welcome'
	},
	{
		path: '/welcome',
		name: 'welcome-page',
		component: require('@/components/welcomePage').default
	},
	{
		path: '/landing',
		name: 'landing-page',
		component: () => import('@/components/LandingPage')
	},
	{
		path: '/set',
		name: 'set-page',
		component: () => import('@/components/ConfigSetPage')
	},
	{
		path: '/lists',
		name: 'lists-page',
		component: () => import('@/components/ListsPage')
	}
]
const router = new Router({
	routes: routerMap
});

router.beforeEach((to, from, next) => {
	
	// 自动回滚顶部
	window.scrollTo(0, 0);
	if (to.name == 'welcome-page' ) {
		store.commit('setLogStatus', 0)
	}else{
		store.commit('setLogStatus', 1)
	}
	next();
  
});
export default router;
