import { mapGetters } from 'vuex'

export default {
	methods: {
		setBadge() {
			if (this.cartNum > 0) {
				uni.setTabBarBadge({
					index: 2,
					text: `${this.cartNum}`
				})
			}
		}
	},
	onShow() {
		this.setBadge()
	},
	computed: {
		...mapGetters('cart', ['cartNum'])
	}
}