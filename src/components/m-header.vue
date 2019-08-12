<template>
	<div class="m-header">
		<div class="icon"></div>
		<div class="text">Music</div>
	</div>
</template>

<script>
	export default{
		
	}
</script>

<style scoped>
	.m-header{
		position: relative;
		height: 44px;
		text-align: center;
		color: ;
		font-size: 0;
		border:1px solid red;
	}
	.icon{
		display: inline-block;
		vertical-align: top;
		margin-top: 6px;
		width: 30px;
		height: 32px;
		margin-right: 9px;
		background-image: url(../assets/default.png);
		background-size: 30px 32px;
	}
	.text{
		display: inline-block;
		vertical-align: top;
		line-height: 44px;
		font-size:16px;
		color: orange;
	}
</style>