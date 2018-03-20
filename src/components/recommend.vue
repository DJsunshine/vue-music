<template>
	<div class="recommend">
		<scroll :data="discList" class="recommend-content">
			<div>
			<slider>
				<swiper-slide v-for="slide in swiperSlides" :key="slide.id">
					<a :href="slide.linkUrl">
						<img :src="slide.picUrl">
					</a>
					
				</swiper-slide>
			</slider>
			<div class="recommend-list">
				<h1 class="list-title">热门歌单推荐</h1>
				<ul>
					<li v-for="item in discList" :key="item.id" class="item" >
						<div class="icon">
							<img v-lazy="item.imgurl" width="60" height="60" alt="" />
						</div>
						<div class="text">
							<h2 class="name" v-html="item.creator.name"></h2>
							<p class="desc" v-html="item.dissname"></p>
						</div>
					</li>
				</ul>
			</div>
			</div>
			<div class="loading-container" v-show="!discList.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script>
	import {getRecommend,getDiscList} from '../api/recommend'
	import {ERR_OK} from '../api/config'
	import Slider from '../base/slider'
	import Scroll from '../base/scroll'
	import Loading from '../base/loading'
	export default{
		data(){
			return {
				swiperSlides:[],
				discList:[]
			}

		},
		components:{
			Slider,
			Scroll,
			Loading
		},
		created(){
			this._getRecommend()
			this._getDiscList()
		},
		methods:{
			_getRecommend(){
				getRecommend().then((res)=>{
					if(res.code==ERR_OK){
						this.swiperSlides = res.data.slider;
					}
				})
			},
			_getDiscList(){
				getDiscList().then((res)=>{
					if(res.code==ERR_OK){
						this.discList=res.data.list;
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.recommend{
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
	}
	.recommend-content{
		height: 100%;
		overflow: hidden;
	}
	.slider-wrapper{
		position: relative;
		width: 100%;
		overflow: hidden;
	}
	.recommend-list .list-title{
		height: 65px;
		line-height:65px;
		text-align: center;
		font-size: 14px;
		color:#ffcd32;
	}
	.item{
		display: flex;
		box-sizing: border-box;
		align-items: center;
		padding: 0 20px 20px 20px;
		
	}
	.icon{
		flex: 0 0 60px;
		width: 80px;
		padding-right: 20px;
	}
	.text{
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		line-height: 20px;
		overflow: hidden;
		font-size: 14px;
	}
	.name{
		margin-bottom: 10px;
		color: #fff;
	}
	.desc{
		color: rgba(255, 255, 255, 0.3);
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>