import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
	{
		path: '*',
		redirect: '/lists'
	},
    {
      	path: '/landing',
      	name: 'landing-page',
      	component: require('@/components/LandingPage').default
    },
	{
		path: '/set',
		name: 'set-page',
		component: require('@/components/ConfigSetPage').default
	},
	{
		path: '/lists',
		name: 'lists-page',
		component: require('@/components/ListsPage').default
	}
  ]
})
