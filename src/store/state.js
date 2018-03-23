import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import {playMode} from '../js/config'

Vue.use(Vuex)

const state={
	
	singer:{},
	playing:false,//播放状态
	fullScreen:false,//是否全屏和缩小
	playlist:[],//播放列表
	sequenceList:[],//随机列表
	mode:playMode.sequence,//播放模式
	currentIndex:-1,//当前播放的索引
}

const mutations={

	SET_SINGER(state,singer){
		state.singer=singer
	},
	SET_PLAYING_STATE(state,flag){
		state.playing=flag
	},
	SET_FULL_SCREEN(state,flag){
		state.fullScreen=flag
	},
	SET_PLAYLIST(state,list){
		state.playlist=list
	},
	SET_SEQUENCE_LIST(state,list){
		state.sequenceList=list
	},
	SET_PLAY_MODE(state,mode){
		state.playMode=mode
	},
	SET_CURRENT_INDEX(state,index){
		state.currentIndex=index
	}
	
}

const actions={
	selectPlay({commit,state},{list,index}){
		commit('SET_SEQUENCE_LIST',list)
		commit('SET_PLAYLIST',list)
		commit('SET_CURRENT_INDEX',index)
		commit('SET_FULL_SCREEN',true)
		commit('SET_PLAYING_STATE',true)
		
	}
}

const getters={
	singer(state){
		return state.singer
	},
	playing(state){
		return state.playing
	},
	fullScreen(state){
		return state.fullScreen
	},
	playlist(state){
		return state.playlist
	},
	sequenceList(state){
		return state.sequenceList
	},
	mode(state){
		return state.mode
	},
	currentIndex(state){
		return state.currentIndex
	},
	currentSong(state){
		return state.playlist[state.currentIndex] || {}
	}
}

const debug=process.env.NODE_ENV !=='production'

export default new Vuex.Store({
		state,
		mutations,
		actions,
		getters,
		strict:debug,
		plugins:debug?[createLogger()]:[]
})
