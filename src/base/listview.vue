<template>
<scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li @click="selectItem(item)" v-for="(item,index) in group.items" class="list-group-item">
						<img class="avatar" v-lazy="item.avatar" alt="" />
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
			<ul>
				<li v-for="(item,index) in shortcutList" class="item"  :data-index="index">
					{{item}}
				</li>
			</ul>
		</div>
	 	<div v-show="!data.length" class="loading-container">
     		 <loading></loading>
   		</div>
	</scroll>

</template>

<script>	
	import Scroll from './scroll.vue'
	import Loading from './loading'
	const HEIGHT=18
	export default{
		created(){
			this.touch={},
			this.listenScroll=true
		},
		props:{
			data:{
				type:Array,
				default:[]
			}
		},
		data(){
			return {
			scrollY:-1,
			currentIndex:0
				
			}

		},
		computed:{
			shortcutList(){
				return this.data.map((group)=>{
				//因为存的是热门 所以此处截取
					return group.title.substr(0,1)
				})
			}
		},
		methods:{
			selectItem(item){
				this.$emit("select",item)
			},
				//鼠标点击
			onShortcutTouchStart(e){
				//获取点击右侧栏目的下标index
				let anchorIndex=e.target.getAttribute('data-index');
//				console.log(anchorIndex)
				let firstTouch=e.touches[0];
				this.touch.y1=firstTouch.pageY;
				this.touch.anchorIndex=anchorIndex
				this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],2)
			},
			//鼠标拖动
			onShortcutTouchMove(e){
				//当前移动的第一个位置
				let firstTouch=e.touches[0];
//				console.log(firstTouch)
				this.touch.y2=firstTouch.pageY;
				let dalta=Math.floor((this.touch.y2-this.touch.y1)/HEIGHT)
				let anchorIndex=parseInt(this.touch.anchorIndex)+dalta
				this.$refs.listview.scrollToElement(this.$refs.listGroup[anchorIndex],0)				
			},
			scroll(pos){
				this.scrollY=pos.y
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
		/*width: 20px;*/
		padding: 20px 0;
		border-radius: 10px;
		text-align: center;
		background: rgba(0, 0, 0, 0.3);
		/*background: cyan;*/
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