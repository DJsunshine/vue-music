<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage"  :songs="songs"></music-list>
	</transition>
</template>

<script>
	import MusicList from './music-list'
	import {mapGetters} from 'vuex'
	import {getSongList} from "../api/recommend"
	import {ERR_OK} from '../api/config'
	export default{
		data(){
			return{
				songs:[]
			}
		},
		computed:{
			title(){
					return this.disc.dissname
			},
			bgImage(){
				return this.disc.imgurl
			},
			...mapGetters([
				'disc'
			])
		},
		components:{
			MusicList
		},
		created(){
			this._getSongList()
		},
		methods:{
			_getSongList(){
				if(!this.disc.dissid){
					this.$router.push('/recommend')
					return 
				}
				getSongList(this.disc.dissid).then((res)=>{
					 if (res.code === ERR_OK) {
					 	console.log(res.cdlist[0].songlist)
          			this.songs=this._normalizeSongs(res.cdlist[0].songlist)
          }
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
				let ret=[]
				console.log(list)
				for(let a of list){
					if(a.songid && a.albummid){
						ret.push({
						id:a.songid,
						mid:a.songmid,
						singer:this.singers(a.singer),
						name:a.songname,
						album:a.albumname,
						duration:a.interval,
						image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${a.albummid}.jpg?max_age=2592000`,
						url: `http://isure.stream.qqmusic.qq.com/C100${a.songmid}.m4a?fromtag=32`
//						`http://ws.stream.qqmusic.qq.com/${a.songid}.m4a?fromtag=46`
					})	
					}
				}
				
				
				return ret
			}
	
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