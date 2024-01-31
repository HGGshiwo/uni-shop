export default {
	namespaced: true,
	state: () => ({
		cartList: JSON.parse(uni.getStorageSync("cart") || '[]')
	}),
	getters: {
		cartNum(state) { //购物车中的商品总数量
			return state.cartList.reduce((prev, cur) => prev + cur.goods_num, 0)
		},
		totalPrice(state) {
			return state.cartList.reduce((prev, cur) => prev + (cur.checked ? cur.goods_price * cur.goods_num: 0), 0)
		},
		checkNum(state) { //购物车中选中商品的总数量
			return state.cartList.reduce((prev, cur) => prev + (cur.checked ? cur.goods_num : 0), 0)
		},
		totalChecked(state) {
			if (state.cartList.length === 0) return false
			return state.cartList.reduce((prev, cur) => prev && cur.checked, true)
		}
	},
	mutations: {
		add(state, cart) {
			var good = state.cartList.find(good => good.goods_id === cart.goods_id)
			if (!!good) {
				good.goods_num += 1
			} else {
				state.cartList.push({
					...cart,
					goods_num: 1,
					checked: false,
				})
			}
			this.commit("cart/save")
		},
		update(state, { goods_id, value }) {
			var index = state.cartList.findIndex(good => good.goods_id === goods_id)
			var good = state.cartList[index]
			if(value === 0) {
				state.cartList.splice(index, 1)
			}
			else {
				good.goods_num = value
			}
			this.commit("cart/save")
		},
		check(state, goods_id) {
			var good = state.cartList.find(good => good.goods_id === goods_id)
			good.checked = !good.checked
			this.commit("cart/save")
		},
		checkAll(state, value) {
			state.cartList.forEach(cart => cart.checked = value)
			this.commit("cart/save")
		},
		save(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cartList))
		}
	},
	actions: {

	}
}