<template>
	<div class="song-list">
		<ul>
			<li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item">
				<div class="content">
					<h2 class="name">{{song.name}}</h2>
					<p class="desc">{{getDesc(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default{
		props:{
			songs:{
				type:Array,
				default:[]
			}
		},
		methods:{
			selectItem(item,index){
				this.$emit('selects',item,index)
			},
			getDesc(song){
				return `${song.singer}.${song.album}`
			}
		}
	}
</script>

<style scoped="scoped">
	.song-list .item{
		display: flex;
		align-items: center;
		box-sizing: border-box;
		height: 64px;
		font-size: 14px;
	}
	.content{
		flex: 1;
		line-height: 20px;
		overflow: hidden;
	}
	.name{
		white-space: nowrap;
		color: #fff;
	}
	.desc{
		white-space: nowrap;
		margin-top: 4px;
		color: rgba(255, 255, 255, 0.3);
	}
</style>