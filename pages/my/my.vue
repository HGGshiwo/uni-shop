<template>
	<view class="container">
		<uni-icons type="contact-filled" size="100" color="#9f9f9f"></uni-icons>
		<button>一键登录</button>
		<text class="login-text">登录后尽享更多权益</text>
		<view class="block"></view>
	</view>
</template>

<script>
	import set_badge from '@/mixin/set_badge.js'

	export default {
		mixins: [set_badge],
		data() {
			return {

			};
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
</style>