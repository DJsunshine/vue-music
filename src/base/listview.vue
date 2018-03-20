<template>
<scroll class="listview" :data="data">
		<ul>
			<li v-for="group in data" class="list-group">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item">
						<img class="avatar" v-lazy="item.avatar" alt="" />
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
	 	<div v-show="!data.length" class="loading-container">
     		 <loading></loading>
   		</div>
	</scroll>

</template>

<script>	
	import Scroll from './scroll.vue'
	import Loading from './loading'
	export default{
		props:{
			data:{
				type:Array,
				default:[]
			}
		},
		components:{
			Scroll,
			Loading
		}
		
	}
</script>

<style scoped="scoped">
	.listview{
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #222;
	}
	.list-group{
		padding-bottom: 30px;
		
	}
	.list-group-title{
		height: 30px;
		line-height: 30px;
		padding-left: 20px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.5);
		background: #333;
	}
	.list-group-item{
		display: flex;
		align-items: center;
		padding: 20px 0 0 30px;
	}
	.avatar{
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	.name{
		margin-left: 20px;
		color: rgba(255, 255, 255, 0.5);
		font-size: 14px;
	}
	.list-shortcut{
		position: absolute;
		z-index: 30;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 20px;
		padding: 20px 0;
		border-radius: 10px;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
		font-family: helvetica;
	}
  	.item{
  		padding: 3px;
  		line-height: 1;
  		color: rgba(255, 255, 255, 0.5);
		font-size: 14px;
  	}
  	.current{
  		color: #ffcd32;
  	}
  	.list-fixed{
  		position: absolute;
  		top: 0;
  		left: 0;
  		width: 100%;
  	}
  	.fixed-title{
  		height: 30px;
  		line-height: 30px;
  		padding-left: 20px;
  		font-size: 14px;
  		color: rgba(255, 255, 255, 0.5);
  		background: #333;
  	}
  	.loading-container{
  		position: absolute;
  		width: 100%;
  		top: 50%;
  		transform: translateY(-50%);
  	}
</style>