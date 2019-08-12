<template>
	<div class="rank" ref="rank">
		<scroll class="toplist" :data="topList" ref="toplist">
			<ul>
				<li class="item" v-for="item in topList" @click="selectItem(item)">
					<div class="icon">
						<img width="100" height="100" v-lazy="item.picUrl">
					</div>
					<ul class="songlist">
						<li class="song" v-for="(song,index) in item.songList">
							<span>{{index+1}}</span>
							<span>{{song.songname}}-{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
			<div class="loading-container" v-show="!topList.length">
				<loading></loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>

<script>
	import {getTopList} from '../api/rank'
	import {ERR_OK} from '../api/config'
	import Scroll from '../base/scroll'
	import Loading from '../base/loading'
	import {mapGetters,mapMutations} from 'vuex'
	export default{
		components:{
			Scroll,
			Loading
		},
		computed:{
			...mapGetters([
				'fullScreen'
			])
		},
		watch:{
			fullScreen(newVal){
				console.log(newVal)
				const bottm =this.fullScreen ? "0px":"80px"
				console.log(bottm)
				this.$refs.rank.style.bottom=bottm
				this.$refs.toplist.refresh()
			}
		},
		created(){
			setTimeout(()=>{
			this._getTopList()
			},1000)

		},
		activated(){
			this.$refs.toplist.refresh()
		},
		data(){
			return {
				topList:[]
			}
		},
		methods:{
			_getTopList(){
				getTopList().then((res)=>{
					if(res.code === ERR_OK){
						this.topList=(res.data.topList)
					}
				})
			},
			selectItem(item){
				console.log(item)
				this.$router.push({
					path:`/rank/${item.id}`
				})
				this.setTopList(item)
			},
			...mapMutations({
				setTopList:'SET_TOP_LIST'
			})
		}
	}
</script>

<style scoped="scoped">
	.rank{
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
	}
	.toplist{
		height: 100%;
		overflow: hidden;
	}
	.item{
		display: flex;
		margin: 0 20px;
		padding-top: 20px;
		height: 120px;
	}
	.item:last-child{
		padding-bottom: 20px;
	}
	.icon{
		flex: 0 0 100px;
		width: 100px;
		height: 100px;
	}
	.songlist{
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 20px;
		height: 100px;
		overflow: hidden;
		background-color: #333;
		color: rgba(255, 255, 255, 0.3);
		font-size: 12px;
		}
	.song{
		white-space: nowrap;
		line-height: 26px;
	}
	.loading-container{
		position: absolute;
		width: 100%;
		top: 50%;
		transform: translateY(-50%);
	}
</style>