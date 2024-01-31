<template>
	<scroll-view scroll-y :style="{height: wh + 'px'}" @scrolltolower="loadMore">
		<view class="container" v-for="(good, i) in goodList" :key="i" @click="handleClick(good.goods_id)">
			<view>
				<image :src="good.goods_big_logo"></image>
			</view>
			<view class="text-container">
				<text style="font-size: small;">{{good.goods_name}}</text>
				<text class="price">￥{{good.goods_price}}</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import config from '@/config.js'
	export default {
		data() {
			return {
				goodList: [],
				wh: 0,
			};
		},
		onLoad({
			cid
		}) {
			this.cid = cid
			this.pagenum = 0
			this.total = 1
			this.pagesize = 20
			this.loading = false

			const sysInfo = uni.getSystemInfoSync()
			this.wh = sysInfo.windowHeight
			this.loadPage()
		},
		methods: {
			loadPage() {
				if (this.loading) return
				this.loading = true
				uni.showLoading({
					title: "请求数据中"
				})
				uni.request({
						url: `${config.baseUrl}/api/public/v1/goods/search?cid=${this.cid}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
					})
					.then(res => {
						this.goodList = this.goodList.concat(res.data.message.goods)
						this.total = res.data.message.total
						this.loading = false
						uni.hideLoading()
					})
			},
			loadMore() {
				if (this.pagenum * this.pagesize >= this.total) {
					if (this.loading) return
					uni.showToast({
						title: "没有更多了",
						icon: "none"
					})
				} else {
					this.pagenum += 1
					this.loadPage()
				}

			},
			handleClick(goods_id) {
				uni.navigateTo({
					url: `/subpkg/good_detail/good_detail?goods_id=${goods_id}`
				})
			}
		},
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: row;

		image {
			height: 100px;
			width: 100px;
		}
	}

	.text-container {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding: 10px;
	}

	.price {
		color: #cc0000;
	}
</style>