<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal">
		<div class="normal-player" v-show="fullScreen">
			<div class="background">
				<img width="100%" height="100%" :src="currentSong.image" />
			</div>
			<div class="top">
				<div class="back" @click="back">
					<i class="icon-back glyphicon glyphicon-menu-left"></i>
				</div>
				<h1 class="title" v-html="currentSong.name"></h1>
				<h2 class="subtitle" v-html="currentSong.singer">薛之谦</h2>
			</div>
			<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
				<div class="middle-l" ref="middleL">
					<div class="cd-wrapper">
						<div class="cd" :class="cdCls">
							<img class="image" :src="currentSong.image" :class="cdCls"/>
						</div>
					</div>
				</div>
				<scroll class="middle-r" ref="lyricList" :data="currentLryic && currentLryic.lines">
					<div class="lyric-wrapper">
						<div v-if="currentLryic">
							<p ref="lyricLine"
								class="text"
								:class="{'current':currentLineNum === index}"
								v-for="(line,index) in currentLryic.lines">
								{{line.txt}}
							</p>
						</div>
					</div>
				</scroll>
			</div>
			<div class="bottom">
				<div class="dot-wrapper">
					<span class="dot" :class="{'active':currentShow==='cd'}"></span>
					<span class="dot" :class="{'active':currentShow==='lyric'}"></span>
					
				</div>
				<div class="progress-wrapper">
					<span class="time time-l">{{format(currentTime)}}</span>
					<div class="progress-bar-wrapper">
						<progress-bar :percent="percent"></progress-bar>
					</div>
					<span class="time time-r">{{format(currentSong.duration)}}</span>
				</div>
				<div class="operators">
					<div class="icon i-left">
						<i class="glyphicon glyphicon-random"></i>
					</div>
					<div class="icon i-left" :class="disableCls">
						<i @click="prev" class="glyphicon glyphicon-backward"></i>
					</div>
					<div class="icon i-center" :class="disableCls">
						<i @click="togglePlaying" class="glyphicon" :class="playIcon"></i>
					</div>
					<div class="icon i-right" :class="disableCls">
						<i @click="next" class="glyphicon glyphicon-forward"></i>
					</div>
					<div class="icon i-right">
						<i class="glyphicon glyphicon-heart"></i>
					</div>
				</div>
			</div>
		</div>
		</transition>
		<transition name="mini">
		<div class="mini-player" v-show="!fullScreen" @click="open">
			<div class="icon">
				<div class="imgWrapper" :class="cdCls">
					<img width="40" height="40" :src="currentSong.image" />					
				</div>
			</div>
			<div class="text">
				<h2 class="name" v-html="currentSong.name"></h2>
				<p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
				<i @click.stop="togglePlaying" class="glyphicon" :class="miniIcon"></i>
			</div>
			<div class="control">
				<i class="glyphicon glyphicon-th-list"></i>
			</div>
		</div>
		</transition>
		<audio @timeupdate="updateTime" @canplay="ready" @error="error" ref="audio" :src="currentSong.url"></audio>
	</div>
</template>

<script>
	import { mapGetters,mapMutations } from 'vuex'
	import ProgressBar from '../base/progress-bar'
	import {getLyric} from '../api/song'
	import {ERR_OK} from '../api/config'
	import {Base64} from 'js-base64'
	import Lyric from 'lyric-parser'
	import Scroll from '../base/scroll'
	export default {
		components:{
			ProgressBar,
			Scroll
		},
		data(){
			return {
				songReady:false,
				currentTime:0,
				currentLryic:null,
				currentLineNum:0,
				currentShow:"cd"
			}
		},
		computed: {
			cdCls(){
				return this.playing?"play":"pause"
			},
			playIcon(){
				return this.playing?"glyphicon-pause":"glyphicon-play"
			},
			miniIcon(){
				return this.playing?"glyphicon-pause":"glyphicon-play-circle"
			},
			disableCls(){
				return this.songReady?'':'disable'
			},
			percent(){
				return this.currentTime / this.currentSong.duration
			},
			...mapGetters([
				'fullScreen',
				'playlist',
				'currentSong',//当前歌曲的所有信息
				'playing',
				'currentIndex'
			]),
		},
		created(){
			this.touch={}
		},
		methods:{
			format(interval){
				interval=interval | 0
				const minute=interval /60 |0
				const second=this._pad(interval%60)
				return `${minute}:${second}`
			},
			middleTouchStart(e){
				this.touch.initiated=true
				this.touch.moved=false
				const touch=e.touches[0]
				this.touch.startX=touch.pageX
				this.touch.startY=touch.pageY
			},
			middleTouchMove(e){
				if(!this.touch.initiated){
					return 
				}
				const touch=e.touches[0]
				const deltaX=touch.pageX-this.touch.startX
				const deltaY=touch.pageY-this.touch.startY
				if(Math.abs(deltaY)>Math.abs(deltaX)){
					return 
				}
				if(!this.touch.moved){
					this.touch.moved=true
				}
				const left=this.currentShow==='cd'? 0:-window.innerWidth
				const offsetWidth=Math.min(0,Math.max(-window.innerWidth,left+deltaX))
				this.touch.percent=Math.abs(offsetWidth/window.innerWidth)
				this.$refs.lyricList.$el.style['transform']=`translate3d(${offsetWidth}px,0,0)`
				this.$refs.lyricList.$el.style['webkitTransform']=`translate3d(${offsetWidth}px,0,0)`
				this.$refs.middleL.style.opacity=1-this.touch.percent
			},
			middleTouchEnd(){
				if(!this.touch.moved){
					return
				}
				let offsetWidth
				let opacity
				if(this.currentShow == 'cd'){
					if(this.touch.percent>0.1){
						offsetWidth=-window.innerWidth
						opacity=0
						this.currentShow='lyric'
					}else{
						offsetWidth=0
						opacity=1
					}
				}else{
					if(this.touch.percent<0.9){
						offsetWidth=0
						this.currentShow='cd'
						opacity=1
					}else{
						offsetWidth=-window.innerWidth
						opacity=0
					}
				}
				this.$refs.lyricList.$el.style['transform']=`translate3d(${offsetWidth}px,0,0)`
				this.$refs.lyricList.$el.style['webkitTransform']=`translate3d(${offsetWidth}px,0,0)`
				this.$refs.middleL.style.opacity=opacity
				
				
			},
			_pad(num,n=2){
				let len=num.toString().length
				while (len<n){
					num='0'+num
					len++
				}
				return num
			},
			updateTime(e){
				this.currentTime=e.target.currentTime
			},
			next(){
				if(!this.songReady){
					return 
				}
				let index=this.currentIndex+1
				if(index==this.playlist.length){
					index=0
				}
				this.setCurrentIndex(index)
				if(!this.playing){
					this.togglePlaying();
				}
				this.songReady=false
			},
			prev(){
				if(!this.songReady){
					return 
				}
				let index=this.currentIndex-1
				if(index==-1){
					index=this.playlist.length-1
				}
				this.setCurrentIndex(index)
				if(!this.playing){
					this.togglePlaying();
				}
				this.songReady=false
				
			},
			ready(){
				this.songReady=true
			},
			error(){
				//加载失败或者网络问题的时候 也要保证功能的使用
				this.songReady=true
			},
			open(){
				this.setFullScreen(true)
			},
			back(){
				this.setFullScreen(false)
			},
			togglePlaying(){
				this.setPlayingState(!this.playing)
				if(!this.currentLryic){
					this.currentLryic.togglePlay()
				}
			},
			handleLyric({lineNum, txt}) {
       			 if (!this.$refs.lyricLine) {
         			 return
       			 }
	       	 this.currentLineNum = lineNum
	        	if (lineNum > 5) {
	          let lineEl = this.$refs.lyricLine[lineNum - 5]
	          this.$refs.lyricList.scrollToElement(lineEl, 1000)
	        } else {
	          this.$refs.lyricList.scrollTo(0, 0, 1000)
	        }
	        this.playingLyric = txt
	      },
			...mapMutations({
				setFullScreen:'SET_FULL_SCREEN',
				setPlayingState:"SET_PLAYING_STATE",
				setCurrentIndex:'SET_CURRENT_INDEX'
			})
		},
		watch:{
			currentSong(){
				if(this.currentLryic){
					this.currentLryic.stop()
				}
				this.$nextTick(()=>{
				this.$refs.audio.play()
//				if(this.lyric){
//					return Promise.resolve(this.lyric)
//				}
//				return new Promise((resolve,reject)=>{
						getLyric(this.currentSong.id).then((res)=>{
					if(res.retcode === ERR_OK){
						this.lyric=Base64.decode(res.lyric)
						this.currentLryic=new Lyric(Base64.decode(res.lyric),this.handleLyric)
						if(this.playing){
							this.currentLryic.play()
						}else{
						console.log(this.currentLryic)
						resolve(this.lyric)
						}
					}else{
						reject('no lyric')
					}
				})
//				})
			
				})

			},
			playing(newPlaying){
				const audio=this.$refs.audio
				this.$nextTick(()=>{
					newPlaying? audio.play() : audio.pause()
					
				})
			}
		}
	}
</script>

<style scoped="scoped">
@import url("../../static/bootstrap/css/bootstrap.min.css");
	.normal-player {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 150;
		background: #222;
	}
	.background{
		 position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
	}
	.control .glyphicon-play-circle,.glyphicon-th-list,.control .glyphicon-pause{
		font-size: 32px;
		/*background: orange;*/
		color: orange;
	}
	.top{
		position: relative;
		margin-bottom: 25px;
		/*background: red;*/
	}
	.back{
		position: absolute;
		left: 6px;
		top: 0px;
		z-index: 50;
	}
	.back .icon-back{
		display: block;
		padding: 9px;
		font-size: 22px;
		color: #FFCD32;
		transform: rotate(-90deg);
	}
	.title{
		/*width: 70px;*/
		margin: 0 auto;
		line-height: 40px;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 18px;
		color: #fff;
	}
	.subtitle{
		line-height: 20px;
		text-align: center;
		font-size: 14px;
		color: #fff;
	}
	.middle{
		position: fixed;
		width: 100%;
		top: 80px;
		bottom: 170px;
		white-space: nowrap;
		font-size: 0;
		/*background: oldlace;*/
	}
	.middle-l{
		display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
	}
	.cd-wrapper{
		position: absolute;
    left: 10%;
    top: 0;
    width: 80%;
    box-sizing: border-box;
    height: 100%;
	}
	.cd-wrapper .cd{
	width: 100%;
    height: 100%;
    border-radius: 50%;
	}
	
	 .cd .image{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 50%;
  border: 10px solid rgba(255,255,255,0.1);
}
.cd .play{
	animation: rotate 20s linear infinite;
}
.cd .pause{
	animation-play-state: paused;	
}
.icon .play{
	animation: rotate 20s linear infinite;
	
}
.icon .pause{
	animation-play-state: paused;	
	
}
 .playing-lyric-wrapper {
  width: 80%;
  margin: 30px auto 0 auto;
  overflow: hidden;
  text-align: center;
}
 .playing-lyric-wrapper .playing-lyric {
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.5);
}
.player .normal-player .middle .middle-r {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.player .normal-player .middle .middle-r .lyric-wrapper{
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text{
  line-height: 32px;
  color: rgba(255,255,255,0.5);
  font-size: 14px;
}
.player .normal-player .middle .middle-r .lyric-wrapper .text.current {
  color: #fff;
}
.player .normal-player .middle .middle-r .lyric-wrapper .pure-music{
  padding-top: 50%;
  line-height: 32px;
  color: rgba(255,255,255,0.5);
  font-size: 14px;
}
.player .normal-player .bottom{
  position: absolute;
  bottom: 50px;
  width: 100%;
}
.player .normal-player .bottom .dot-wrapper {
  text-align: center;
  font-size: 0;
}
.player .normal-player .bottom .dot-wrapper .dot {
  display: inline-block;
  vertical-align: middle;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}
.player .normal-player .bottom .dot-wrapper .dot.active {
  width: 20px;
  border-radius: 5px;
  background: rgba(255,255,255,0.8);
}
.player .normal-player .bottom .progress-wrapper {
  display: flex;
      align-items: center;
  width: 80%;
  margin: 0px auto;
  padding: 10px 0;
}
.player .normal-player .bottom .progress-wrapper .time{
  color: #fff;
  font-size: 12px;
  -ms-flex: 0 0 30px;
      flex: 0 0 30px;
  line-height: 30px;
  width: 30px;
}
.player .normal-player .bottom .progress-wrapper .time.time-l {
  text-align: left;
}
.player .normal-player .bottom .progress-wrapper .time.time-r {
  text-align: right;
}
.player .normal-player .bottom .progress-wrapper .progress-bar-wrapper {
      flex: 1;
      /*background: #222;*/
}
.player .normal-player .bottom .operators {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
      align-items: center;
}
.player .normal-player .bottom .operators .icon {
  -ms-flex: 1;
      flex: 1;
  color: #ffcd32;
}
.player .normal-player .bottom .operators .icon.disable {
  color: rgba(255,205,49,0.5);
}
.player .normal-player .bottom .operators .icon i {
  font-size: 30px;
}
.player .normal-player .bottom .operators .i-left{
  text-align: right;
}
.player .normal-player .bottom .operators .i-center {
  padding: 0 20px;
  text-align: center;
}
.player .normal-player .bottom .operators .i-center i {
  font-size: 40px;
}
.player .normal-player .bottom .operators .i-right {
  text-align: left;
}
.player .normal-player .bottom .operators .icon-favorite{
  color: #d93f30;
}
.player .normal-player.normal-enter-active,
.player .normal-player.normal-leave-active{
  transition: all 0.4s;
}
.player .normal-player.normal-enter-active .top,
.player .normal-player.normal-leave-active .top,
.player .normal-player.normal-enter-active .bottom,
.player .normal-player.normal-leave-active .bottom{
  transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
}
.player .normal-player.normal-enter,
.player .normal-player.normal-leave-to {
  opacity: 0;
}
.player .normal-player.normal-enter .top,
.player .normal-player.normal-leave-to .top {
  transform: translate3d(0, -100px, 0);
}
.player .normal-player.normal-enter .bottom,
.player .normal-player.normal-leave-to .bottom {
  transform: translate3d(0, 100px, 0);
}
.player .mini-player {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
      align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: #333;
}
.player .mini-player.mini-enter-active,
.player .mini-player.mini-leave-active {
  transition: all 0.4s;
}
.player .mini-player.mini-enter,
.player .mini-player.mini-leave-to {
  opacity: 0;
}
.player .mini-player .icon {
      flex: 0 0 40px;
  /*width: 40px;*/
  height: 40px;
  padding: 0 10px 0 20px;
  border-radius: 50%;
}
 .mini-player .icon .imgWrapper {
  height: 100%;
  width: 100%;
}
.mini-player .icon .imgWrapper img {
  border-radius: 50%;
}
.player .mini-player .icon .imgWrapper img .play {
  animation: rotate 10s linear infinite;
}
.player .mini-player .icon .imgWrapper img .pause {
  animation-play-state: paused;
}
.player .mini-player .text {
  display: flex;
     flex-direction: column;
      justify-content: center;
      flex: 1;
  line-height: 20px;
  overflow: hidden;
}
.player .mini-player .text .name {
  margin-bottom: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 14px;
  color: #fff;
}
.player .mini-player .text .desc{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}
.player .mini-player .control {
  -ms-flex: 0 0 30px;
      flex: 0 0 30px;
  /*width: 30px;*/
  padding: 0 10px;
}
.player .mini-player .control .icon-play-mini,
.player .mini-player .control .icon-pause-mini,
.player .mini-player .control .icon-playlist {
  font-size: 30px;
  color: rgba(255,205,49,0.5);
}
.player .mini-player .control .icon-mini {
  font-size: 32px;
  position: absolute;
  left: 0;
  top: 0;
}
@keyframes rotate {
0% {
    transform: rotate(0);
}
100% {
    transform: rotate(360deg);
}
}
</style>