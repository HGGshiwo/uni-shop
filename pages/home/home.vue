<template>
	<view class="search-container" @click="toSearch">
		<uni-search-bar readonly placeholder="请输入搜索内容"></uni-search-bar>
	</view>
	<swiper indicator-dots circular autoplay style="margin-top: 56px;">
		<swiper-item v-for="(item, idx) in swiperList" :key="idx">
			<navigator :url="`/subpkg/good_detail/good_detail?goods_id=${item.goods_id}`">
				<image mode="widthFix" :src="item.image_src" style="width: 100%;"></image>
			</navigator>
		</swiper-item>
	</swiper>
	<view class="nav-list-container">
		<view v-for="(item, idx) in navList" :key="idx">
			<navigator open-type="switchTab" url="/pages/cate/cate">
				<image mode="widthFix" :src="item.image_src"></image>
			</navigator>
		</view>
	</view>
	<view class="floor-list-container" v-for="(item, idx) in floorList" :key="idx">
		<image mode="widthFix" :src="item.floor_title.image_src" class="floor-list-title"></image>
		<view class="floor-list-row">
			<view>
				<navigator :open-type="item.product_list[0].open_type" :url="item.product_list[0].navigator_url">
					<image mode="widthFix" :src="item.product_list[0].image_src"
						:style="{width: item.product_list[0].image_width + 'rpx'}"></image>
				</navigator>
			</view>
			<view class="floor-list-block">
				<navigator :open-type="img_item.open_type" :url="img_item.navigator_url"
					v-for="img_item in item.product_list.slice(1)" :key="img_item.name">
					<image :src="img_item.image_src" mode="widthFix" :style="{width: img_item.image_width + 'rpx'}">
					</image>
				</navigator>
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
			toSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
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
					this.floorList = res.data.message.map(data => {
						return {
							...data,
							product_list: data.product_list.map(product => {
								return {
									...product,
									navigator_url: `/subpkg/good_list/good_list?query=${product.navigator_url.split("=")[1]}`
								}
							})
						}
					})
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
		position: fixed;
		top: 0;
		left: 0;
		height: 56px;
		width: 100%;
		z-index: 999;
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