<template>
	<transition name="silde">
		<music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script>
	import MusicList from '../components/music-list'
	import {mapGetters} from 'vuex'
	import {getMusicList} from '../api/rank'
	import {ERR_OK} from '../api/config'
	export default{
		data(){
			return {
				songs:[],
				rank:true
			}
		},
		computed:{
			title(){
				return this.topList.topTitle
			},
			bgImage(){
				if(this.songs.length){
					return this.songs[0].image
				}
				return ''
			},
			...mapGetters([
				'topList'
			])
		},
		created(){
			this._getMusicList()
		},
		methods:{
			_getMusicList(){
				if(!this.topList.id){
					this.$router.push({
						path:"/rank"
					})
					return
				}
				getMusicList(this.topList.id).then((res)=>{
					this.songs=this._normalizeSongs(res.songlist)
				})
			},
				singers(singer){
				let ret=[]
				if(!singer){
					return ''
				}
				for(var i of singer){
					ret.push(i.name)
				}
				
				return ret.join('/')
			},
			_normalizeSongs(list){
//				console.log(list)
				let ret=[]
				for(let a of list){
					var aa=a.data
					console.log(aa)
					if(aa.songid && aa.albummid){
						ret.push({
						id:aa.songid,
						mid:aa.songmid,
						singer:this.singers(aa.singer),
						name:aa.songname,
						album:aa.albumname,
						duration:aa.interval,
						image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${aa.albummid}.jpg?max_age=2592000`,
						url: `http://isure.stream.qqmusic.qq.com/C100${aa.songmid}.m4a?fromtag=32`
//						`http://ws.stream.qqmusic.qq.com/${aa.songid}.m4a?fromtag=46`
					})	
					}
				}
				
				console.log(ret)
				return ret
			}
		},
		components:{
			MusicList
		}
	}
</script>

<style scoped="scoped">
	.slide-enter-active, .slide-leave-active{
		transition: all .3s;
	}
	.slide-enter, .slide-leave-to{
		transform: translate3d(100%,0,0);
	}
</style>