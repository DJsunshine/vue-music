<template>
	<div class="music-list">
		<div class="back">
			<i class="icon-back">&lt;</i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle">
			<div class="filter"></div>
		</div>
	</div>
</template>

<script>
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
			}
		},
		computed:{
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
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
		border-radius: 100%;
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