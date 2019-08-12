<template>
	<div class="swiper_area">
			<swiper :options="swiperOption" ref="mySwiper">
				<div class="swiper-pagination" slot="pagination"></div>
				<slot></slot>
			</swiper>
		</div>
</template>

<script>
	export default{
		data(){
			return {
						swiperOption: {
					//direction : 'vertical',
					grabCursor: true,
					//scrollbar:'.swiper-scrollbar',//页面滚轮
					// prevButton:'.swiper-button-prev',//上一页箭头
					// nextButton:'.swiper-button-next',//下一页箭头
					autoplay:true, //自定播放
					loop: true,
					autoplayDisableOnInteraction : false,
					
					pagination: {
						el: '.swiper-pagination'
					},
					setWrapperSize: true,
					paginationClickable: true,
					mousewheelControl: true,
					observeParents: true
				}
			}
		},
		computed:{
		}

	}
</script>

<style>
	.swiper_area {
		width: 100%;
		/*height: 5.55556rem;*/
		/*height: 100%;*/
		/*background: #fff;*/
		 /*overflow: hidden;*/ 
	}
	
	.swiper_area img {
		width: 100%;
	}
	
	.swiper-pagination-bullet {
		width: 16px;
		height: 3px;
		display: inline-block;
		background: #fff;
		opacity: 0.5;
		border-radius: 0;
	}
	
	.swiper-pagination-bullet-active {
		opacity: 1;
		backface-visibility: #fff;
	}
</style>