<template>
	  <div class="progressbar" ref="progressBar">
    	<div class="bar-inner">
     	 	<div class="progress" ref="progress"></div>
      			<div class="progress-btn-wrapper" ref="progressBtn"
      >
        		<div class="progress-btn"></div>
     		 </div>
    	</div>
  	</div>
</template>

<script>
	const ball=16
	export default{
		props:{
			percent:{
				type:Number,
				default:0
			}
		},
		watch:{
			percent(newPercent){
//				console.log(newPercent)
				if(newPercent>=0){
					const barWidth=this.$refs.progressBar.clientWidth-ball
					console.log(barWidth)
					const offsetWidth=newPercent * barWidth
					this.$refs.progress.style.width=`${offsetWidth}px`
					this.$refs.progressBtn.style['transform']=`translate3d(${offsetWidth}px,0,0)`
//				this.$refs.layer.style['transform']=`translate3d(0,${tranlateY}px,0)`
					
				}
			}
		}
	}
</script>

<style>
	.progressbar{
		height: 30px;
	}
	.bar-inner{
		position: relative;
		top: 13px;
		height: 4px;
		background: rgba(0,0,0,0.3);
	}
	.progress{
		position: absolute;
		height: 100%;
		background: #FFCD32;
	}
	.progress-btn-wrapper{
		position: absolute;
		left: -8px;
		top: -13px;
		width: 30px;
		height: 30px;
	}
	.progress-btn{
		position: relative;
		top: 7px;
		left: 7px;
		box-sizing: border-box;
		width: 16px;
		height: 16px;
		border: 3px solid #fff;
		border-radius: 50%;
		background: #FFCD32;
	}
</style>