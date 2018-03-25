import Vue from 'vue'
import Router from 'vue-router'

import Recommend from '../components/recommend'
import Singer from '../components/singer'
import Search from '../components/search'
import Rank from '../components/rank'

import SingerDetail from '../components/singer_detail'
import RecList from '../components/rec-list'
import TopList from '../components/top-list'
Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path:'/',
  		redirect:'/recommend'
  	},
    {
      path:'/recommend',
      component:Recommend,
      children:[
      {
      	path:':id',
      	component:RecList
      }
      ]
    },
    {
      path:'/singer',
      component:Singer,
      children:[
      	{
      		path:':id',
      		component:SingerDetail
      	}
      ]
    },
    {
      path:'/search',
      component:Search
    },
    {
      path:'/rank',
      component:Rank,
      children:[
      {
      	path:':id',
      	component:TopList
      }
      ]
    },
  ]
})
