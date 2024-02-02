<template>
	<block v-if="cartNum !== 0">
		<view class="container">
			<my-address></my-address>
			<image style="width: 100%; height: 5px;" src="/static/cart_border@2x.png"></image>
			<uni-swipe-action>
				<uni-swipe-action-item v-for="cart in cartList" :key="cart.goods_id" :right-options="options"
					@click="clickDelete(cart.goods_id)">
					<view class="swipe-item-container">
						<radio :checked="cart.checked" color="#aa0000" @click="clickRadio(cart.goods_id)" />
						<view>
							<image :src="cart.goods_small_logo"></image>
						</view>
						<view style="flex: 1; padding: 10px;">
							<view style="font-size: small;">{{cart.goods_name}}</view>
							<view class="price-container">
								<text>￥{{cart.goods_price}}</text>
								<uni-number-box :min="1" @change="(v) => changeValue(cart.goods_id, v)"
									:value="cart.goods_num" />
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<!-- 底部结算栏 -->
		<view class="bottom-container">
			<view>
				<radio :checked="totalChecked" @click="checkAll(!totalChecked)" color="#aa0000">
				</radio>
				<text>全选</text>
			</view>
			<text class="total-text">￥{{totalPrice}}</text>
			<view>
				<button type="warn" @click="settle">结算({{checkNum}})</button>
			</view>
		</view>
	</block>
	<view v-else class="empty-container">
		<image src="/static/cart_empty@2x.png"></image>
		<text>空空如也</text>
	</view>
</template>

<script>
	import set_badge from '@/mixin/set_badge.js'
	import {
		mapState,
		mapGetters,
		mapMutations
	} from 'vuex'
	import config from '@/config.js'

	export default {
		mixins: [set_badge],
		data() {
			return {
				options: [{
					text: "删除",
					style: {
						backgroundColor: 'rgb(255,58,49)'
					}

				}]
			};
		},
		computed: {
			...mapState('cart', ['cartList']),
			...mapGetters('cart', ['totalPrice', 'cartNum', 'totalChecked', 'checkNum']),
			...mapState('user', ['token', 'address']),
			...mapGetters('user', ['fullAddress']),
		},
		methods: {
			...mapMutations('cart', ['add', 'update', 'check', 'checkAll']),
			...mapMutations('user', ['setRedirect']),
			settle() {
				if(this.checkNum === 0) {
					uni.showToast({
						title: "请选择商品",
						icon: 'error'
					})
				}
				 else if(!this.address.userName) {
					 uni.showToast({
					 	title: '请选择收货地址',
						icon: 'error'
					 })
				 }
				 else if(!this.token) {
					var t = 3;
					const showTips = () => {
						uni.showToast({
							title: `请先登录，${t--}s后跳转到登录界面`,
							icon: 'none',
							mask: true //防止用户点击？？好像不是必须的
						})
					 }
					showTips(t)
					this.timer = setInterval(()=>{
						if(t == 0) {
							clearInterval(this.timer)
							this.setRedirect("pages/cart/cart")
							uni.switchTab({
								url: "/pages/my/my"
							})
						}
						else {
							showTips(t)
						}
					}, 1000)
				 }
				 else {
					 //创建订单
					 uni.request({
					 	url: `${config.baseUrl}/api/public/v1/my/orders/create`,
						method: "POST",
						data: {
							order_price: this.totalPrice,
							consignee_addr: this.fullAddress,
							goods: this.cartList.filter(cart => cart.checked).map(cart =>({
								goods_id: cart.goods_id,
								goods_number: cart.goods_num,
								goods_price: cart.goods_price
							}))
						},
						header: {
							Authorization: this.token
						}
					 }).then(res => {
						 console.log(res)
						 uni.showToast({
						 	title: "支付成功！"
						 })
					 })
				 }
			},
			clickRadio(goods_id) {
				this.check(goods_id)
			},
			changeValue(goods_id, value) {
				this.update({
					goods_id,
					value
				})
				this.setBadge()
			},
			clickDelete(goods_id) {
				uni.showModal({
						content: "确定删除商品吗？",
						cancelText: "取消",
						confirmText: "确定"
					})
					.then(res => {
						if (res.confirm) {
							this.changeValue(goods_id, 0)
						}
					})
			}
		}
	}
</script>

<style lang="scss">
	.swipe-item-container {
		background-color: white;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 10px 10px;

		image {
			width: 100px;
			height: 100px;
		}
	}

	.price-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 20px;

		text {
			color: #aa0000;
		}
	}

	.bottom-container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding-left: 10px;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: white;
		height: 50px;
		box-sizing: border-box;
	}

	.total-text {
		color: #aa0000;

		&::before {
			content: '合计：';
			color: black;
		}
	}

	.container {
		padding-bottom: 50px; //解决被结算页面遮挡的问题
	}
	
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-top: 100px;
		
		image {
			width: 100px;
			height: 100px;
		}
		
		text {
			margin-top: 10px;
			color: #5f5f5f;
			font-size: small;
		}
	}
</style>