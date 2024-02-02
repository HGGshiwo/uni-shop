<template>
	<view v-if="!address.userName" class="button-container">
		<button type="primary" size="mini" @click="chooseAddress">
			请选择收货地址+
		</button>
	</view>
	<view v-else class="address-container" @click="chooseAddress">
		<view class='top-container'>
			<text>收货人：{{address.userName}}</text>
			<view>
				<text>电话：{{address.telNumber}}</text>
				<uni-icons type="right"></uni-icons>
			</view>
		</view>
		<view>
			收货地址：{{fullAddress}}
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "my-address",
		data() {
			return {

			};
		},
		methods: {
			...mapMutations('user', ['setAddress']),
			chooseAddress() {
				//获取scope.address权限
				const _getAunth = () => {
					uni.showModal({
							content: '检测到您没打开地址权限，是否去设置打开？',
							confirmText: '确认',
							cancelText: '取消',
						})
						.then(res => {
							if (res.cancel) {
								uni.showToast({
									title: "您取消了地址授权！"
								})
								return
							}
							if (res.confirm) {
								uni.openSetting()
									.then(({
										authSetting
									}) => {
										if (authSetting["scope.address"]) {
											uni.showToast({
												title: "您取消了授权！"
											})
										} else {
											uni.showToast({
												title: "授权成功！请选择地址"
											})
										}
									})
							}
						})
				}
				const _chooseAddress = () => {
					uni.chooseAddress()
						.then(res => {
								this.setAddress(res)
							},
							err => {
								console.log(err)
							})
				}

				uni.authorize({
						scope: "scope.address",
					})
					.then(res => _chooseAddress(), //获取成功
						res => _getAunth() //失败，需要打开设置
					)
			}
		},
		computed: {
			...mapGetters('user', ['fullAddress']),
			...mapState('user', ['address']),
		}
	}
</script>

<style lang="scss">
	.button-container {
		padding: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.address-container {
		padding: 10px;
		background-color: white;
	}
	
	.top-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 10px;
	}
</style>