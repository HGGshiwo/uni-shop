export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: uni.getStorageSync('token') || '',
		userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
		redirect: '',
		otherInfo: {
			collect_shop: 8,
			collect_goods: 14,
			follow_goods: 18,
			footprint: 84
		}
	}),
	getters: {
		fullAddress(state) {
			if (!state.address) return ''
			let address_list = ["porvinceName", "cityName", "countyName", "streetName", "detailInfo"]
			return address_list.reduce((prev, cur) => prev + (state.address[cur] || ''), '')
		},
		otherInfoList(state) {
			let name = {
				collect_shop: "收藏的店铺",
				collect_goods: "收藏的商品",
				follow_goods: "关注的商品",
				footprint: "足迹"
			}
			return Object.entries(state.otherInfo).map(([key, value]) => ({
				text: name[key],
				num: value
			}))
		}
	},
	mutations: {
		setAddress(state, address) {
			state.address = address
			uni.setStorageSync('address', JSON.stringify(address))
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		},
		setToken(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		},
		setRedirect(state, value) {
			state.redirect = value
		}
	},
	actions: {

	}
}