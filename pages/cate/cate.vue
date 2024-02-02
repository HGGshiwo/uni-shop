<template>
	<view class="search-container" @click="toSearch">
		<uni-search-bar readonly placeholder="请输入搜索内容"></uni-search-bar>
	</view>
	<view class="container">
		<!-- 左侧第一级菜单 -->
		<scroll-view scroll-y :style="{height: wh + 'px', width: '120px'}">
			<view :class="['scroll-item', idx === active ? 'active': '']" v-for="(item, idx) in cateList"
				:key="item.cat_id" @click="handleTabv1(idx)">
				{{item.cat_name}}
			</view>
		</scroll-view>
		<!-- 右边第二级菜单 -->
		<scroll-view :scroll-top="scrollTop" scroll-y :style="{height: wh + 'px', 'background-color': 'white'}">
			<block v-for="item_v1 in cateList[active].children" :key="item_v1.cat_id">
				<view class="scroll-title">/ {{item_v1.cat_name}} /</view>
				<!-- 第二级子目录 -->
				<view class="sub-container">
					<view class="sub-container-item" v-for="item_v2 in item_v1.children" :key="item_v2.cat_id"
						@click="navigate(item_v2.cat_id)">
						<image :src="item_v2.cat_icon" style="width: 60px; height: 60px"></image>
						<text>{{item_v2.cat_name}}</text>
					</view>
				</view>
			</block>
		</scroll-view>
	</view>
</template>

<script>
	import config from '@/config.js'
	import set_badge from '@/mixin/set_badge.js'

	export default {
		mixins: [set_badge],
		data() {
			return {
				cateList: [{
					children: []
				}], //为了防止cateList未获取时访问children报错
				active: 0,
				wh: 0,
				scrollTop: 0,
			};
		},
		methods: {
			handleTabv1(i) {
				this.active = i
				this.scrollTop = 1 - this.scrollTop //这个值必须变动才可以，如果写死是0只有第一次有效,1和0的效果是类似的
			},
			navigate(cid) {
				uni.navigateTo({
					url: `/subpkg/good_list/good_list?cid=${cid}`
				})
			},
			toSearch() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
		},
		onLoad() {
			const query = uni.createSelectorQuery()
			var searchHeight = 0
			query.select(".search-container").boundingClientRect(data => {
				searchHeight = data.height
				const sysInfo = uni.getSystemInfoSync()
				this.wh = sysInfo.windowHeight - searchHeight
			}).exec()
			uni.showLoading({
				title: "获取数据中"
			})
			uni.request({
					url: `${config.baseUrl}/api/public/v1/categories`
				})
				.then(res => {
					this.cateList = res.data.message
					uni.hideLoading()
				})
		}
	}
</script>

<style lang="scss">
	.search-container {
		height: 56px;
		background-color: #aa0000;
	}

	.scroll-item {
		line-height: 30px;
		padding: 10px;
		font-size: small;

		&.active {
			background-color: white;
			position: relative;

			&::before {
				content: ' ';
				position: absolute;
				top: 10px;
				left: 0;
				width: 3px;
				height: 30px;
				background-color: #aa0000;
			}
		}
	}

	.container {
		display: flex;
		flex-direction: row;
	}

	.scroll-title {
		width: 100%;
		display: flex;
		justify-content: center;
		font-size: 14px;
		margin-top: 10px;
		font-weight: bold;
	}

	.sub-container {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.sub-container-item {
		width: 33.33%;
		flex-direction: column;
		display: flex;
		align-items: center;
		padding: 20px;
		box-sizing: border-box;

		text {
			font-size: 12px;
		}
	}
</style>