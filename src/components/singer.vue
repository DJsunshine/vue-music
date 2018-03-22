<template>
	<div class="singer">
		<list-view @select="selectSinger" :data="singers"></list-view>
		<router-view></router-view>
	</div>
</template>

<script>
	import {getSingerList} from '../api/singer'
	import {ERR_OK} from '../api/config'
	import ListView from '../base/listview'
	import Scroll from '../base/scroll'
	import {mapMutations} from 'vuex'
	export default{
		data(){
			return {
				singers:[]
			}
		},
		created(){
			setTimeout(()=>{
			this._getSingerList()
			},200)

		},
		methods:{
			selectSinger(singer){
				this.$router.push({
					path:`/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			_getSingerList(){
				getSingerList().then((res)=>{
					if(res.code===ERR_OK){
						this.singers=this._normalizeSinger(res.data.list);
					}
				})
			},
			_normalizeSinger(list){
				let map={
					hot:{
						title:"热门",
						items:[]
					}
				}
				list.forEach((item,index)=>{
					if(index<10){
						map.hot.items.push({
							id:item.Fsinger_mid,
							name:item.Fsinger_name,
							avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
						})
					}
				const key=item.Findex;
				if(!map[key]){
					map[key]={
						title:key,
						items:[]
					}
				}
				map[key].items.push({
					id:item.Fsinger_mid,
					name:item.Fsinger_name,
					avatar:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
				})
				})
//				console.log(map)
				//有序列表  处理map
				//这里定义两个数组  一个数据是A-Z的放在ret  一个是热门的放在hot  然后合并数组
				let hot = [];
				let ret = [];
				for(let key in map){
					let val=map[key];
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val)
					}else if(val.title=="热门"){
						hot.push(val)
					}
				}
				ret.sort((a,b)=>{
					return a.title.charCodeAt(0)-b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			},
				...mapMutations({
				setSinger:'SET_SINGER'
			})
			
		},
		components:{
			ListView,
			Scroll
		}
	}
</script>

<style>
	.singer{
		position:fixed;
		top: 88px;
		bottom: 0;
		width: 100%;
	}
</style>