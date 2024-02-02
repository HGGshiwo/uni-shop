<template>
	<view class="search-container">
		<uni-search-bar placeholder="请输入搜索内容" @confirm="search" @clear="clear" @cancel="clear">			
		</uni-search-bar>
	</view>
	<block v-if="resultList.length === 0">
		<view class="row-container">
			<text>历史记录</text>
			<uni-icons type="trash-filled" size="18px" @click="deleteHistory"></uni-icons>
		</view>
		<view class="tag-container" :style="{height: wh1 + 'px'}">
			<view v-for="history in historyList" :key="history" class="tag">
				{{history}}
			</view>
		</view>
	</block>
	<scroll-view scroll-y v-else :style="{height: wh2 + 'px'}">
		<navigator v-for="(item, index) in resultList" :key="index" :url="`/subpkg/good_detail/good_detail?goods_id=${item.goods_id}`">
			<view class="result-container">
				<text>{{item.goods_name}}</text>
				<uni-icons type="right"></uni-icons>
			</view>
		</navigator>
	</scroll-view>
</template>

<script>
	import config from '@/config.js'
	
	export default {
		data() {
			return {
				historyList: [],
				resultList: [],
				wh1: 0,
				wh2: 0,
			};
		},
		methods: {
			clear() {
				this.resultList = []
			},
			deleteHistory() {
				this.historyList = []
				uni.setStorageSync('history', '[]')
			},
			search({value}) {
				if(!value) return
				const new_historyList = this.historyList.filter(res => res !== value)
				new_historyList.unshift(value)
				uni.setStorageSync('history', JSON.stringify(new_historyList))
				this.historyList = new_historyList
				uni.showLoading({
					title: "加载数据中"
				})
				uni.request({
					url: `${config.baseUrl}/api/public/v1/goods/search?query=${value}`
				})
				.then(res => {
					this.resultList = res.data.message.goods
					uni.hideLoading()
					if(res.data.message.goods.length === 0) {
						uni.showToast({
							title: "搜索结果为空"
						})
					}
				})
			}
		},
		onLoad() {
			const systemInfo = uni.getSystemInfoSync()
			this.wh1 = systemInfo.windowHeight - 60 - 56
			this.wh2 = systemInfo.windowHeight - 56
			console.log(systemInfo.windowHeight)
			this.historyList = JSON.parse(uni.getStorageSync('history') || '[]') 
		},
	}
</script>

<style lang="scss">
	.search-container {
		background-color: #aa0000;
		height: 56px;
	}
	
	.uni-searchbar__cancel {
		color: white !important;
	}
	
	.row-container {
		display: flex;
		width: 100%;
		background-color: white;
		padding: 10px;
		box-sizing: border-box;
		justify-content: space-between;
		height: 40px;
	}
	
	.tag-container {
		padding: 10px;
		background-color: white;
		display: flex;
		flex-direction: row;
	}
	
	.tag {
		margin: 10px;
		background-color: #efefef;
		color: gray;
		border-radius: 10px;
		padding: 5px 10px;
		font-size: small;
		width: fit-content;
		height: fit-content;
	}
	
	.result-container {
		display: flex;
		flex-direction: row;
		padding: 10px;
		background-color: white;
	}
</style>
