<template>
	<view v-if="!token" class="container">
		<uni-icons type="contact-filled" size="100" color="#9f9f9f"></uni-icons>
		<button open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
		<text class="login-text">登录后尽享更多权益</text>
		<view class="block"></view>
	</view>
	<view v-else>
		<view class="top-container">
			<view class="avatar-container">
				<image :src="userInfo.avatarUrl"></image>
				<text>{{userInfo.nickName}}</text>
			</view>
			<view class="info-container">
				<view v-for="otherInfo in otherInfoList" :key="otherInfo.text">
					<text>{{otherInfo.num}}</text>
					<text>{{otherInfo.text}}</text>
				</view>
			</view>
		</view>
		<view class="bottom-container">
			<text>我的订单</text>
			<view class="row-container">
				<view>
					<image src="@/static/my-icons/icon1.png"></image>
					<text>待付款</text>
				</view>
				<view>
					<image src="@/static/my-icons/icon2.png"></image>
					<text>待收货</text>
				</view>
				<view>
					<image src="@/static/my-icons/icon3.png"></image>
					<text>退款/退货</text>
				</view>
				<view>
					<image src="@/static/my-icons/icon4.png"></image>
					<text>全部订单</text>
				</view>
			</view>
		</view>
		<view class="list-container">
			<view>
				<text>收货地址</text>
				<uni-icons type="right"></uni-icons>
			</view>
			<view>
				<text>联系客服</text>
				<uni-icons type="right"></uni-icons>
			</view>
			<view @click="logout">
				<text>退出登录</text>
				<uni-icons type="right"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script>
	import set_badge from '@/mixin/set_badge.js'
	import {
		mapMutations,
		mapState,
		mapGetters
	} from 'vuex'
	import config from '@/config.js'

	export default {
		mixins: [set_badge],
		data() {
			return {

			};
		},
		computed: {
			...mapState('user', ['token', 'userInfo', 'redirect']),
			...mapGetters('user', ['otherInfoList'])
		},
		methods: {
			...mapMutations('user', ['setUserInfo', 'setToken', 'setRedirect']),
			logout() {
				this.setToken('')
				this.setUserInfo({})
			},
			getUserInfo({
				detail
			}) {
				var userInfo = detail.userInfo
				uni.showModal({
						content: "小程序需要获取微信头像和信息"
					}).then(res => {
						if (res.confirm) {
							uni.getUserProfile({
									desc: "获取您的微信头像和昵称"
								})
								.then(res => {
									//如果用户同意获取个人信息，则替换成用户信息
									userInfo = res.userInfo
								})
						}
					})
					.finally(res => {
						this.setUserInfo(userInfo)
						// 调用登录接口
						uni.login()
						.then(res => {
							uni.request({
									method: "POST",
									data: {
										encryptedData: detail.encryptedData,
										rawData: detail.rawData,
										iv: detail.iv,
										signature: detail.signature,
										code: res.code
									},
									url: `${config.baseUrl}/api/public/v1/users/wxlogin`
								})
								.then(res => {
									// this.setToken(res.data.message.token)
									this.setToken(
										"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
										)
									//如果需要跳转，则这里跳
									if(!!this.redirect) {
										uni.switchTab({
											url: "/pages/cart/cart"
										})
										this.setRedirect(null) //由于switchTab不能携带参数，只能通过全局传参
									}
								})
						})
					})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 100px;

		button {
			background-color: #aa0000;
			color: white;
			border-radius: 40px;
			width: 80%;
			box-sizing: border-box;
		}
	}

	.login-text {
		font-size: small;
		padding-top: 10px;
		color: grey;
	}

	.block {
		height: 200px;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		background-color: white;

		&::before {
			content: '';
			display: block;
			height: 20px;
			width: 100%;
			border-radius: 100%;
			position: absolute;
			left: 0;
			top: -20px;
			background-color: white;
			transform: translateY(50%);
		}
	}

	.top-container {
		background-color: #aa0000;
		height: 200px;
		padding-top: 30px;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 50px;
	}

	.avatar-container {
		display: flex;
		flex-direction: column;
		align-items: center;

		image {
			width: 80px;
			height: 80px;
			border-radius: 40px;
			box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
			border-width: 2px;
			border-color: gray;
		}

		text {
			color: #efefef;
			padding-top: 10px;
		}
	}

	.info-container {
		margin-top: auto;
		transform: translateY(50%);
		background-color: white;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 60px;
		width: calc(100% - 20px);
		box-sizing: border-box;
		border-radius: 5px;
		position: relative;
		bottom: 0px;
		padding: 10px;

		view {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}

	.bottom-container {
		background-color: white;
		padding: 10px;
		margin: 10px;
		
		.row-container {
			padding-top: 10px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			
			image {
				width: 30px;
				height: 30px;
			}
			
			view {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 14px;
			}
		}

	}
	
	.list-container {
		background-color: white;
		margin: 10px;
		border-radius: 5px;
		
		view {
			padding: 10px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
		
		view:not(:last-child) {
			border-bottom: 1px solid lightgrey; 
		}
	}
</style>