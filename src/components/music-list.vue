<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back">&lt;</i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle" ref="bgImages">
			<div class="play-wrapper">
				<div class="play" v-show="songs.length>0" ref="playBtn">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter"></div>
		</div>
		<div class="bg-layer" ref="layer">
			
		</div>
		<scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
			<div class="song-list-wrapper" style="top: 100px;">
				<song-list :rank="rank" @selects="selectItem" :songs="songs">
					
				</song-list>
			</div>
			<div class="loading-container" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script>
	import Scroll from '../base/scroll'
	import SongList from './song-list'
	import Loading from '../base/loading'
	import {mapActions} from 'vuex'
	const NUM=40
	export default{
		props:{
			bgImage:{
				type:String,
				default:''
			},
			songs:{
				type:Array,
				default:[]
			},
			title:{
				type:String,
				default:''
			},
			rank:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
		},
		data(){
			return {
				scrollY:0
			}
		},
		methods:{
			scroll(pos){
				this.scrollY=pos.y
			},
			back(){
				this.$router.back()
			},
			selectItem(item,index){
				this.selectPlay({
					list:this.songs,
					index
				})
			},
			...mapActions([
				'selectPlay'
			])
		},
		watch:{
			scrollY(newY){
				let tranlateY=Math.max(this.minTranslateY,newY)
				let zIndex=0
				let scale=1
				this.$refs.layer.style['transform']=`translate3d(0,${tranlateY}px,0)`
				this.$refs.layer.style['webkitTransform']=`translate3d(0,${tranlateY}px,0)`
					//abs 绝对值 图片高度*scale =percent +1 再成乘 imageHeight
				const percent=Math.abs(newY/this.imageHeight)
				if(newY>0){
					scale+=percent
					zIndex=10
				}
				
				//当滚动距离滚动到顶部的时候
				if(newY<this.minTranslateY){
					console.log(newY+"---"+this.minTranslateY)
					zIndex=10
					this.$refs.bgImages.style.paddingTop=0
					this.$refs.bgImages.style.height=`${NUM}px`	
					this.$refs.playBtn.style.display='none'
				}else{
					console.log(newY+"---"+this.minTranslateY)
					
					this.$refs.bgImages.style.paddingTop='70%'
					this.$refs.bgImages.style.height=0		
					this.$refs.playBtn.style.display=''
				}
				this.$refs.bgImages.style.zIndex=zIndex
				this.$refs.bgImages.style['transform']=`scale(${scale})`
				this.$refs.bgImages.style['webkitTransform']=`scale(${scale})`
			}
		},
		created(){
			 this.probeType=3
			 this.listenScroll=true
		},
		//mounted的时候el刚好被挂载
		mounted(){
			this.imageHeight=this.$refs.bgImages.clientHeight
			this.minTranslateY=-this.imageHeight+NUM
			this.$refs.list.$el.style.top=`${this.$refs.bgImages.clientHeight}px`
		},
		components:{
			Scroll,
			SongList,
			Loading
		}
	}
</script>

<style scoped="scoped">
	.music-list{
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background: #222;
	}
	.back{
		position: absolute;
		top: 0;
		left: 6px;
		z-index: 50;
		
	}
	.icon-back{
		display: block;
		padding: 10px;
		font-size: 22px;
		color: #FFCD32;
	}
	.title{
		position: absolute;
		top: 0;
		left: 10%;
		z-index: 40;
		white-space: nowrap;
		width: 80%;
		text-align: center;
		line-height: 40px;
		font-size: 18px;
		color: #FFFFFF;
	}
	.bg-image{
		position: relative;
		width: 100%;
		height: 0;
		padding-top: 70%;
		transform-origin: top;
		background-size: cover;
	}
	.play-wrapper{
		position: absolute;
		bottom: 20px;
		z-index: 50;
		width: 100%;
	}
	.play{
		box-sizing: border-box;
		width: 135px;
		padding: 7px 0;
		margin: 0 auto;
		text-align: center;
		border: 1px solid #FFCD32;
		color: #FFCD32;
		border-radius: 100px;
		font-size: 0;
	}
	.icon-play{
		display: inline-block;
		vertical-align: middle;
		margin-right: 6px;
		font-size: 16px;
	}
	
	.text{
		display: inline-block;
		vertical-align: middle;
		font-size: 14px;
	}
	.filter{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(7,17,27,0.4);
	}
	.bg-layer{
		position: relative;
		height: 100%;
		background: #222;
	}
	.list{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		background: #222;
	}
	.song-list-wrapper{
		padding: 20px 30px;
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform:translateY(-50%);
	}
</style>