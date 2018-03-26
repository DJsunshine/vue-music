import {commonParams,options} from './config'
import axios from 'axios'

export function getLyric(mid){
	const url = '/api/lyric'
	 
	const data=Object.assign({},commonParams,{
		musicid:mid,
		pcachetime:+new Date(),
		platform:'yqq',
		hostUin:0,
		needNewCode:0,
		categoryId:10000000,
		format :'json',
		gtk:5381
	})
	
	return axios.get(url,{
		params:data
	}).then((res)=>{
		return Promise.resolve(res.data)
	})
}
