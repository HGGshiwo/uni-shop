<template>
	<swiper indicator-dots circular style="height: 300px;">
		<swiper-item v-for="(image, idx) in goodInfo.pics" :key="idx">
			<image class="swiper-image" :src="image.pics_mid"></image>
		</swiper-item>
	</swiper>
	<view class="price">
		￥{{goodInfo.goods_price}}
	</view>
	<view class="name-container">
		<text class="name">{{goodInfo.goods_name}}</text>
		<view class="star-container">
			<uni-icons type="star" size="20" color="gray"></uni-icons>
			<text>收藏</text>
		</view>
	</view>
	<view style="font-size: small; padding: 10px; background-color: white; color: #1f2f3f">
		快递：免运费
	</view>
	<rich-text :nodes="goodInfo.goods_introduce"></rich-text>
	<uni-goods-nav :fill="true" :options="options" @buttonClick="buttonClick" />
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	
	import config from '@/config.js'
	export default {
		
		data() {
			return {
				goodInfo: {},
			}
		},
		onLoad({ goods_id }) {
			uni.showLoading({
				title: "数据加载中"
			})
			uni.request({
					url: `${config.baseUrl}/api/public/v1/goods/detail?goods_id=${goods_id}`
				})
				.then(res => {
					this.goodInfo = res.data.message
					uni.hideLoading()
				})
		},
		methods: {
			buttonClick() {
				this.add(this.goodInfo)
			},
			...mapMutations('cart', ['add'])
		},
		computed: {
			...mapGetters('cart', ['cartNum']),
			options() { return [{
					icon: 'shop',
					text: '店铺',
					infoBackgroundColor: '#007aff',
					infoColor: "#f5f5f5"
				},
				{
					icon: 'cart',
					text: '购物车',
					info: this.cartNum
				}
			]},
		}
	}
</script>

<style lang="scss">
	.swiper-image {
		width: 100%;
		height: 100%;
	}

	.price {
		color: #aa0000;
		padding: 10px;
		font-size: large;
		background-color: white;
	}

	.name-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		padding: 10px;
	}

	.star-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		text {
			font-size: small;
		}
	}

	.name {
		width: 300px;
	}

	uni-goods-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>