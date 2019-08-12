<template>
	<div class="loading">
		<img src="../assets/loading.gif" width="24" height="24" alt="" />
		<p class="desc">{{title}}</p>
	</div>
</template>

<script>
	export default{
		props:{
			title:{
				type:String,
				default:'正在载入。。。'
			}
		}
	}
</script>

<style scoped="scoped">
	.loading{
		width: 100%;
		text-align: center;
	}
	.desc{
		line-height: 20px;
		font-size: 14px;
		color: white;
	}
</style>