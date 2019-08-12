<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
    <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
	import MHeader from './components/m-header'
	import Tab from './components/tabl'
	import Player from './components/player'
		//设置html的font-size
(function(window){
		var winW = document.documentElement.clientWidth || document.body.clientWidth;
		document.documentElement.style.fontSize = winW / 10 + "px";
		window.onresize = function(){
			var winW = document.documentElement.clientWidth || document.body.clientWidth;
			document.documentElement.style.fontSize = winW / 10 + "px";
		}
  })(window)
export default {
  name: 'App',
  data(){
  	return {
  		
  	}
  },
  components:{
  	MHeader,
  	Tab,
  	Player
  }
}
</script>

<style>
@import url("../static/css/reset.css");

</style>
