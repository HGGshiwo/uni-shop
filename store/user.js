export default {
	namespaced: true,
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		token: ''
	}),
	getters: {
		fullAddress(state) {
			if (!state.address) return ''
			let address_list = ["porvinceName", "cityName", "countyName", "streetName", "detailInfo"]
			return address_list.reduce((prev, cur) => prev + (state.address[cur] || ''), '')
		},
	},
	mutations:  {
		setAddress(state, address) {
			state.address = address
			this.commit('user/save')
		},
		save(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		}
	},
	actions: {
		
	}
}