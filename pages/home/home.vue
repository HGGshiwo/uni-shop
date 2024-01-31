<template>
	<view class="search-container">
		<uni-search-bar placeholder="请输入搜索内容"></uni-search-bar>
	</view>
	<swiper indicator-dots circular autoplay>
		<swiper-item v-for="(item, idx) in swiperList" :key="idx">
			<image mode="widthFix" :src="item.image_src" style="width: 100%;"></image>
		</swiper-item>
	</swiper>
	<view class="nav-list-container">
		<view v-for="(item, idx) in navList" :key="idx">
			<image mode="widthFix" :src="item.image_src"></image>
		</view>
	</view>
	<view class="floor-list-container" v-for="(item, idx) in floorList" :key="idx">
		<image mode="widthFix" :src="item.floor_title.image_src" class="floor-list-title"></image>
		<view class="floor-list-row">
			<view>
				<image mode="widthFix" :src="item.product_list[0].image_src"
					:style="{width: item.product_list[0].image_width + 'rpx'}"></image>
			</view>
			<view class="floor-list-block">
				<image v-for="img_item in item.product_list.slice(1)" :src="img_item.image_src" mode="widthFix"
					:style="{width: img_item.image_width + 'rpx'}" :key="img_item.name"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import config from '@/config.js'
	import set_badge from '@/mixin/set_badge.js'

	export default {
		mixins: [set_badge],
		data() {
			return {
				swiperList: [],
				navList: [],
				floorList: [],
			};
		},
		methods: {

		},
		onLoad() {
			var loading = 0;
			uni.showLoading({
				title: "加载数据中"
			})
			uni.request({
					url: `${config.baseUrl}/api/public/v1/home/swiperdata`
				})
				.then(res => {
					this.swiperList = res.data.message
					loading += 1
					if (loading == 3) {
						uni.hideLoading()
					}
				})
			uni.request({
					url: `${config.baseUrl}/api/public/v1/home/catitems`
				})
				.then(res => {
					this.navList = res.data.message
					loading += 1
					if (loading == 3) {
						uni.hideLoading()
					}
				})
			uni.request({
					url: `${config.baseUrl}/api/public/v1/home/floordata`
				})
				.then(res => {
					this.floorList = res.data.message
					loading += 1
					if (loading == 3) {
						uni.hideLoading()
					}
				})
		}
	}
</script>

<style lang="scss">
	.search-container {
		background-color: #aa0000;
	}

	.nav-list-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;

		image {
			width: 120rpx;
		}
	}

	.floor-list-container {
		margin-top: 20rpx;
	}

	.floor-list-row {
		display: flex;
		padding-left: 10rpx;
	}

	.floor-list-block {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
	}
</style>