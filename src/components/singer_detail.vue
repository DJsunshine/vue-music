<template>
	<transition name="slide">
	<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from '../api/singer'
	import {ERR_OK} from '../api/config'
	import MusicList from './music-list'
	export default{
		data(){
			return {
				songs:[]
			}
		},
		components:{
			MusicList			
		},
		computed:{
			title(){
				return this.singer.name
			},
			bgImage(){
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			])
		},
		created(){
			this._getDetail()
		},
		methods:{
			_getDetail(){
				if(!this.singer.id){
					this.$router.push('/singer')
					return 
				}
				getSingerDetail(this.singer.id).then((res)=>{
					if(res.code===ERR_OK){
						console.log(res.data.list)
						this.songs=this.song(res.data.list)
						console.log(this.songs)
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
			song(list){
				let arr=[]
				for(let i of list){
					const a=i.musicData
					if(a.songid && a.albummid){
						arr.push({
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
				
				return arr
			}
		}
	}
</script>

<style>

	.slide-enter-active,.slide-leave-active{
		transition: all .3s;
	}
	.slide-enter,.slide-leave-to{
		transform: translate3d(100%,0,0);
	}
</style>